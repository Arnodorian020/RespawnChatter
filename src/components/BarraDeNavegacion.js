import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { LogoutButton } from "./Auth/Logout";
import "../styles/pages/ProfilePage.css"; // Importa los estilos CSS

const BarraDeNavegacion = () => {
    
    const { user, isAuthenticated, isLoading } = useAuth0();

    
    return (
        isAuthenticated && (
                <header className="main-header">
                    <nav>
                        <ul className="navbar-list">
                            <li><Link to="/profile" className="navbar-item">Perfil</Link></li>
                            <li><Link to="/forum" className="navbar-item">Foro de discusión</Link></li>
                            <li><Link to="/" className="navbar-item">Emulador de Video Juegos</Link></li>
                            <li><Link to="/mostrarJuegos" className="navbar-item">Lista de Juegos</Link></li>
                            <li><Link to="/news" className="navbar-item">Novedades</Link></li>
                            <li><Link to="/misReseñas" className="navbar-item">Mis Reseñas</Link></li>
                        </ul>
                    </nav>
                    {/* Botón de Logout */}
                    <div className="logout-button-container">
                        <LogoutButton />
                    </div>
                </header>
        )
    );
};


export default BarraDeNavegacion;