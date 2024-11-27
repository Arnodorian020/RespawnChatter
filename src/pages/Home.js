import React from 'react';
import { LoginButton } from '../components/Auth/Login';
import '../styles/pages/Home.css';
import logo from '../assets/images/image.png';

const Home = () => {
  return (
    <div className="homepage">
      <div className="homepage-logo">
        <img src={logo} alt="RespawnChatter Logo" />
      </div>
      <div className="homepage-text">
        <h1>RespawnChatter</h1>
        <p>¡Sé parte de esta comunidad y descubre grandes juegos!</p>
      </div>
      <button className="login-button">
        <LoginButton />
      </button>
    </div>
  );
};

export default Home;
