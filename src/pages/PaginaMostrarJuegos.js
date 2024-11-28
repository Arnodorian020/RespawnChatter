import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/BackgroundImage.css";

const PaginaMostrarJuegos = () => {
  const [games, setGames] = useState([]);          // Estado para los juegos
  const [loading, setLoading] = useState(true);    // Estado para el cargando
  const [currentPage, setCurrentPage] = useState(1);  // Estado para la página actual
  const [totalPages, setTotalPages] = useState(1);  // Estado para el número total de páginas
  const [limit] = useState(10);                    // Estado para el límite de juegos por página
  const navigate = useNavigate();

  // Función para obtener los juegos de la API con paginación
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/games?page=${currentPage}&limit=${limit}`);
        if (!response.ok) {
          throw new Error("Error al obtener los juegos");
        }
        const data = await response.json();
        setGames(data.games);  // Los juegos de la página actual
        console.log(games);
        setTotalPages(data.totalPages);  // El total de páginas
      } catch (error) {
        console.error("Error al cargar los juegos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [currentPage, limit]);  // Re-fetch cuando cambie la página

  // Función para manejar el click en un juego y redirigir al detalle
  const handleCardClick = (gameId) => {
    navigate(`/mostrarJuegos/${gameId}`);
  };

  // Funciones para cambiar de página
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
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
          <>
            <div className="row g-4">
              {games.map((game) => (
                <div key={game._id} className="col-md-4">
                  <div className="card bg-dark text-white shadow-sm">
                    {game.image && (
                      <div className="text-center mb-3 mt-4">
                       <img src={game.image} 
                       class="img-fluid mx-auto d-block" 
                       style={{ width: "70%", height: "200px" }} 
                       alt="game.title" />

                      </div>
                    )}
                    <div className="card-body">
                      <h5 className="card-title mb-4">{game.title}</h5>
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

            {/* Controles de paginación */}
            <div className="d-flex justify-content-center mt-4">
              <button
                className="btn btn-primary btn-sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <span className="mx-3 text-white fw-bold">
                Página {currentPage} de {totalPages}
              </span>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaginaMostrarJuegos;
