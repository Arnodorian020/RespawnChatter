import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';  // Importa Auth0Provider
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/NotFound';
import AuthWrapper from './components/Auth/AuthWrapper';
import './styles/globals/App.css';

import TestPage from './pages/TestPage'

// Asegúrate de poner tus credenciales de Auth0 aquí
const domain = "YOUR_AUTH0_DOMAIN";  // Sustituye con tu dominio de Auth0
const clientId = "YOUR_AUTH0_CLIENT_ID";  // Sustituye con tu clientId de Auth0
import React from 'react';
import './App.css';
import PaginaMisResenas from './pages/PaginaMisReseñas';
import { useEffect } from 'react';
import PaginaEditarResena from './pages/PaginaEditarReseña';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaginaMostrarJuegos from './pages/PaginaMostrarJuegos';
import PaginaDetalleDeJuego from './pages/PaginaDetalleDeJuego';
import NavBar from './components/NavBar';

function App() {

  useEffect(() => {
    // Guardar el token temporalmente en localStorage
    const simulatedToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzNhMjgwMDBmMDJkY2RlOGEwZDgxOTAiLCJ1c2VybmFtZSI6InVzdWFyaW8xIiwiZXhwIjoxNzE4OTI4MDAwfQ.4-BNS7iQ7gzAINVNVfut9JJBuCZzAIWJX0_WhhH3BtY";
    const simulatedToken2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzNhMjgwMDBmMDJkY2RlOGEwZDgxOTEiLCJ1c2VybmFtZSI6InVzdWFyaW8yIiwiZXhwIjoxNzE4OTI4MDAwfQ.gvbUfoEsazbHI56orJ1yJLGA5Eb0CFAHoUaVNXVLnc8";  
    localStorage.setItem("authToken", simulatedToken);
  }, []);

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <Router>
        <AuthWrapper>
          <div className="App">
          <NavBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/mostrarJuegos" element={<PaginaMostrarJuegos />} />
              <Route path="/mostrarJuegos/:gameId" element={<PaginaDetalleDeJuego />} />
              <Route path='/misReseñas' element={<PaginaMisResenas/>}/>
              <Route path='/editarReseña/:reviewId' element={<PaginaEditarResena/>}/>
            </Routes>
          </div>
        </AuthWrapper>
      </Router>
    </Auth0Provider>
    
  );
}

export default App;
