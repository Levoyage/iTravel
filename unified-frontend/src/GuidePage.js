import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';
import './GuidePage.css';

const GuidePage = ({ guide }) => {
  const location = useLocation();
  const destination = location.state?.destination;
  const [savedMessage, setSavedMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    console.log("Received destination:", destination);
    console.log("Guide data received:", guide);
    console.log("User state:", user);
  }, [destination, guide, user]);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleSave = async () => {
    if (!user) {
      alert('Please log in');
      return;
    }

    const token = localStorage.getItem('token');
    console.log("JWT Token:", token);

    const guideData = {
      userId: user.id,
      destination: destination || "Unknown",
      guide: JSON.stringify(guide),
      time: new Date().toISOString(),
      description: `Travel guide for ${destination}`
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/guides/guide`,
        guideData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setSavedMessage('Guide saved successfully!');
    } catch (error) {
      console.error('Failed to save guide:', error);
      setSavedMessage('Failed to save guide.');
    }
  };

  return (
    <div className="p-5 text-center">
      {destination && <h1 className="text-3xl font-bold mb-2">📍 {capitalizeFirstLetter(destination)}</h1>}
      {guide.length > 0 ? (
        <div>
          {guide.map((day, index) => (
            <div key={index} className="guide-card bg-gray-100 border border-gray-300 rounded-lg shadow-md my-5 mx-auto p-5 max-w-xl text-left">
              <h2 className="text-2xl font-bold mb-3">{day.day}</h2>
              <div className="guide-content mb-5">
                {day.activities.map((activity, idx) => (
                  <div key={idx} className="mb-4">
                    <h3 className="text-lg font-bold">{activity.time}</h3>
                    <p className="text-left">{activity.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="button-row flex justify-between mt-4"> {/* No margin needed */}
            <button
              className="save-button bg-blue-500 text-white font-semibold py-2 px-4 rounded w-40 hover:bg-blue-700"
              onClick={handleSave}
            >
              Save
            </button>
            <Link
              to="/preferences"
              state={{ destination }}
              className="save-button bg-blue-500 text-white font-semibold py-2 px-4 rounded w-40 hover:bg-blue-700 text-center"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              Recommend
              <br />
              Attractions
            </Link>
          </div>
          {user && savedMessage && <p className="save-message text-green-500 font-semibold mt-2">{savedMessage}</p>}
        </div>
      ) : (
        <p className="text-lg font-semibold mt-4">No guide available. Please return home and submit a destination.</p>
      )}
    </div>


  );
};

export default GuidePage;
