import React from "react";
import { Tooltip, Typography } from "@mui/material";

const ClientShippingTooltip = ({ clientData }) => {
  const renderShippingData = () => {
    if (
      clientData.datosEnvio &&
      Object.keys(clientData.datosEnvio).length > 0
    ) {
      return (
        <div>
          <Typography variant="body1">Datos de Envío:</Typography>
          <ul>
            {Object.entries(clientData.datosEnvio).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      );
    } else {
      return (
        <Typography variant="body1">
          No existen datos de envío guardados para este cliente.
        </Typography>
      );
    }
  };

  return (
    <Tooltip title={renderShippingData()} arrow>
      <span>Datos de Envío</span>
    </Tooltip>
  );
};

export default ClientShippingTooltip;
