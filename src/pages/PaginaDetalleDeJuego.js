import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const PaginaDetalleDeJuego = () => {
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(0);
  const { gameId } = useParams();

  const token = localStorage.getItem("authToken"); // Obtener el token activo (o desde contexto)

  // Decodificar el token para obtener el ID del usuario
  const getUserIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decodifica el payload del JWT
      return payload.userId; // Ajustar según la estructura del token
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  };

  const userId = getUserIdFromToken(token); // Obtén el ID del usuario

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/games/${gameId}`);
        if (!response.ok) {
          throw new Error("Error al obtener los detalles del juego");
        }
        const data = await response.json();
        setGame(data);
      } catch (error) {
        console.error("Error al cargar los detalles del juego:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:3000/reviews/game/${gameId}`);
        if (!response.ok) {
          throw new Error("Error al obtener las reviews del juego");
        }
        const data = await response.json();
        console.log(data);
        setReviews(data);
      } catch (error) {
        console.error("Error al cargar las reviews del juego:", error);
      }
    };

    fetchGameDetails();
    fetchReviews();
  }, [gameId]);

  const handleStarClick = (rating) => {
    setNewReviewRating(rating);
  };

  const handlePublishReview = async () => {
    if (newReviewText.trim() === "" || newReviewRating === 0) {
      alert("Debes escribir una review y asignar un puntaje.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          gameId: gameId,
          rating: newReviewRating,
          reviewText: newReviewText,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al publicar la review");
      }

      const newReview = await response.json();
      setReviews([...reviews, newReview]); // Actualiza la lista de reviews
      setNewReviewText("");
      setNewReviewRating(0);
    } catch (error) {
      console.error("Error al publicar la review:", error);
    }
  };

  const handleCancelReview = () => {
    setNewReviewText("");
    setNewReviewRating(0);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="text-center mt-5">
        <h2 className="text-danger">Juego no encontrado</h2>
      </div>
    );
  }

  return (
    <div className="mt-1">
      <div className="card shadow-lg bg-dark text-light border-0">
        <div className="row g-0">
          {/* Imagen del juego */}
          <div className="col-md-5 d-flex justify-content-center align-items-center">
            {game.image && (
              <img
                src={game.image}
                alt={game.title}
                className="img-fluid rounded-start"
                style={{ height: "80%", objectFit: "cover" }}
              />
            )}
          </div>
          {/* Detalles del juego */}
          <div className="col-md-7 mt-4">
            <div className="text-center mb-4">
              <h1 className="text-light fw-bold">{game.title}</h1>
            </div>
            <div className="card-body px-5 py-4">
              <p className="card-text fs-5">
                <span className="text-warning fw-bold">Desarrollador:</span> {game.developer}
              </p>
              <p className="card-text fs-5">
                <span className="text-warning fw-bold">Año de lanzamiento:</span> {game.releaseYear}
              </p>
              <p className="card-text fs-5">
                <span className="text-warning fw-bold">Plataformas:</span>
              </p>
              <ul className="list-inline">
                {game.platforms.map((platform, index) => (
                  <li
                    key={index}
                    className="list-inline-item badge bg-primary text-dark fs-6 me-2 px-3 py-2"
                  >
                    {platform}
                  </li>
                ))}
              </ul>
              <p className="card-text fs-5">
                <span className="text-warning fw-bold">Géneros:</span>
              </p>
              <ul className="list-inline">
                {game.genre.map((genre, index) => (
                  <li
                    key={index}
                    className="list-inline-item badge bg-primary text-dark fs-6 me-2 px-3 py-2"
                  >
                    {genre}
                  </li>
                ))}
                </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de reviews */}
      <div className="mt-5">
        <h2 className="text-black text-center mb-4">Reseñas de otros usuarios</h2>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="card bg-light mb-3">
              <div className="card-body">
                <p className="card-text">{review.reviewText}</p>
                <p className="card-text text-warning">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i}>&#9733;</span>
                  ))}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-dark text-center">Aún no hay reseñas para este juego.</p>
        )}
      </div>

      {/* Crear nueva review */}
      <div className="card bg-dark text-light mt-5 p-4">
        <h3 className="text-center mb-4">Escribe tu reseña</h3>
        <textarea
          className="form-control mb-3"
          rows="3"
          placeholder="Escribe aquí tu reseña..."
          value={newReviewText}
          onChange={(e) => setNewReviewText(e.target.value)}
        ></textarea>
        <div className="card bg-light text-light">
        <div className="d-flex justify-content-center">
          {Array.from({ length: 5 }).map((_, index) => (
            <span
              key={index}
              style={{ fontSize: "1.5rem", cursor: "pointer" }}
              className={index < newReviewRating ? "text-warning" : "text-muted"}
              onClick={() => handleStarClick(index + 1)}
            >
              &#9733;
            </span>
          ))}
        </div>
        </div>
        <div className="d-flex justify-content-between mt-2">
          <button className="btn btn-success" onClick={handlePublishReview}>
            Publicar
          </button>
          <button className="btn btn-secondary" onClick={handleCancelReview}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginaDetalleDeJuego;