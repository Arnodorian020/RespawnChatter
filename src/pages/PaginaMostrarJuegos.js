import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/BackgroundImage.css";


const PaginaMostrarJuegos = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/games"); // Ajusta la URL a tu API
        if (!response.ok) {
          throw new Error("Error al obtener los juegos");
        }
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error("Error al cargar los juegos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleCardClick = (gameId) => {
    navigate(`/mostrarJuegos/${gameId}`); // Redirige a la página del juego
  };

  return (
    <div id="background-container">
    <div className="container my-5">
      <h2 className="text-center text-white mb-4">Juegos Disponibles</h2>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {games.map((game) => (
            <div key={game._id} className="col-md-4">
              <div className="card bg-dark text-white shadow-sm">
                {game.image && (
                  <div className="text-center mb-3 mt-4">
                    <img
                        src={game.image}
                        alt={game.title}
                        className="card-img-top img-fluid"
                        style={{ maxWidth: "70%", height: "auto", margin: "0 auto" }}
                    />
                  </div>
                )}
                <div className="card-body">
                  <h5 className="card-title">{game.title}</h5>
                  <p className="card-text">Desarrollado por: {game.developer}</p>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleCardClick(game._id)}
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default PaginaMostrarJuegos;
