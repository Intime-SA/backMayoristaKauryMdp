import React from "react";
import Clients from "./clients/clients";

const Dashboard = () => {
  return (
    <div style={{ top: "30rem", color: "black" }}>
      Estoy en el dashboard
      <Clients />
    </div>
  );
};

export default Dashboard;
