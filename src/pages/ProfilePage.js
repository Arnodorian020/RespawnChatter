import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom"; // Importa Link para la navegación
import { LogoutButton } from "../components/Auth/Logout";
import "../styles/pages/ProfilePage.css"; // Importa los estilos CSS

const ProfilePage = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        isAuthenticated && (
            <div className="profile-page">
                {/* Header con navegación */}
                <header className="main-header">
                    <nav>
                        <ul className="navbar-list">
                            <li><Link to="/profile" className="navbar-item">Perfil</Link></li>
                            <li><Link to="/forum" className="navbar-item">Foro de discusión</Link></li>
                            <li><Link to="/emulator" className="navbar-item">Emulador de Video Juegos</Link></li>
                            <li><Link to="/news" className="navbar-item">Novedades</Link></li>
                            <li><Link to="/reviews" className="navbar-item">Mis Reseñas</Link></li>
                        </ul>
                    </nav>
                    {/* Botón de Logout */}
                    <div className="logout-button-container">
                        <LogoutButton />
                    </div>
                </header>

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
