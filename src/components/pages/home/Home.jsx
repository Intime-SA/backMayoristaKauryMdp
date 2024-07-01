import React from "react";
import Charts from "./charts/Charts";

const Home = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        fontSize: "2rem",
        top: "10rem",
        position: "relative",
        fontFamily: '"Kanit", sans-serif',
      }}
    >
      <h1 style={{ color: "black", fontFamily: '"Kanit", sans-serif' }}>
        ¡ Bienvenidas !
      </h1>
      <h5
        style={{
          color: "grey",
          textAlign: "center",
          maxWidth: "800px",
          margin: "1rem 0",
          fontFamily: '"Kanit", sans-serif',
          fontWeight: 100,
          fontStyle: "italic", // Aplicando cursiva
        }}
      >
        "Piensen como reinas. Una reina no tiene miedo de fracasar. El fracaso
        es otro peldaño hacia la grandeza..."
      </h5>

      <Charts />
    </div>
  );
};

export default Home;
