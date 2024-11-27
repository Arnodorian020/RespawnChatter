import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ReplyModal from "../components/ReplyModal";
import axios from "axios";
import InappropriateContentModal from "../components/InnapropiateContentModal";
import "../styles/BackgroundImage.css";

const PaginaDetalleDeJuego = () => {
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [responses, setResponses] = useState({}); // Inicializar como []
  const [additionalData, setAdditionalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(0);
  const { gameId } = useParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentReplyTarget, setCurrentReplyTarget] = useState(null); // Almacena el ID de la reseña o respuesta
  const [isReplyingToReview, setIsReplyingToReview] = useState(false); // ¿Respondiendo a una reseña o respuesta?
  const [parentReviewId, setParentReviewId] = useState(null);
  const [modalcontentVisible, setModalContentVisible] = useState(false);


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
    return responsesData.map((response) => (
      <div key={response._id} className={`card bg-${depth % 2 === 0 ? 'secondary' : 'dark'} text-light mb-2 ms-${depth * 3}`}>
        <div className="card-body">
          <h5 className="card-title">Respuesta de {response.userId.username}</h5>
          <p className="card-text">{response.responseText}</p>

          <div className="d-flex justify-content-between align-items-center ms-4 me-4 mb-3">
                <span>
                  Te resultó útil:{" "}
                  <button
                    className="btn btn-link p-0"
                    onClick={() => handleMarkUseful(response._id, true)}
                  >
                    Sí
                  </button>{" "}
                  |{" "}
                  <button
                    className="btn btn-link p-0"
                    onClick={() => handleMarkUseful(response._id, false)}
                  >
                    No
                  </button>
                </span>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleReplyResponse(response._id, response.parentReviewId)}
                >
                  Responder
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleReportReview(response.id)}
                >
                  Reportar
                </button>
              </div>
  
          {/* Verificar si existen respuestas adicionales y renderizarlas recursivamente */}
          {additionalData[response._id] && additionalData[response._id].length > 0 ? (
            <div>
              {renderResponses(additionalData[response._id], depth + 1)} {/* Llamada recursiva */}
            </div>
          ) : (
            <p className="text-muted ms-2"></p>
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
      
      const response1 = await axios.post('http://localhost:3000/content-safety/moderate', {
        text: newReviewText,
        language: 'es',
      });
  
      // Verificar si la respuesta de la moderación es exitosa
      if (response1.status === 200 || response1.status === 201) {
        console.log("Llamada al endpoint de moderación exitosa:", response1.data);
        
        // Acceder al puntaje de sentimiento (score)
        const sentimentScore = response1.data.documentSentiment.score;
        const sentimentMagnitude = response1.data.documentSentiment.magnitude;
  
        // Establecer un umbral para la moderación, por ejemplo, si el puntaje es menor que -0.5 o mayor que 0.5
        if (sentimentScore < -0.5 || sentimentScore > 0.5) {
          console.log('Contenido inapropiado detectado: sentimiento excesivamente negativo o positivo');
          setModalContentVisible(true);
          throw new Error('El contenido tiene un tono inapropiado.');
        }
        
        // Opcionalmente puedes agregar un umbral mínimo de magnitud para evitar textos ambiguos (por ejemplo, con poca emoción)
        if (sentimentMagnitude < 0.1) {
          console.log('Contenido con baja magnitud de sentimiento, puede ser neutral o poco significativo');
          setModalContentVisible(true);
          throw new Error('El contenido tiene un tono neutral o poco significativo.');
        }
  
        console.log('Contenido adecuado para publicar.');
  
      } else {
        console.error("Error al llamar al endpoint de moderación:", response1.status);
        throw new Error("Error al verificar el contenido.");
      }
      
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


  const handleMarkUseful = (reviewId, isUseful) => {
    // Aquí se puede implementar una llamada a la API para actualizar la utilidad de la reseña
    console.log(`Reseña ${reviewId} marcada como útil: ${isUseful}`);
  };

  const handleReportReview = (reviewId) => {
    // Aquí se puede implementar una llamada a la API para reportar la reseña
    console.log(`Reseña reportada: ${reviewId}`);
  };

  const handleReplyReview = (reviewId) => {
    setIsReplyingToReview(true);
    setCurrentReplyTarget(reviewId);
    setModalVisible(true);
  };

  const handleReplyResponse = (responseId, parentReviewId) => {
    setIsReplyingToReview(false);
    setCurrentReplyTarget(responseId);
    setModalVisible(true);
    setParentReviewId(parentReviewId);
  };

  const handleReplySubmit = async (replyText) => {
    try {
      // Hacer una solicitud POST a tu endpoint backend que realiza el análisis de sentimiento con Google Cloud Natural Language
      const response = await axios.post('http://localhost:3000/content-safety/moderate', {
        text: replyText,
        language: 'es',
      });
  
      // Verificar si la respuesta de la moderación es exitosa
      if (response.status === 200 || response.status === 201) {
        console.log("Llamada al endpoint de moderación exitosa:", response.data);
        
        // Acceder al puntaje de sentimiento (score)
        const sentimentScore = response.data.documentSentiment.score;
        const sentimentMagnitude = response.data.documentSentiment.magnitude;
  
        // Establecer un umbral para la moderación, por ejemplo, si el puntaje es menor que -0.5 o mayor que 0.5
        if (sentimentScore < -0.5 || sentimentScore > 0.5) {
          console.log('Contenido inapropiado detectado: sentimiento excesivamente negativo o positivo');
          setModalContentVisible(true);
          throw new Error('El contenido tiene un tono inapropiado.');
        }
        
        // Opcionalmente puedes agregar un umbral mínimo de magnitud para evitar textos ambiguos (por ejemplo, con poca emoción)
        if (sentimentMagnitude < 0.1) {
          console.log('Contenido con baja magnitud de sentimiento, puede ser neutral o poco significativo');
          setModalContentVisible(true);
          throw new Error('El contenido tiene un tono neutral o poco significativo.');
        }
  
        console.log('Contenido adecuado para publicar.');
  
      } else {
        console.error("Error al llamar al endpoint de moderación:", response.status);
        throw new Error("Error al verificar el contenido.");
      }
  
      // Proceder a publicar el contenido si la moderación fue exitosa
      const endpointPost = isReplyingToReview
        ? `http://localhost:3000/responses`  // Respuesta a reseña
        : `http://localhost:3000/responses`; // Respuesta a respuesta
  
      const payload = isReplyingToReview
        ? { parentReviewId: currentReplyTarget, parentResponseId: null, userId: userId, responseText: replyText }
        : { parentReviewId: parentReviewId, parentResponseId: currentReplyTarget, userId: userId, responseText: replyText };
  
      const postResponse = await fetch(endpointPost, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!postResponse.ok) {
        throw new Error("Error al publicar la respuesta");
      }
  
      console.log("Respuesta publicada:", await postResponse.json());
    } catch (error) {
      console.error("Error al enviar la respuesta:", error);
    }
  };
  



  return (
    <div id="background-container">
      <div className="mt-1">
      <InappropriateContentModal 
        show={modalcontentVisible} 
        handleClose={() => setModalContentVisible(false)} 
      />
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
        <h2 className="text-white text-center mb-4">Reseñas de otros usuarios</h2>
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
              <div className="d-flex justify-content-between align-items-center ms-4 me-4 mb-3">
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
                  onClick={() => handleReplyReview(review._id)}
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

              {/* Respuestas a esta review */}
              {responses[review._id] && responses[review._id].length > 0 && (
                <div className="mt-2 ms-4">
                  <h5 className="text-black">Respuestas:</h5>
                  {renderResponses(responses[review._id])}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No hay reseñas disponibles para este juego.</p>
        )}
      </div>

      {/* Modal para responder */}
      <ReplyModal
        show={modalVisible}
        onHide={() => setModalVisible(false)}
        onSubmit={handleReplySubmit}
        title={isReplyingToReview ? "Responder a la Reseña" : "Responder a la Respuesta"}
        placeholder={isReplyingToReview ? "Escribe tu respuesta a la reseña..." : "Escribe tu respuesta..."}
      />

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
          <h2 className="text-center mb-4 text-white">Estadísticas del Juego</h2>
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
    </div>
  );

};

export default PaginaDetalleDeJuego;
