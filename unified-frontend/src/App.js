import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PreferenceForm from './PreferenceForm';
import RecommendationList from './RecommendationList';
import HomePage from './HomePage';
import GuidePage from './GuidePage';
import './App.css';

const App = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [guide, setGuide] = useState('');
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(1); // 新增状态来存储出行天数

  const parseContent = (responseBody) => {
    // Regular expression to match each day along with its activities
    const dayRegex = /-\s\*\*Day\s(\d+):\s(.*?)\*\*\n(.*?)(?=\n- \*\*Day|\n\n- \*\*Day|\n\*\*Day|$)/gs;
    const activityRegex = /-\s(Morning|Late Morning|Afternoon|Evening):\s(.*?)\n/gs;
  
    let guide = [];
    
    let dayMatch;
    while ((dayMatch = dayRegex.exec(responseBody))) {
      let dayNumber = dayMatch[1];
      let dayTheme = dayMatch[2];
      let activities = dayMatch[3];
  
      let dayActivities = [];
      let activityMatch;
      while ((activityMatch = activityRegex.exec(activities))) {
        let time = activityMatch[1];
        let description = activityMatch[2].trim();
  
        dayActivities.push({
          time,
          description
        });
      }
  
      guide.push({
        day: `Day ${dayNumber}: ${dayTheme}`,
        activities: dayActivities
      });
    }
  
    return guide;
  };
  

  /*const parseContent = (text) => {
    const items = [];
    const lines = text.split('\n');
    lines.forEach(line => {
      // 去除行中的双星号
      const cleanedLine = line.replace(/\\(.+?)\\/g, '$1');
      items.push(cleanedLine);
    });
    return items;
  };*/


  const parseRecommendations = (text) => {
    const recommendations = [];
    const lines = text.split('\n');
    let currentPOI = null;

    lines.forEach(line => {
      const match = line.match(/^\d+\.\s\*\*(.+?)\*\*\:\s(.+)/);
      if (match) {
        if (currentPOI) {
          recommendations.push(currentPOI);
        }
        currentPOI = {
          name: match[1],
          description: match[2],
          imageUrl: '' // 这里暂时没有图像URL，可以根据需要添加默认图片或其他逻辑
        };
      } else if (currentPOI) {
        currentPOI.description += ' ' + line;
      }
    });

    if (currentPOI) {
      recommendations.push(currentPOI);
    }

    return recommendations;
  };

  const fetchContentFromBackend = async (destination, type, bodyContent) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/kimi/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyContent)
      });
      const data = await response.json();

      if (type === 'recommendations') {
        setRecommendations(parseRecommendations(data.choices[0].message.content));
      } else if (type === 'guide') {
        setGuide(parseContent(data.choices[0].message.content));
      }
      setLoading(false);
    } catch (error) {
      console.error(`Failed to fetch ${type}:`, error);
      setLoading(false);
    }
  };

  const handleGuideSubmit = async (destination, days) => {
    setDestination(destination); // 设置 destination
    setDays(days); // 设置 days
    await fetchContentFromBackend(destination, 'guide', {
      model: 'kimi',
      messages: [{
        role: 'user',
        content: `Generate a general travel itinerary for ${destination} for ${days} day(s) based on the current season, outlining activities for each day. List the activities in an itemized format and keep the description under 300 words. Please provide a detailed itinerary in a structured format for a trip lasting [number of days] days. Each day should be clearly labeled starting from Day 1 to Day [number of days], followed by a descriptive title for the day's theme. Each activity should be listed with a specific time block (Morning, Late Morning, Afternoon, Evening). Here is the format I need:

- **Day 1: [Theme of the Day]**
  - Morning: [Activity]
  - Late Morning: [Activity]
  - Afternoon: [Activity]
  - Evening: [Activity]

Continue this format for each subsequent day.
Be realistic, espeacially for one (or two)-day trip. Only include the itinerary details and activities without any additional commentary (eg."Certainly! Here is...").`
      }],
      use_search: false,
      stream: false
    });
  };

  const handleSubmit = async (destination, preferences) => {
    const query = preferences.visit.join(', ');
    await fetchContentFromBackend(destination, 'recommendations', {
      model: 'kimi',
      messages: [{
        role: 'user',
        content: `Recommend 3 points of interest in ${destination} for these categories: ${query}.`
      }],
      use_search: false,
      stream: false
    });
  };

  console.log({ HomePage, GuidePage, PreferenceForm, RecommendationList });

  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/guide">Guide</Link>
          <Link to="/preferences">Preferences</Link>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage onSubmit={handleGuideSubmit} />} />
          <Route path="/guide" element={loading ? <div className="loading-spinner"></div> : <GuidePage guide={guide} />} />
          <Route path="/preferences" element={<PreferenceForm onSubmit={handleSubmit} />} />
          <Route path="/recommendations" element={loading ? <div className="loading-spinner"></div> : <RecommendationList recommendations={recommendations} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;