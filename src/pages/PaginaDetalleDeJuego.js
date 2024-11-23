import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const PaginaDetalleDeJuego = () => {
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [responses, setResponses] = useState({}); // Inicializar como []
  const [additionalData, setAdditionalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(0);
  const { gameId } = useParams();

  const token = localStorage.getItem("authToken");

  const getUserIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.userId;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  };

  const userId = getUserIdFromToken(token);

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
        setReviews(data);
      } catch (error) {
        console.error("Error al cargar las reviews del juego:", error);
      }
    };

    fetchGameDetails();
    fetchReviews();
  }, [gameId]);

  const renderResponses = (responsesData, depth = 0) => {
    return responsesData.map((response, idx) => (
      <div key={response._id} className={`card bg-${depth % 2 === 0 ? 'secondary' : 'dark'} text-light mb-2 ms-${depth * 3}`}>
        <div className="card-body">
          <h5 className="card-title">Respuesta de {response.userId.username}</h5>
          <p className="card-text">{response.responseText}</p>
  
          {/* Verificar si existen respuestas adicionales y renderizarlas recursivamente */}
          {additionalData[response._id] && additionalData[response._id].length > 0 ? (
            <div>
              {renderResponses(additionalData[response._id], depth + 1)} {/* Llamada recursiva */}
            </div>
          ) : (
            <p className="text-muted ms-2">Sin respuestas adicionales</p>
          )}
        </div>
      </div>
    ));
  };
  
  useEffect(() => {
    // Cargar las respuestas para cada review cuando se obtienen las reviews
    const fetchResponses = async (reviewId) => {
      try {
        const response = await fetch(`http://localhost:3000/responses?parentReviewId=${reviewId}`);
        console.log("Esta es la review id para las respuestas", reviewId);
        if (!response.ok) {
          throw new Error("Error al obtener las respuestas");
        }
        const data = await response.json();
        console.log(data);
        setResponses((prevResponses) => ({
          ...prevResponses,
          [reviewId]: data, // Guardar las respuestas bajo el ID de la review
        }));
      } catch (error) {
        console.error("Error al cargar las respuestas de la review:", error);
      }
    };

    reviews.forEach((review) => {
      fetchResponses(review._id);
    });
  }, [reviews]);

  useEffect(() => {
    // Función para cargar datos adicionales para cada respuesta
    const fetchAdditionalData = async (responseId) => {
      try {
        const response = await fetch(`http://localhost:3000/responses?parentResponseId=${responseId}`);
        console.log("Esta es la id de respuesta: ", responseId);
        if (!response.ok) {
          throw new Error("Error al obtener los datos adicionales");
        }
        const data = await response.json();
        console.log("Estas son las respuestas a esta respuesta:", responseId, data);
  
        // Almacenar los datos adicionales en el estado
        setAdditionalData((prevData) => ({
          ...prevData,
          [responseId]: data, // Asociar los datos con el ID de la respuesta
        }));
  
        // Verificar si la respuesta tiene más respuestas
        data.forEach((additionalResponse) => {
          if (!additionalData[additionalResponse._id]) {
            // Si la respuesta adicional no tiene datos adicionales, hacer la llamada recursiva
            fetchAdditionalData(additionalResponse._id);
          }
        });
      } catch (error) {
        console.error("Error al cargar los datos adicionales para la respuesta:", error);
      }
    };
  
    // Iterar sobre todas las respuestas de las reviews
    Object.values(responses).forEach((responseGroup) => {
      responseGroup.forEach((response) => {
        // Verificar si los datos adicionales no están cargados
        if (!additionalData[response._id]) {
          fetchAdditionalData(response._id); // Llamar para obtener datos adicionales si no están cargados
        }
      });
    });
  }, [responses, additionalData]); // Este efecto depende de `responses` y `additionalData`
  
  
  

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
      setReviews([...reviews, newReview]);
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

  const calculateStatistics = () => {
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
        : 0;
    return { totalReviews, averageRating };
  };

  const { totalReviews, averageRating } = calculateStatistics();

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

  console.log("Respuestas:", responses);
  console.log("Datos adicionales:", additionalData);

  const handleMarkUseful = (reviewId, isUseful) => {
    // Aquí se puede implementar una llamada a la API para actualizar la utilidad de la reseña
    console.log(`Reseña ${reviewId} marcada como útil: ${isUseful}`);
  };

  const handleReportReview = (reviewId) => {
    // Aquí se puede implementar una llamada a la API para reportar la reseña
    console.log(`Reseña reportada: ${reviewId}`);
  };

  const handleReplyReview = (reviewId) => {
    // Aquí se podría implementar un modal o un área para responder a la reseña
    console.log(`Respondiendo a la reseña: ${reviewId}`);
  };


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
              <div className="mt-4">
                <button
                  className="btn btn-outline-light btn-lg w-100"
                  onClick={() => window.history.back()}
                >
                  Volver
                </button>
              </div>
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
                <div className="mb-1">
                    <span className="text-warning">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </span>
                  </div>
              </div>
              <div className="d-flex justify-content-between align-items-center ms-2 me-2">
                  <span>
                    Te resultó útil:{" "}
                    <button
                      className="btn btn-link p-0"
                      onClick={() => handleMarkUseful(review.id, true)}
                    >
                      Sí
                    </button>{" "}
                    |{" "}
                    <button
                      className="btn btn-link p-0"
                      onClick={() => handleMarkUseful(review.id, false)}
                    >
                      No
                    </button>
                  </span>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleReplyReview(review.id)}
                  >
                    Responder
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleReportReview(review.id)}
                  >
                    Reportar
                  </button>
                </div>

              {/* Respuestas de la reseña */}
              <div className="mt-3">
                {responses[review._id] && responses[review._id].length > 0 ? (
                  responses[review._id].map((response, idx) => (
                  <div key={response._id} className="card bg-secondary text-light mb-2">
                    <div className="card-body">
                      <h5 className="card-title">Respuesta de {response.userId.username}</h5>
                      <p className="card-text">{response.responseText}</p>

                      {/* Mostrar respuestas adicionales a la respuesta */}
                      {additionalData[response._id] && additionalData[response._id].length > 0 ? (
                        renderResponses(additionalData[response._id], 1) // Llamar la función recursiva para respuestas adicionales
                      ) : (
                        <p className="text-muted ms-2">Sin respuestas adicionales</p>
                      )}
                    </div>
                  </div>
                  ))
                ) : (
                  <p className="text-muted ms-2">Sin respuestas</p>
                )}
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

      {/* Estadísticas del juego */}
      <div className="mt-5">
        <div className="container">
          <h2 className="text-center mb-4">Estadísticas del Juego</h2>
          <div className="row text-center">
            <div className="col-md-6">
              <div className="card bg-secondary text-light p-4 mb-4">
                <h4>Total de Reseñas</h4>
                <p className="display-4">{totalReviews}</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-secondary text-light p-4 mb-4">
                <h4>Promedio de Calificaciones</h4>
                <p className="display-4">{averageRating}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default PaginaDetalleDeJuego;
