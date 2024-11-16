import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const PaginaMisResenas = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simula el llamado a la API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        // Supuesto llamado a una API (reemplaza con tu endpoint en el futuro)
        const response = await fetch("https://1734f9d0-6496-464a-9fb7-3a12c3763e6d.mock.pstmn.io");
        if (!response.ok) {
          throw new Error("Error al obtener las reseñas");
        }
        const data = await response.json();
        console.log(data);
        const data_1 = data.data;
        console.log(data_1);
        setReviews(data_1);
      } catch (error) {
        console.error("Error al llamar a la API:", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="container my-5">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-white">Mis Reseñas</h1>
        <div className="d-flex align-items-center">
          <label htmlFor="sort" className="me-2 text-white">
            Ordenar por:
          </label>
          <select id="sort" className="form-select w-auto">
            <option value="recent">Más reciente</option>
            <option value="rating">Calificación</option>
          </select>
        </div>
      </header>

      {loading ? (
        <div className="text-center text-white">
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
                  <h5 className="card-title">Creada en: {review.game}</h5>
                  <p className="card-text">{review.comment}</p>
                  <div className="mb-3">
                    <span className="text-warning">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-warning btn-sm">Modificar</button>
                    <button className="btn btn-danger btn-sm">Eliminar</button>
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
    </div>
  );
};

export default PaginaMisResenas;
