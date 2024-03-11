import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Link } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import {
  Cloud,
  ContentCopy,
  ContentCut,
  ContentPaste,
  OpenInNew,
  OpenInNewOff,
  OpenInNewOffOutlined,
} from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from "@mui/material";
import OrderCard from "./OrderCard";

function Row(props) {
  const {
    row,
    setOpenOrder,
    setDataOrder,
    setChangeStatus,
    changeStatus,
    openOrder,
  } = props;
  const [open, setOpen] = useState(false);
  const [nombreCliente, setNombreCliente] = useState(null);
  const [status, setStatus] = useState("Estado no encontrado");
  const [anchorEl, setAnchorEl] = useState(null);

  const openDataOrderCard = async (id) => {
    const refCollection = collection(db, "userOrders");
    const snapShotCollection = await getDocs(refCollection);
    setOpenOrder(true);
    snapShotCollection.forEach((element) => {
      if (element.data().numberOrder === id) setDataOrder(element.data());
      console.log(element.data());
    });
  };

  const open2 = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const estadoRender = (estado) => {
    console.log(estado);
    if (estado === "Nueva") {
      return (
        <Alert severity="warning">
          <AlertTitle style={{ marginTop: "10%", fontSize: "75%" }}>
            Pendiente
          </AlertTitle>
          {/* <strong>El pedido ya fue preparado</strong> */}
        </Alert>
      );
    } else if (estado === "Empaquetada") {
      return (
        <Alert style={{ fontSize: "75%" }} size="small" severity="info">
          Empaquetada
        </Alert>
      );
    } else if (estado === "Pago Recibido") {
      return (
        <Alert severity="success">
          <AlertTitle
            style={{ marginTop: "10%", fontSize: "75%" }}
            variant="outlined"
          >
            Pago Recibido
          </AlertTitle>
          {/* <strong>El pedido fue entregado con exito</strong> */}
        </Alert>
      );
    } else if (estado === "Enviada") {
      return (
        <Alert variant="outlined" severity="success">
          <AlertTitle style={{ marginTop: "10%", fontSize: "75%" }}>
            En Distribucion
          </AlertTitle>
          {/* <strong>El pedido fue entregado con exito</strong> */}
        </Alert>
      );
    } else if (estado === "Cancelada") {
      return (
        <Alert variant="outlined" severity="error">
          Cancelado
        </Alert>
      );
    }
  };

  useEffect(() => {
    const obtenerNombre = async () => {
      try {
        const nombre = await obtenerNombreCliente(row.client);
        setNombreCliente(nombre);
      } catch (error) {
        console.error("Error al obtener el nombre del cliente:", error);
      }
    };
    const calcularStatusCliente = async (estado) => {
      try {
        const refCollection = collection(db, "orderStatus");
        const querySnapshot = await getDocs(refCollection);

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (doc.id === estado) {
            setStatus(data.name);
          }
        });

        return status;
      } catch (error) {
        console.error("Error al calcular el estado:", error);
        throw error;
      }
    };

    calcularStatusCliente(row.status);
    obtenerNombre();
  }, [row.client.id, row.status]);

  const obtenerNombreCliente = async (clientRef) => {
    // Corregir el nombre del parámetro
    try {
      // Obtener el documento del cliente utilizando la referencia directa
      const clienteDoc = await getDoc(clientRef);

      // Verificar si el documento del cliente existe
      if (clienteDoc.exists()) {
        // Si existe, obtener los datos del cliente y construir el nombre
        const clienteData = clienteDoc.data();
        const nombreCliente = clienteData.name + " " + clienteData.apellido; // Suponiendo que el campo del nombre del cliente se llama "nombre"
        return nombreCliente;
      } else {
        // Si el documento del cliente no existe, devolver un mensaje de cliente no encontrado
        return "Cliente no encontrado";
      }
    } catch (error) {
      console.error("Error al obtener el nombre del cliente:", error);
      throw error; // Lanzar el error para manejarlo fuera de la función
    }
  };

  const calcularTotalOrden = (productos) => {
    let total = 0;
    for (const producto of productos) {
      total += producto.subtotal;
    }
    return total;
  };

  const date = new Date(row.date.seconds * 1000);

  // Formatear la fecha como string en formato dd/mm/yyyy
  const formattedFechaInicio = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;

  console.log(status);

  const handleChangeStatus = async (nuevoEstado, orderId) => {
    try {
      const refCollection = collection(db, "userOrders");
      const snapShotCollection = await getDocs(refCollection);
      let idOrder = "";
      snapShotCollection.forEach(async (element) => {
        if (element.data().numberOrder === orderId) {
          idOrder = element.id;
          const docSnapshot = await getDoc(doc(db, "userOrders", idOrder));
          if (docSnapshot.exists()) {
            // Update the status field of the document
            await updateDoc(doc(db, "userOrders", idOrder), {
              status: nuevoEstado,
            });
            setChangeStatus(!changeStatus);
            openDataOrderCard(orderId);
            if (openOrder) {
              setOpenOrder(false);
            }
            console.log("Estado de la orden actualizado correctamente.");
          } else {
            console.log("No se encontró el documento.");
          }
        }
      });
    } catch (error) {
      console.error("Error al actualizar el estado de la orden:", error);
    }
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell align="center" style={{ width: "5%" }}>
          <Button onClick={() => openDataOrderCard(row.numberOrder)}>
            {row.numberOrder}
          </Button>
        </TableCell>
        <TableCell style={{ width: "15%" }}>{formattedFechaInicio}</TableCell>
        <TableCell style={{ width: "15%" }} align="right">
          <p
            style={{
              fontFamily: "sans-serif",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            ${" "}
            {calcularTotalOrden(row.orderItems).toLocaleString("es-AR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </TableCell>
        <TableCell
          align="rigth"
          style={{ width: "5%" }}
          component="th"
          scope="row"
        >
          <IconButton
            style={{ marginLeft: "1rem" }}
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell style={{ width: "25%" }} align="right">
          {nombreCliente === null ? "Cargando..." : nombreCliente}
        </TableCell>
        <TableCell style={{ width: "15%" }} align="right">
          <div>{estadoRender(status)}</div>
        </TableCell>
        <TableCell style={{ width: "15%" }} align="right">
          <div>
            <Button
              id="demo-positioned-button"
              aria-controls={open ? "demo-positioned-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <span class="material-symbols-outlined">more_vert</span>
            </Button>
            <Menu
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorEl}
              open={open2}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              {row.status === "pagoRecibido" && (
                <MenuItem
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                  onClick={() =>
                    handleChangeStatus("empaquetada", row.numberOrder)
                  }
                >
                  <span
                    style={{ fontSize: "100%", margin: "1rem" }}
                    class="material-symbols-outlined"
                  >
                    deployed_code{" "}
                  </span>
                  <h6 style={{ fontSize: "100%", marginTop: "0.5rem" }}>
                    Marcar como empaquetada
                  </h6>
                </MenuItem>
              )}

              {row.status !== "nueva" && row.status === "empaquetada" && (
                <MenuItem
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                  onClick={() => handleChangeStatus("enviada", row.numberOrder)}
                >
                  <span
                    style={{ fontSize: "100%", margin: "1rem" }}
                    class="material-symbols-outlined"
                  >
                    local_shipping
                  </span>
                  <h6 style={{ fontSize: "100%", marginTop: "0.5rem" }}>
                    Notificar envio
                  </h6>
                </MenuItem>
              )}
              <MenuItem
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
                onClick={() => handleChangeStatus("archivada", row.numberOrder)}
              >
                <span
                  style={{ fontSize: "100%", margin: "1rem" }}
                  class="material-symbols-outlined"
                >
                  inventory_2
                </span>
                <h6 style={{ fontSize: "100%", marginTop: "0.5rem" }}>
                  Archivar
                </h6>
              </MenuItem>

              {row.status === "nueva" && (
                <MenuItem
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                  onClick={() =>
                    handleChangeStatus("pagoRecibido", row.numberOrder)
                  }
                >
                  <span
                    style={{ fontSize: "100%", margin: "1rem" }}
                    class="material-symbols-outlined"
                  >
                    account_balance
                  </span>
                  <h6 style={{ fontSize: "100%", marginTop: "0.5rem" }}>
                    Recibi Pago
                  </h6>
                </MenuItem>
              )}
              {row.status === "nueva" && (
                <MenuItem
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                  onClick={() =>
                    handleChangeStatus("cancelada", row.numberOrder)
                  }
                >
                  <span
                    style={{ fontSize: "100%", margin: "1rem" }}
                    class="material-symbols-outlined"
                  >
                    block
                  </span>
                  <h6 style={{ fontSize: "100%", marginTop: "0.5rem" }}>
                    Cancelar
                  </h6>
                </MenuItem>
              )}
            </Menu>
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
          }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
              ></Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">Precio Unitario</TableCell>
                    <TableCell align="right">SubTotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.orderItems.map((producto) => (
                    <TableRow key={producto.productId}>
                      <TableCell>
                        <img
                          style={{
                            width: "3rem",
                            borderRadius: "50px",
                            height: "3rem",
                          }}
                          src={producto.image}
                          alt=""
                        />
                      </TableCell>
                      <TableCell align="left" component="th" scope="row">
                        {producto.productId}{" "}
                        {/* Reemplaza 'nombre' con la propiedad correcta que contiene el nombre del producto */}
                      </TableCell>
                      <TableCell align="right">{producto.quantity}</TableCell>{" "}
                      {/* Reemplaza 'cantidad' con la propiedad correcta que contiene la cantidad del producto */}
                      <TableCell align="right">
                        ${" "}
                        {producto.unit_price.toLocaleString("es-AR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>{" "}
                      {/* Reemplaza 'precio' con la propiedad correcta que contiene el precio unitario del producto */}
                      <TableCell align="right">
                        ${" "}
                        {producto.subtotal.toLocaleString("es-AR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function UserOrdersDetail({ orders, setChangeStatus, changeStatus, openForm }) {
  const [openOrder, setOpenOrder] = useState(false);
  const [dataOrder, setDataOrder] = useState([]);
  // Aquí se espera la prop products
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "nowrap",
        width: "100%",
        height: "auto",
        backgroundColor: "transparent",
      }}
    >
      <TableContainer
        component={Paper}
        style={{ backgroundColor: "transparent" }}
      >
        <Table
          aria-label="collapsible table"
          style={{ backgroundColor: "white" }}
        >
          <TableHead>
            <TableCell
              align="center"
              style={{
                width: "5%",
                paddingLeft: "8px",
                fontFamily: "Roboto Condensed, sans-serif",
              }}
            >
              ID
            </TableCell>
            <TableCell
              align="left"
              style={{
                width: "30%",
                fontFamily: "Roboto Condensed, sans-serif",
              }}
            >
              Fecha
            </TableCell>
            <TableCell
              align="center"
              style={{
                width: "15%",
                fontFamily: "Roboto Condensed, sans-serif",
              }}
            >
              Total
            </TableCell>
            <TableCell
              align="right"
              style={{
                width: "5%",
                fontFamily: "Roboto Condensed, sans-serif",
              }}
            >
              Productos
            </TableCell>
            <TableCell
              align="right"
              style={{
                width: "25%",
                fontFamily: "Roboto Condensed, sans-serif",
              }}
            >
              Comprador
            </TableCell>
            <TableCell
              align="center"
              style={{
                width: "10%",
                fontFamily: "Roboto Condensed, sans-serif",
              }}
            >
              Estado
            </TableCell>
            <TableCell
              align="center"
              style={{
                width: "20%",
                fontFamily: "Roboto Condensed, sans-serif",
              }}
            >
              Acciones
            </TableCell>
          </TableHead>
          <TableBody>
            {orders.map((user) => (
              <Row
                key={user.id}
                row={user}
                setOpenOrder={setOpenOrder}
                setDataOrder={setDataOrder}
                setChangeStatus={setChangeStatus}
                changeStatus={changeStatus}
                openOrder={openOrder}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {openOrder ? (
        <div
          style={{
            width: "30%",
            marginLeft: "0.5rem",
            marginRigth: "0.5rem",
            borderRadius: "5px",
          }}
        >
          <OrderCard
            dataOrder={dataOrder}
            setChangeStatus={setChangeStatus}
            changeStatus={changeStatus}
            openForm={openForm}
          ></OrderCard>
        </div>
      ) : null}
    </div>
  );
}

UserOrdersDetail.propTypes = {
  products: PropTypes.array.isRequired, // Definiendo las propTypes
};

export default UserOrdersDetail;
