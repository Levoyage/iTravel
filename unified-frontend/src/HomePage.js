import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // 引入自定义 CSS

const HomePage = ({ onSubmit }) => {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(1); // 新增状态来存储出行天数
  const navigate = useNavigate();

  const handleGuideSubmit = (event) => {
    event.preventDefault();
    onSubmit(destination, days); // 调用从 App.js 传入的 handleGuideSubmit
    navigate('/guide', { state: { destination, days } }); // 提交后跳转到攻略页面，并传递天数
  };

  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Travel Planner</h1>
      <form onSubmit={handleGuideSubmit} className="homepage-form">
        <div className="homepage-form-group">
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter your travel destination"
            className="homepage-input"
          />
        </div>
        <div className="homepage-form-group">
          <select
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="homepage-select"
          >
            {[...Array(14)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1} {i + 1 === 1 ? 'day' : 'days'}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="homepage-button">Submit</button>
      </form>
    </div>
  );
};

export default HomePage;
