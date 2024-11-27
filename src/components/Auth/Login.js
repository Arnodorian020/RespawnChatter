import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import '../../styles/pages/Home.css';

export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect();  // Llama al método de login con redirección
  };

  return (
    <button className="login-button" onClick={handleLogin}>
      INICIAR SESIÓN
    </button>
  );
};
