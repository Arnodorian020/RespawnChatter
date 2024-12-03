// src/components/Auth/Profile.js
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect } from "react";

export const Profile = () => {

    const { user, isAuthenticated, isLoading, getIdTokenClaims } = useAuth0();
    console.log(isAuthenticated);
  
    useEffect(() => {
      console.log("user:", user);
      console.log("isAuthenticated:", isAuthenticated);
  
      const sendUserDataToBackend = async () => {
        if (isAuthenticated && user) {
          try {
            const token = await getIdTokenClaims();
  
            console.log("El token es: ", token);
  
            const userData = {
              email: user.email,
              username: user.nickname,
              createdAt: user.updated_at,  // O el campo que necesites
            };
  
            console.log("La data del usuario es:", userData);
  
            await axios.get('http://localhost:3000/auth/profile', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              params: userData,
            });
  
            console.log("Datos del usuario enviados correctamente al backend");
          } catch (error) {
            console.error("Error al enviar los datos del usuario al backend", error);
          }
        }
      };
  
      // Ejecutamos el envío solo si está autenticado
      if (isAuthenticated) {
        sendUserDataToBackend();
      }
    }, [isAuthenticated, user, isLoading ,getAccessTokenSilently]); // Dependencias
    
    
    
    if (!isAuthenticated) {
        return <div>No estás autenticado.</div>;
    }

    return (
        <div className="profile-header">
            <img src={user.picture} alt={user.name} className="profile-avatar" />
            <h2>{user.name}</h2>
            <p>Email: {user.email}</p>
        </div>
    );
};
