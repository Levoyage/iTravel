import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './GuidePage.css'; // 引入自定义 CSS

const GuidePage = ({ guide }) => {
  const location = useLocation();
  const destination = location.state?.destination;
  
  //Debug
  useEffect(() => {
    console.log("Received destination:", destination);
    console.log("Guide data received:", guide);
  }, [destination, guide]);

  if (!guide || guide.length === 0) {
    console.error("Guide data is empty or undefined:", guide);
  }

  return (
    <div className="guide-page">
      {guide.length > 0 ? (
        <div>
          {guide.map((day, index) => (
            <div key={index} className="guide-card">
              <h2>{day.day}</h2>
              <div className="guide-content">
                {day.activities.map((activity, idx) => (
                  <div key={idx}>
                    <h3>{activity.time}</h3>
                    <p>{activity.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button className="save-button">Save</button>
        </div>
      ) : (
        <p>No guide available. Please return home and submit a destination.</p>
      )}
      <Link to="/preferences" state={{ destination }}>Recommend Attractions and Activities</Link>
    </div>
  );
};

export default GuidePage;