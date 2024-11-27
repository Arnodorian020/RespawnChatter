import React from 'react';
import '../styles/pages/NotFound.css';  // Asegúrate de que el archivo CSS esté importado

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="text-box">
        <h1>404 Opssss</h1>
        <p className="zoom-area"><b>Hola profe :3</b></p>
        <section className="error-container">
          <span className="four"><span className="screen-reader-text">4</span></span>
          <span className="zero"><span className="screen-reader-text">0</span></span>
          <span className="four"><span className="screen-reader-text">4</span></span>
        </section>
      </div>
    </div>
  );
}

export default NotFound;
