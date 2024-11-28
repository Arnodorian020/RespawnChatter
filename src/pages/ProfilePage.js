import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom"; // Importa Link para la navegación
import { LogoutButton } from "../components/Auth/Logout";
import { useEffect } from "react";
import axios from "axios";
import "../styles/pages/ProfilePage.css"; // Importa los estilos CSS

const ProfilePage = () => {
    const { user, isAuthenticated, getIdTokenClaims, isLoading } = useAuth0();
    console.log(isAuthenticated);
  
    useEffect(() => {
      const sendUserDataToBackend = async () => {       
        if(!isLoading) {
          try {
            console.log("user:", user);
            console.log("isAuthenticated:", isAuthenticated);
            const token = await getIdTokenClaims();
  
            console.log("El token es: ", token);
  
            const userData = {
              email: user.email,
              username: user.nickname,
              createdAt: user.updated_at,  // O el campo que necesites
            };
  
            console.log("La data del usuario es:", userData);
  
            console.log("El token es: ", token.__raw);

            await axios.get('http://localhost:3000/auth/profile', {
              headers: {
                Authorization: `Bearer ${token.__raw}`,
              },
              params: userData,
            });
        
            console.log("Datos del usuario enviados correctamente al backend");
          } catch (error) {
            console.error("Error al enviar los datos del usuario al backend", error);
          }
        }
      };
  
      console.log(isAuthenticated);
      // Ejecutamos el envío solo si está autenticado
      if (isAuthenticated) {
        sendUserDataToBackend();
      }
    }, [isLoading, isAuthenticated, user, getIdTokenClaims]); // Dependencias
    

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        isAuthenticated && (
            <div className="profile-page">
                {/* Contenido del perfil */}
                <div className="profile-container">
                    <img src={user.picture} alt={user.name} className="profile-avatar" />
                    <h2>{user.name}</h2>
                    <p>Email: {user.email}</p>
                </div>
            </div>
        )
    );
};

export default ProfilePage;
