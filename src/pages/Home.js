import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import { LoginButton } from '../components/Auth/Login';
import '../styles/pages/Home.css';
import logo from '../assets/images/image.png';

const Home = () => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      // Si el usuario está autenticado, redirigir a ProfilePage
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]); // Dependencia de isAuthenticated para redirigir cuando cambie

  return (
    <div className="homepage">
      <div className="homepage-text-container"> {/* Contenedor con fondo oscuro */}
        <div className="homepage-logo">
            <h1>Respawn<br />Chatter</h1>
            <img src={logo} alt="RespawnChatter Logo" />
        </div>
        <div className="homepage-text">
          <p>¡Sé parte de esta comunidad y descubre grandes juegos!</p>
        </div>
      </div>
      <div className="homepage-button">
        {!isAuthenticated && <LoginButton />} {/* Mostrar botón de login solo si no está autenticado */}
      </div>
    </div>
  );
};

export default Home;
