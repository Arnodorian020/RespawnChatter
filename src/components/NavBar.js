import React from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const NavBar = () => {
  const location = useLocation(); // Para obtener la ruta actual

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Emulador de Video Juegos</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
              <Link className="nav-link" to="/">Inicio</Link>
            </li>
            <li className={`nav-item ${location.pathname === '/mostrarJuegos' ? 'active' : ''}`}>
              <Link className="nav-link" to="/mostrarJuegos">Juegos</Link>
            </li>
            <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
              <Link className="nav-link" to="/">Foro</Link>
            </li>
            <li className={`nav-item ${location.pathname === '/misReseñas' ? 'active' : ''}`}>
              <Link className="nav-link" to="/misReseñas">Mis Reseñas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/logout">Cerrar sesión</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;