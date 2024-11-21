import React from 'react';
import './App.css';
import PaginaMisResenas from './pages/PaginaMisReseñas';
import { useEffect } from 'react';
import PaginaEditarResena from './pages/PaginaEditarReseña';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaginaMostrarJuegos from './pages/PaginaMostrarJuegos';
import PaginaDetalleDeJuego from './pages/PaginaDetalleDeJuego';
import NavBar from './components/NavBar';

function App() {

  useEffect(() => {
    // Guardar el token temporalmente en localStorage
    const simulatedToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzNhMjgwMDBmMDJkY2RlOGEwZDgxOTAiLCJ1c2VybmFtZSI6InVzdWFyaW8xIiwiZXhwIjoxNzE4OTI4MDAwfQ.4-BNS7iQ7gzAINVNVfut9JJBuCZzAIWJX0_WhhH3BtY";
    localStorage.setItem("authToken", simulatedToken);
  }, []);

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<PaginaMostrarJuegos />} />
        <Route path="/mostrarJuegos" element={<PaginaMostrarJuegos />} />
        <Route path="/mostrarJuegos/:gameId" element={<PaginaDetalleDeJuego />} />
        <Route path='/misReseñas' element={<PaginaMisResenas/>}/>
        <Route path='/editarReseña/:reviewId' element={<PaginaEditarResena/>}/>
      </Routes>
    </Router>
  );
}

export default App;
