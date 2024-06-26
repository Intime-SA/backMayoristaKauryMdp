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

  console.log(dataOrder);

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
          <AlertTitle
            style={{
              fontSize: "100%",
              height: "0.5rem",
              fontFamily: '"Kanit", sans-serif',
            }}
          >
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
            fontFamily: '"Kanit", sans-serif',
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
              fontFamily: '"Kanit", sans-serif',
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
          <AlertTitle
            style={{
              fontSize: "100%",
              height: "0.5rem",
              fontFamily: '"Kanit", sans-serif',
            }}
          >
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
            fontFamily: '"Kanit", sans-serif',
          }}
        >
          Cancelado
        </Alert>
      );
    } else if (estado === "archivada") {
      return (
        <Alert
          style={{ fontFamily: '"Kanit", sans-serif' }}
          variant="contained"
          color="info"
        >
          <AlertTitle>Archivada</AlertTitle>
        </Alert>
      );
    }
  };

  const phoneNumber = (number) => {
    console.log(number);
    handleWhatsAppClick(number);
  };

  const handleWhatsAppClick = (number) => {
    // Cambia '1234567890' por el número de teléfono del cliente
    const phoneNumber = `54${number}`;
    const message = "Hola, te contactamos de Kaury Mayorista MDP";

    // Crea el enlace con el API de WhatsApp Business
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    // Abre el enlace en una nueva ventana
    window.open(whatsappLink, "_blank");
  };

  const handleDownloadPDF = () => {
    console.log(window.location.href); // Imprimir la URL de la página
    // Lógica para descargar el PDF
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
        backgroundColor: cardBackgroundColor,
        fontFamily: '"Kanit", sans-serif', // Color de fondo dinámico
      }}
    >
      <CardContent>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            style={{
              textAlign: "left",
              fontSize: "1.2rem",
              fontFamily: '"Kanit", sans-serif',
            }}
            gutterBottom
            variant="h6"
            component="div"
            color="#3f51b5"
          >
            <h6 style={{ fontSize: "150%" }}>
              {" "}
              #
              <strong style={{ fontFamily: '"Kanit", sans-serif' }}>
                {dataOrder.numberOrder}
              </strong>
            </h6>
            <h6 style={{ fontSize: "70%", fontFamily: '"Kanit", sans-serif' }}>
              {" "}
              ID: {dataOrder.id}
            </h6>
          </Typography>
          <div>{estadoRender(dataOrder.status)}</div>
        </div>

        <Typography
          variant="body1"
          color="text.secondary"
          fontSize="1.2rem"
          style={{ fontFamily: '"Kanit", sans-serif' }}
        >
          <strong>Fecha:</strong>{" "}
          {new Date(dataOrder.date.seconds * 1000).toLocaleString()}
          <Divider />
          <React.Fragment>
            Email: {dataCliente?.email}
            <br />
            Apellido: {dataCliente?.apellido}
            <br />
            Nombre: {dataCliente?.name}
            <br />
            Telefono: {dataCliente?.telefono}
            <br />
            DNI/CUIT: {dataCliente?.dni}
          </React.Fragment>
          <Divider />
          {dataOrder.tipoEnvio === 1 ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{ fontSize: "150%", color: "red", marginTop: "1rem" }}
                class="material-symbols-outlined"
              >
                local_shipping
              </span>
              <Typography
                variant="body2"
                color="error"
                style={{ marginLeft: "1rem" }}
              >
                {dataOrder.envioSeleccionado === "envioDomicilio" ? (
                  <Typography
                    variant="body2"
                    color="error"
                    style={{
                      margin: "1rem",
                      marginLeft: "0px",
                      fontSize: "1.2rem",
                      fontWeight: "900",
                      marginBottom: "0px",
                      fontFamily: '"Kanit", sans-serif',
                    }}
                  >
                    Domicilio cliente
                  </Typography>
                ) : (
                  <Typography
                    variant="body2"
                    color="error"
                    style={{
                      margin: "1rem",
                      marginLeft: "0px",
                      fontSize: "1.2rem",
                      fontWeight: "900",
                      marginBottom: "0px",
                      fontFamily: '"Kanit", sans-serif',
                    }}
                  >
                    Sucursal a Convenir
                  </Typography>
                )}
              </Typography>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", marginTop: "1rem" }}>
                <span
                  style={{ fontSize: "150%", color: "red" }}
                  class="material-symbols-outlined"
                >
                  store
                </span>
                <Typography
                  variant="body2"
                  color="error"
                  style={{
                    marginLeft: "1rem",
                    fontSize: "1.2rem",
                    fontWeight: "900",
                    fontFamily: '"Kanit", sans-serif',
                  }}
                >
                  Retiro por sucursal
                </Typography>
              </div>

              <Typography variant="body2" color="error">
                {dataOrder.sucursal === 1 && (
                  <div>
                    <Typography
                      variant="body2"
                      color="error"
                      style={{ fontFamily: '"Kanit", sans-serif' }}
                    >
                      Jose Marmol 970 / 10:00 a 17:00hs
                    </Typography>
                  </div>
                )}
                {dataOrder.sucursal === 2 && (
                  <Typography
                    variant="body2"
                    color="error"
                    style={{ fontFamily: '"Kanit", sans-serif' }}
                  >
                    Rivadavia 5931 / 10:00 a 17:00hs
                  </Typography>
                )}
              </Typography>
            </div>
          )}
          <Divider />
          <br />
          <strong style={{ fontFamily: '"Kanit", sans-serif' }}>
            Productos:
          </strong>
          {/* Agregar un contenedor con estilos de desplazamiento */}
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            <List>
              {dataOrder.orderItems.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={`Articulo #${item.name}`}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            style={{ fontFamily: '"Kanit", sans-serif' }}
                          >
                            <strong
                              style={{ fontFamily: '"Kanit", sans-serif' }}
                            >
                              Descuento:
                            </strong>{" "}
                            {item.descuento}%
                            <br />
                            <strong
                              style={{ fontFamily: '"Kanit", sans-serif' }}
                            >
                              Subtotal:
                            </strong>{" "}
                            ${item.subtotal.toLocaleString("es-AR")}
                            <br />
                            <strong
                              style={{ fontFamily: '"Kanit", sans-serif' }}
                            >
                              Precio Unitario:
                            </strong>{" "}
                            ${item.unit_price.toLocaleString("es-AR")}
                            <br />
                            <strong
                              style={{ fontFamily: '"Kanit", sans-serif' }}
                            >
                              Cantidad:
                            </strong>{" "}
                            {item.quantity}
                            <br />
                            <strong
                              style={{ fontFamily: '"Kanit", sans-serif' }}
                            >
                              Talle:
                            </strong>{" "}
                            {item.talle}
                            <br />
                            <strong
                              style={{ fontFamily: '"Kanit", sans-serif' }}
                            >
                              Color:
                            </strong>{" "}
                            {item.color}
                            <br />
                            <strong
                              style={{ fontFamily: '"Kanit", sans-serif' }}
                            >
                              ID #
                            </strong>{" "}
                            {item.productId}
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
              color: "#c4072c",
              marginTop: "1rem",
              paddingTop: "0px",
            }}
          >
            <h6
              style={{
                fontSize: "1.5rem",
                fontWeight: "900",
                fontFamily: '"Kanit", sans-serif',
              }}
            ></h6>
            <h5
              style={{
                fontFamily: '"Kanit", sans-serif',
                fontSize: "1.5rem",
                fontWeight: "900",
              }}
            >
              ARS ${" "}
              {dataOrder.total.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
            </h5>
          </div>
          <br />
          <strong>Información de Entrega:</strong>
          <br />
          <Divider />
          País: Argentina
          <br />
          Provincia: {dataOrder.infoEntrega.estado}
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
          {dataOrder.status === "archivada" && (
            <div style={{ fontSize: "200%" }}>
              {" "}
              {estadoRender(dataOrder.lastState)}
            </div>
          )}
        </Typography>
      </CardContent>
      <CardActions style={{ display: "flex", justifyContent: "space-between" }}>
        <PDFDownloadLink
          style={{ margin: "1rem  " }}
          document={<ModalPDF data={dataOrder} dataCliente={dataCliente} />}
          fileName={"OrdenNumero-" + dataOrder.numberOrder}
        >
          {({ blob, url, loading, error }) => (
            <Button variant="contained" onClick={handleDownloadPDF}>
              <span class="material-symbols-outlined">print</span>
            </Button>
          )}
        </PDFDownloadLink>
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <Button
            style={{ marginBottom: "0.5rem" }}
            onClick={() => phoneNumber(dataCliente?.telefono)}
          >
            <img
              style={{ marginTop: "0.5rem" }}
              width="30rem"
              src="https://firebasestorage.googleapis.com/v0/b/mayoristakaurymdp.appspot.com/o/0000000.jpg?alt=media&token=b0e2700c-4487-4764-9103-0814b47377c8"
              alt="logowsp"
            />
          </Button>
        </div>
      </CardActions>
    </Card>
  );
};

export default OrderCard;
