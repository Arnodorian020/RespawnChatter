import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { Auth0Provider } from '@auth0/auth0-react';  // Importa Auth0Provider

const AuthWrapper = ({ children }) => {
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;


  // Retornamos el contexto Auth0Provider para envolver el resto de la aplicación
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ 
        audience: 'https://dev-cwnz3kxvoe0bpwc4.us.auth0.com/api/v2/',
        redirect_uri: window.location.origin 
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      {children}
    </Auth0Provider>
  );
};

export default AuthWrapper;