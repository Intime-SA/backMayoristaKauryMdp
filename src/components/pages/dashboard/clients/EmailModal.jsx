import React, { useState } from "react";
import { Button, Modal, TextField, Typography } from "@mui/material";

const EmailModal = ({ open, handleClose, sendEmail, email, toname }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    // Llamar a la función sendEmail pasando el asunto y el mensaje
    sendEmail(subject, message, toname);
    // Cerrar el modal
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: 20,
          borderRadius: 8,
          boxShadow: 24,
          width: "80vw", // Ancho del modal
          maxWidth: 400, // Ancho máximo del modal
        }}
      >
        <h5 variant="h6" id="modal-modal-title">
          Enviar Correo Electrónico a:<h6>{email}</h6>
        </h5>

        <TextField
          label="Asunto"
          variant="outlined"
          fullWidth
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          sx={{ marginBottom: 2, marginTop: 2 }}
        />

        <h6 style={{ marginTop: "1rem" }}>Hola, {toname}!</h6>
        <TextField
          label="Mensaje"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          sx={{ marginRight: 2 }}
        >
          Enviar
        </Button>
        <Button variant="contained" onClick={handleClose}>
          Volver
        </Button>
      </div>
    </Modal>
  );
};

export default EmailModal;
