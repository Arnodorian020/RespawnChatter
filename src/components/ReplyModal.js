import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap"; // Importa Modal y Button de React-Bootstrap

const ReplyModal = ({ show, onHide, onSubmit, title, placeholder}) => {
    
    console.log("Props recibidas:", { show, onHide, onSubmit, title, placeholder }); // Agrega esta línea

    
    const [replyText, setReplyText] = useState("");

    const handleSubmit = () => {
      if (replyText.trim() === "") {
        alert("La respuesta no puede estar vacía.");
        return;
      }
      onSubmit(replyText); // Llama a la función que enviaste como prop
      setReplyText(""); // Limpia el campo de texto
      onHide(); // Llama a la función que enviaste como prop para cerrar el modal
    };
  
    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={placeholder}
            rows={4}
            className="form-control"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Responder
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
  
  export default ReplyModal;
  