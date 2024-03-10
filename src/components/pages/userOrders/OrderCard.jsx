import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from "@mui/material";
import { getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const OrderCard = ({ dataOrder }) => {
  const [dataCliente, setDataCliente] = useState(null);
  const [idClient, setIdClient] = useState("");

  useEffect(() => {
    const obtenerDataCliente = async () => {
      try {
        const documentSnapshot = await getDoc(dataOrder.client);

        if (documentSnapshot.exists()) {
          setDataCliente(documentSnapshot.data());
        } else {
          console.error("El documento del cliente no existe.");
        }
      } catch (error) {
        console.error("Error al obtener los datos del cliente:", error);
      }
    };

    obtenerDataCliente();
  }, [dataOrder]);

  return (
    <Card
      sx={{
        maxWidth: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "16px",
        borderLeft: "5px solid #3f51b5",
      }}
    >
      <CardContent>
        <Typography
          style={{ textAlign: "right" }}
          gutterBottom
          variant="h6"
          component="div"
          color="#3f51b5"
        >
          ORDEN # {dataOrder.numberOrder}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          <strong>Cliente:</strong>
          <Divider />
          <React.Fragment>
            Email: {dataCliente?.email}
            <br />
            Apellido: {dataCliente?.apellido}
            <br />
            Nombre: {dataCliente?.name}
          </React.Fragment>
          <Divider />
          <strong>Canal de Venta:</strong> {dataOrder.canalVenta}
          <br />
          <strong>Status:</strong> {dataOrder.status}
          <br />
          <strong>Nota:</strong> {dataOrder.note}
          <br />
          <strong>Fecha:</strong>{" "}
          {new Date(dataOrder.date.seconds * 1000).toLocaleString()}
          <br />
          <strong>Número de Pedido:</strong> {dataOrder.numberOrder}
          <br />
          <strong>Total:</strong> {dataOrder.total}
          <Divider />
          <br />
          <strong>Productos:</strong>
          <List>
            {dataOrder.orderItems.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      alt={`Imagen del Producto ${index + 1}`}
                      src={item.image}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={`Producto ${index + 1}: ${item.productId}`}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          Descuento: {item.descuento}%
                          <br />
                          Subtotal: {item.subtotal}
                          <br />
                          Precio Unitario: {item.unit_price}
                          <br />
                          Cantidad: {item.quantity}
                          <br />
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                {index !== dataOrder.orderItems.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
          <strong>Información de Entrega:</strong>
          <br />
          <Divider />
          País: {dataOrder.infoEntrega.pais}
          <br />
          Estado: {dataOrder.infoEntrega.estado}
          <br />
          Ciudad: {dataOrder.infoEntrega.ciudad}
          <br />
          Código Postal: {dataOrder.infoEntrega.codigoPostal}
          <br />
          Número: {dataOrder.infoEntrega.numero}
          <br />
          Calle: {dataOrder.infoEntrega.calle}
          <br />
          Piso/Dpto: {dataOrder.infoEntrega.pisoDpto}
          <Divider />
          <br />
        </Typography>
      </CardContent>
      <CardActions>
        <Button>
          <span class="material-symbols-outlined">print</span>
        </Button>
      </CardActions>
    </Card>
  );
};

export default OrderCard;
