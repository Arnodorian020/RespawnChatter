import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const InappropriateContentModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Contenido Inapropiado Detectado</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        El contenido que intentaste enviar contiene términos inapropiados. Por favor, revisa tu mensaje.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InappropriateContentModal;
