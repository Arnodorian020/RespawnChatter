import React from 'react';
import './App.css';
import PaginaMisResenas from './pages/PaginaMisReseñas';
import { useEffect } from 'react';
import PaginaEditarResena from './pages/PaginaEditarReseña';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {

  useEffect(() => {
    // Guardar el token temporalmente en localStorage
    const simulatedToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NSIsInVzZXJuYW1lIjoidXN1YXJpb19wcnVlYmEiLCJleHAiOjE3MTg5MjgwMDB9.B7l5oFaI_7sL93AhIXNw7cAXcmlg6nYZC2tb4eiUda0";
    localStorage.setItem("authToken", simulatedToken);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path='/misReseñas' element={<PaginaMisResenas/>}/>
        <Route path='/editarReseña/:reviewId' element={<PaginaEditarResena/>}/>
      </Routes>
    </Router>
  );
}

export default App;
