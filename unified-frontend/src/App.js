import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { fetchContentFromBackend, fetchImageUrl, savePOI, saveGuide } from './utils/api';
import { AuthProvider, useAuth } from './AuthContext';
import HomePage from './HomePage';
import GuidePage from './GuidePage';
import PreferenceForm from './PreferenceForm';
import RecommendationList from './RecommendationList';
import LoadingSpinner from './LoadingSpinner';
import Navigation from './Navigation';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import ProfilePage from './ProfilePage';
import ForgetPage from './ForgetPage';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';


// 修改: 更新 ProtectedRoute 组件以处理 loading 状态
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [guide, setGuide] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [currentDestination, setCurrentDestination] = useState('');
  const [preferences, setPreferences] = useState({ visit: [] });

  const handleGuideSubmit = async (destination, days) => {
    setCurrentDestination(destination);
    setConversation([]);
    await fetchContentFromBackend(destination.toUpperCase(), 'guide', {
      model: 'kimi',
      messages: [{
        role: 'user',
        content: `Generate a general travel itinerary for ${destination.toUpperCase()} for ${days} day(s) based on the current season, outlining activities for each day. List the activities in an itemized format and keep the description under 300 words. Please provide a detailed itinerary in a structured format for a trip lasting [number of days] days. Each day should be clearly labeled starting from Day 1 to Day [number of days], followed by a descriptive title for the day's theme. Each activity should be listed with a specific time block (Morning, Late Morning, Afternoon, Evening). Here is the format I need:

- **Day 1: [Theme of the Day]**
  - Morning: [Activity]
  - Late Morning: [Activity]
  - Afternoon: [Activity]
  - Evening: [Activity]

Continue this format for each subsequent day.
Be realistic, especially for one (or two)-day trip. Only include the itinerary details and activities without any additional commentary (eg."Certainly! Here is...").`
      }],
      use_search: false,
      stream: false
    }, setLoading, setConversation, setRecommendations, setGuide);
  };

  const handleSubmit = async (destination, preferences) => {
    setLoading(true); // 确保在开始加载时将 loading 设置为 true
    setCurrentDestination(destination);
    setPreferences(preferences);
    setConversation([]);
    const query = preferences.visit.join(', ');

    try {
      await fetchContentFromBackend(destination.toUpperCase(), 'recommendations', {
        model: 'kimi',
        messages: [{
          role: 'user',
          content: `Recommend 3 points of interest in ${destination.toUpperCase()} for these categories: ${query}.`
        }],
        use_search: false,
        stream: false
      }, setLoading, setConversation, setRecommendations, setGuide);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false); // 确保在请求完成后将 loading 设置为 false
    }
  };


  const fetchMoreRecommendations = async () => {
    setLoading(true);
    const query = preferences.visit.join(', ');
    const newMessage = {
      role: 'user',
      content: `Recommend 3 other points of interest in ${currentDestination.toUpperCase()} for these categories: ${query}. Make sure the recommendations are different from any previously provided.`
    };
    await fetchContentFromBackend(currentDestination, 'recommendations', {
      model: 'kimi',
      messages: [...conversation, newMessage],
      use_search: false,
      stream: false
    }, setLoading, setConversation, setRecommendations, setGuide);
    setLoading(false);
  };

  const handleSavePOI = async (poi) => {
    try {
      const savedPOI = await savePOI(poi);
      console.log('Saved POI:', savedPOI);
      setRecommendations((prevRecommendations) =>
        prevRecommendations.map((rec) =>
          rec.name === poi.name ? { ...rec, saved: true } : rec
        )
      );
    } catch (error) {
      console.error('Failed to save POI:', error);
      if (error.response && error.response.status === 401) {
        alert('Please log in to save POIs');
      }
    }
  };

  const handleSaveGuide = async (guide) => {
    try {
      const savedGuide = await saveGuide(guide);
      console.log('Saved Guide:', savedGuide);
      setGuide((prevGuide) => ({ ...prevGuide, saved: true }));
    } catch (error) {
      console.error('Failed to save guide:', error);
      if (error.response && error.response.status === 401) {
        alert('Please log in to save guides');
      }
    }
  };

  return (
    <AuthProvider>
      <Router>
        <div>
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage onSubmit={handleGuideSubmit} />} />
            <Route path="/guide" element={loading ? <LoadingSpinner /> : <GuidePage guide={guide} onSave={handleSaveGuide} />} />
            <Route path="/preferences" element={<PreferenceForm onSubmit={handleSubmit} />} />
            <Route path="/recommendations" element={
              loading || imageLoading ? <LoadingSpinner /> :
                <RecommendationList
                  recommendations={recommendations}
                  onFetchMoreRecommendations={fetchMoreRecommendations}
                  onSave={handleSavePOI}
                />
            } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            {/* 修改: 使用更新后的 ProtectedRoute */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/forgetpassword" element={<ForgetPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;