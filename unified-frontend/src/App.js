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
  const [destination,setDestination] = useState(''); //新增destination状态

  const parseContent = (text) => {
    const items = [];
    const lines = text.split('\n');
    lines.forEach(line => {
      items.push(line);
    });
    return items;
  };

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

  const handleGuideSubmit = async (destination) => {
    setDestination(destination);// Set the destination
    await fetchContentFromBackend(destination, 'guide', {
      model: 'kimi',
      messages: [{
        role: 'user',
        content: `Generate a general travel itinerary for ${destination} based on the current season, outlining activities for each day. Decide the number of days based on your experience (Format: Day 1:..., Day 2:...). List the activities in an itemized format and keep the description under 300 words.`
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
          {/*去掉条件过滤测试<Route path="/" element={<div>Home Page</div>} />
          <Route path="/guide" element={<div>Guide Page</div>} />
          <Route path="/preferences" element={<div>Preferences Page</div>} />
          <Route path="/recommendations" element={<div>Recommendations Page</div>} />*/}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
