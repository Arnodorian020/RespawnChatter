// /src/pages/ProfilePage.js
import React from 'react';
import { Profile } from '../components/Auth/Profile';  // Importamos el componente Profile

const ProfilePage = () => {
  return (
    <div>
      <h2>Profile Page</h2>
      <Profile />  {/* Aquí se renderiza la información del perfil */}
    </div>
  );
};

export default ProfilePage;
