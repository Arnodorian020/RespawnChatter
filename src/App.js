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

// Asegúrate de poner tus credenciales de Auth0 aquí
const domain = "YOUR_AUTH0_DOMAIN";  // Sustituye con tu dominio de Auth0
const clientId = "YOUR_AUTH0_CLIENT_ID";  // Sustituye con tu clientId de Auth0

function App() {
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
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/forum" element={<ForumPage />} />
              <Route path="/post/:postId" element={<PostPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthWrapper>
      </Router>
    </Auth0Provider>
  );
}

export default App;
