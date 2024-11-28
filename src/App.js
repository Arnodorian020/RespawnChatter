import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';  // Importa Auth0Provider
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import ForumPage from './pages/ForumPage';
import NotFound from './pages/NotFound';
import AuthWrapper from './components/Auth/AuthWrapper';
import './styles/globals/App.css';
import PostPage from './pages/PostPage';
import './App.css';
import PaginaMisResenas from './pages/PaginaMisReseñas';
import { useEffect } from 'react';
import PaginaEditarResena from './pages/PaginaEditarReseña';
import PaginaMostrarJuegos from './pages/PaginaMostrarJuegos';
import PaginaDetalleDeJuego from './pages/PaginaDetalleDeJuego';
import BarraDeNavegacion from './components/BarraDeNavegacion.js';

function App() {

  // Asegúrate de poner tus credenciales de Auth0 aquí
  const domain = "dev-cwnz3kxvoe0bpwc4.us.auth0.com";  // Sustituye con tu dominio de Auth0
  const clientId = "5aAiZ4bykLJzcDHVWJQ9ykI2eyHduV46";  // Sustituye con tu clientId de Auth0


  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
      cacheLocation='localstorage'
      useRefreshTokens={true}
    >
      <Router>
        <AuthWrapper>
          <div className="App">
            <BarraDeNavegacion/>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/forum" element={<ForumPage />} />
              <Route path="/post/:postId" element={<PostPage />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/mostrarJuegos" element={<PaginaMostrarJuegos />} />
              <Route path="/forum" element = {<PostPage />} />
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
