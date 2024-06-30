import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ onSubmit }) => {
  const [destination, setDestination] = useState('');
  const navigate = useNavigate();

  const handleGuideSubmit = (event) => {
    event.preventDefault();
    onSubmit(destination);  // 调用从App.js传入的handleGuideSubmit
    navigate('/guide',{ state: { destination }});     // 提交后跳转到攻略页面
  };

  return (
    <form onSubmit={handleGuideSubmit}>
      <input
        type="text"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        placeholder="Enter your travel destination"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default HomePage;
