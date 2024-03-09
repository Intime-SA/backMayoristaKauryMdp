import React from "react";

const ScrollableContainer = ({ children }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "1rem",
        width: "40vw", // Cambia el ancho del contenedor según sea necesario
        height: "60vh", // Ajusta la altura para que entre en el viewport
        maxHeight: "80vh", // Establece una altura máxima para permitir desplazamiento si es necesario
        overflowY: "auto", // Agrega una barra de desplazamiento vertical si el contenido excede la altura
        display: "flex",
        flexDirection: "column", // Alinear los elementos verticalmente
        alignItems: "flex-start", // Centrar los elementos horizontalmente
      }}
    >
      {children}
    </div>
  );
};

export default ScrollableContainer;
