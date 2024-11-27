import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

const AuthWrapper = ({ children }) => {
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

  if (!domain || !clientId) {
    console.error("Auth0 domain or clientId is missing from environment variables.");
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      {children}
    </Auth0Provider>
  );
};

export default AuthWrapper;
