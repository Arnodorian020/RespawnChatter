import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import { LogoutButton } from "../components/Auth/Logout";
import axios from "axios";
import "../styles/pages/ProfilePage.css";

const ProfilePage = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  
  // Estados para manejar la edición del perfil
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [newPhoneNumber, setNewPhoneNumber] = useState(""); // Estado para el número de teléfono
  const [newProfilePicture, setNewProfilePicture] = useState(user?.picture || "");
  const [imageFile, setImageFile] = useState(null); // Archivo de imagen
  const [error, setError] = useState(""); // Manejo de errores

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Función para manejar la carga de imágenes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setNewProfilePicture(URL.createObjectURL(file)); // Vista previa de la imagen
    }
  };

  // Función para guardar los cambios
  const saveChanges = async () => {
    try {
      const accessToken = await getAccessTokenSilently({
        audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/`,
        scope: "update:users"
      });

      const updatedUserData = {
        name: newName,
        picture: newProfilePicture,
        phone_number: newPhoneNumber
      };

      // Actualizar datos en Auth0 (opcional)
      const auth0Response = await axios.put(
        `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/users/${user.sub}`,
        { name: newName, picture: newProfilePicture }, // Solo se actualizan los datos permitidos en Auth0
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Auth0 actualizado:", auth0Response.data);

      // Guardar los datos adicionales (número de teléfono e imagen) en tu backend
      const backendResponse = await axios.put(
        "https://renderbdspawn.onrender.com/api/users", // URL del endpoint de tu backend
        {
          userId: user.sub,
          name: newName,
          phone_number: newPhoneNumber,
          profile_picture: imageFile || user.picture
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Datos guardados en el backend:", backendResponse.data);
      setEditing(false); // Finalizar la edición
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      setError("Hubo un error al guardar los cambios. Inténtalo nuevamente.");
    }
  };

  return (
    isAuthenticated && (
      <div className="profile-page">
        {/* Header de navegación */}
        <header className="main-header">
          <nav>
            <ul className="navbar-list">
              <img
                src={require("../assets/images/Respawn chatter.png")}
                alt="Respawn Chatter Logo"
                className="profile-logo"
              />
              <li><Link to="/profile" className="navbar-item">Perfil</Link></li>
              <li><Link to="/forum" className="navbar-item">Foro</Link></li>
              <li><Link to="/emulator" className="navbar-item">Emulador</Link></li>
              <li><Link to="/news" className="navbar-item">Novedades</Link></li>
              <li><Link to="/reviews" className="navbar-item">Reseñas</Link></li>
            </ul>
          </nav>
          <div className="logout-button-container">
            <LogoutButton />
          </div>
        </header>

        {/* Contenido del perfil */}
        <div className="profile-container">
          <div className="profile-avatar-container">
            <img
              src={newProfilePicture || user.picture}
              alt={user.name}
              className="profile-avatar"
            />
            {editing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            )}
          </div>

          {editing ? (
            <div className="profile-edit">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nuevo nombre"
              />
              <input
                type="text"
                value={newPhoneNumber}
                onChange={(e) => setNewPhoneNumber(e.target.value)}
                placeholder="Nuevo número de teléfono"
              />
              <button onClick={saveChanges}>Guardar cambios</button>
              <button onClick={() => setEditing(false)}>Cancelar</button>
            </div>
          ) : (
            <div className="profile-info">
              <h2>{newName || user.name}</h2>
              <p>Email: {user.email}</p>
              <p>Teléfono: {newPhoneNumber || "No registrado"}</p>
              <button onClick={() => setEditing(true)}>Editar perfil</button>
            </div>
          )}

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    )
  );
};

export default ProfilePage;
