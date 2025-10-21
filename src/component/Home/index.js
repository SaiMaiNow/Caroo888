import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">🍬 Candy Burst Slot 🍭</h1>
      <button className="home-button" onClick={() => navigate('/slot')}>
        เริ่มเล่น Slot Game
      </button>
    </div>
  );
};

export default Home;
