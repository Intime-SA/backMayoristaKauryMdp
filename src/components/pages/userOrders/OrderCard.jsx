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
  Alert,
  AlertTitle,
} from "@mui/material";
import {
  getDoc,
  collection,
  getDocs,
  updateDoc,
  addDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { Link } from "react-router-dom";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import ModalPDF from "./ModalPDF";

const OrderCard = ({ dataOrder, setChangeStatus, changeStatus, openForm }) => {
  const [dataCliente, setDataCliente] = useState(null);
  const [idClient, setIdClient] = useState("");
  const [cardBackgroundColor, setCardBackgroundColor] = useState("#ffffff"); // Estado inicial: blanco

  useEffect(() => {}, [changeStatus]);

  useEffect(() => {
    // Cambiar el color de fondo de la tarjeta según el estado
    if (dataOrder.status === "archivada") {
      setCardBackgroundColor("#e0e0e0"); // Gris un poco más fuerte
    } else {
      setCardBackgroundColor("#ffffff"); // Blanco
    }
  }, [dataOrder.status]);

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

  const estadoRender = (estado) => {
    console.log(estado);
    if (estado === "nueva") {
      return (
        <Alert severity="warning">
          <AlertTitle style={{ fontSize: "100%", height: "0.5rem" }}>
            Pendiente
          </AlertTitle>
          {/* <strong>El pedido ya fue preparado</strong> */}
        </Alert>
      );
    } else if (estado === "empaquetada") {
      return (
        <Alert
          style={{
            fontSize: "50%",
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
          size="small"
          severity="info"
        >
          Empaquetada
        </Alert>
      );
    } else if (estado === "pagoRecibido") {
      return (
        <Alert severity="success">
          <AlertTitle
            style={{
              fontSize: "100%",
              display: "flex",
              alignItems: "center",
              width: "100%",
              marginTop: "0.1rem",
            }}
            variant="outlined"
          >
            Pago Recibido
          </AlertTitle>
          {/* <strong>El pedido fue entregado con exito</strong> */}
        </Alert>
      );
    } else if (estado === "enviada") {
      return (
        <Alert variant="outlined" severity="success">
          <AlertTitle style={{ fontSize: "100%", height: "0.5rem" }}>
            En Distribucion
          </AlertTitle>
          {/* <strong>El pedido fue entregado con exito</strong> */}
        </Alert>
      );
    } else if (estado === "cancelada") {
      return (
        <Alert
          variant="outlined"
          severity="error"
          style={{
            fontSize: "50%",
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          Cancelado
        </Alert>
      );
    } else if (estado === "archivada") {
      return (
        <Alert variant="contained" color="info">
          <AlertTitle>Archivada</AlertTitle>
        </Alert>
      );
    }
  };

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
        backgroundColor: cardBackgroundColor, // Color de fondo dinámico
      }}
    >
      <CardContent>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            style={{ textAlign: "right" }}
            gutterBottom
            variant="h6"
            component="div"
            color="#3f51b5"
          >
            <h6> ORDEN # {dataOrder.numberOrder}</h6>
          </Typography>
          <div>{estadoRender(dataOrder.status)}</div>
        </div>

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
          <br />
          <strong>Canal de Venta:</strong> {dataOrder.canalVenta}
          <br />
          <strong>Fecha:</strong>{" "}
          {new Date(dataOrder.date.seconds * 1000).toLocaleString()}
          <br />
          <strong>Número de Pedido:</strong> {dataOrder.numberOrder}
          <br />
          <Divider />
          <br />
          <strong>Productos:</strong>
          {/* Agregar un contenedor con estilos de desplazamiento */}
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
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
                      primary={`Articulo #${item.name}`}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            <strong>Descuento:</strong> {item.descuento}%
                            <br />
                            <strong>Subtotal:</strong> $
                            {item.subtotal.toLocaleString("es-AR")}
                            <br />
                            <strong>Precio Unitario:</strong> $
                            {item.unit_price.toLocaleString("es-AR")}
                            <br />
                            <strong>Cantidad:</strong> {item.quantity}
                            <br />
                            <strong>Talle:</strong> {item.talle}
                            <br />
                            <strong>Color:</strong> {item.color}
                            <br />
                            <strong>ID #</strong> {item.productId}
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
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              marginRight: "2rem",
              marginTop: "1rem",
            }}
          >
            <h6>
              <strong>Total:</strong>
            </h6>
            <h6 style={{ fontFamily: "Roboto Condensed, sans-serif" }}>
              ARS $ {dataOrder.total}{" "}
            </h6>
          </div>
          <br />
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
          {/* Mostrar el estado anterior solo si la orden está archivada */}
          {dataOrder.status === "archivada" && (
            <div style={{ fontSize: "200%" }}>
              {" "}
              {estadoRender(dataOrder.lastState)}
            </div>
          )}
        </Typography>
      </CardContent>
      <CardActions>
        <PDFDownloadLink
          style={{ marginTop: "10px" }}
          document={<ModalPDF data={dataOrder} dataCliente={dataCliente} />}
          fileName="hola"
        >
          {({ blob, url, loading, error }) => (
            <Button variant="contained">
              {loading ? "Generando PDF..." : "Descargar PDF"}
              <span class="material-symbols-outlined">print</span>
            </Button>
          )}
        </PDFDownloadLink>
      </CardActions>
    </Card>
  );
};

export default OrderCard;
