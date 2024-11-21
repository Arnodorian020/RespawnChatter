import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import "bootstrap/dist/css/bootstrap.min.css";

const PaginaMisResenas = () => {
  const [reviews, setReviews] = useState([]);
  const [originalReviews, setOriginalReviews] = useState([]); // Para mantener el orden original
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("none"); // Estado inicial "Ninguno"
  const [modalData, setModalData] = useState({ show: false, reviewId: null, action: null });
  const navigate = useNavigate();

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

  // Simula el llamado a la API
  useEffect(() => {
    const fetchReviews = async () => {
      if (!userId) {
        console.error("No se pudo obtener el ID del usuario. Verifica el token.");
        return;
      }

      try {
        setLoading(true);

        // Llamada a la API con token y ID del usuario
        const response = await fetch(`http://localhost:3000/reviews/user/${userId}`, {
        
          headers: {
            Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener las reseñas");
        }

        const data = await response.json();
        
        console.log(data);

        setReviews(data);
        setOriginalReviews(data); // Guarda el orden original
      } catch (error) {
        console.error("Error al llamar a la API:", error);
        setReviews([]);
        setOriginalReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [userId, token]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    let sortedReviews;

    if (e.target.value === "recent") {
      sortedReviews = [...reviews].sort((a, b) => new Date(b.gameId.releaseYear) - new Date(a.gameId.releaseYear));
    } else if (e.target.value === "rating") {
      sortedReviews = [...reviews].sort((a, b) => b.rating - a.rating);
    } else if (e.target.value === "none") {
      sortedReviews = [...originalReviews]; // Restaura el orden original
    }

    setReviews(sortedReviews);
  };

  const handleDelete = async () => {
    try {
      setModalData({ ...modalData, show: false });
      const response = await fetch(`http://localhost:3000/reviews/${modalData.reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al eliminar la reseña");
      }
      // Después de eliminar la reseña, recargar la lista de reseñas
    const updatedReviewsResponse = await fetch(`http://localhost:3000/reviews/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!updatedReviewsResponse.ok) {
      throw new Error("Error al obtener las reseñas actualizadas");
    }

    const updatedReviews = await updatedReviewsResponse.json();

    console.log(updatedReviews);

    setReviews(updatedReviews); // Actualiza la lista de reseñas con los datos actualizados
    } catch (error) {
      console.error("Error al eliminar la reseña:", error);
    }
  };

  const handleEdit = (id) => {
    console.log(id);
    navigate(`/editarReseña/${id}`);
  };

  return (
    <div className="container my-5">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-black">Mis Reseñas</h1>
        <div className="d-flex align-items-center">
          <label htmlFor="sort" className="me-2 text-black">
            Ordenar por:
          </label>
          <select id="sort" className="form-select w-auto" value={sortBy} onChange={handleSortChange}>
            <option value="none">Ninguno</option>
            <option value="recent">Más reciente</option>
            <option value="rating">Calificación</option>
          </select>
        </div>
      </header>

      {loading ? (
        <div className="text-center text-black">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : reviews.length > 0 ? (
        <div className="row g-4">
          {reviews.map((review) => (
            <div key={review.id} className="col-md-6">
              <div className="card bg-dark text-white shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">
                    Creada en: {review.gameId.title} ({review.gameId.releaseYear})
                  </h5>
                  {/* Mostrar la imagen del juego si está disponible */}
                  {review.gameId.image && (
                    <div className="text-center mb-3 mt-4">
                      <img 
                        src={review.gameId.image} 
                        alt={review.gameId.title} 
                        className="img-fluid mb-3" 
                        style={{ maxWidth: '70%', height: 'auto' }} 
                      />
                    </div>
                  )}
                  <p className="card-text">{review.reviewText}</p>
                  <div className="mb-3">
                    <span className="text-warning">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEdit(review._id)}
                    >
                      Modificar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        setModalData({ show: true, reviewId: review._id, action: "delete" })
                      }
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-white">
          <p>No se encontraron reseñas.</p>
        </div>
      )}

      {/* Modal de Confirmación */}
      <ConfirmModal
        show={modalData.show}
        title="Confirmar acción"
        message="¿Estás seguro de que deseas eliminar esta reseña?"
        onConfirm={handleDelete}
        onCancel={() => setModalData({ ...modalData, show: false })}
      />
    </div>
  );
};

export default PaginaMisResenas;
