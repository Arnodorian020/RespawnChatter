import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const PaginaEditarResena = () => {
  const { reviewId } = useParams(); // Obtener el ID de la reseña desde la URL
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatedReview, setUpdatedReview] = useState({
    comment: "",
    rating: 0,
  });
  const navigate = useNavigate();

  // Llama a la API para obtener la reseña
  useEffect(() => {
    const fetchReview = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken"); // Usar el token si es necesario
        const response = await fetch(`https://1734f9d0-6496-464a-9fb7-3a12c3763e6d.mock.pstmn.io/${reviewId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener la reseña");
        }

        const data = await response.json();
        setReview(data); // Suponiendo que el API devuelve un objeto de reseña
        setUpdatedReview({
          comment: data.comment,
          rating: data.rating,
        });
      } catch (error) {
        console.error("Error al cargar la reseña:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [reviewId]);

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedReview((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Maneja la confirmación de cambios
  const handleConfirm = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`https://1734f9d0-6496-464a-9fb7-3a12c3763e6d.mock.pstmn.io/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedReview),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la reseña");
      }

      alert("Reseña actualizada exitosamente");
      navigate("/mis-resenas"); // Redirigir a la página de reseñas del usuario
    } catch (error) {
      console.error("Error al actualizar la reseña:", error);
      alert("No se pudo actualizar la reseña.");
    }
  };

  if (loading) {
    return <div className="text-center">Cargando...</div>;
  }

  if (!review) {
    return <div className="text-center">No se encontró la reseña</div>;
  }

  return (
    <div className="container my-5">
      <h1 className="mb-4">Modificar Reseña</h1>
      <div className="card shadow p-4 bg-light">
        <h5 className="card-title">Creada en: {review.game} ({review.year})</h5>
        <textarea
          className="form-control mb-3"
          name="comment"
          value={updatedReview.comment}
          onChange={handleChange}
          rows="5"
        />
        <div className="d-flex align-items-center mb-3">
          <span className="me-3">Calificación:</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`btn ${updatedReview.rating >= star ? "btn-warning" : "btn-secondary"}`}
              onClick={() => setUpdatedReview((prev) => ({ ...prev, rating: star }))}
            >
              ★
            </button>
          ))}
        </div>
        <div className="d-flex justify-content-between">
          <button className="btn btn-success" onClick={handleConfirm}>
            Confirmar Cambios
          </button>
          <button className="btn btn-danger" onClick={() => navigate("/misReseñas")}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginaEditarResena;