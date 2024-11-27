import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/NotFound';
import AuthWrapper from './components/Auth/AuthWrapper';
import './styles/globals/App.css';

function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <Router>
      <AuthWrapper>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AuthWrapper>
    </Router>
  );
}

export default App;
