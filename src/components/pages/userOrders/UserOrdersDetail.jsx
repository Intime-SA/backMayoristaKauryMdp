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
  addDoc,
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
  Checkbox,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from "@mui/material";
import OrderCard from "./OrderCard";
import emailjs from "emailjs-com";
import EmailModal from "../dashboard/clients/EmailModal";
import EmailModalOrder from "./EmailModalOrder";
import * as XLSX from "xlsx"; // Importa la biblioteca XLSX

function Row(props) {
  const {
    row,
    setOpenOrder,
    setDataOrder,
    setChangeStatus,
    changeStatus,
    openOrder,
    selected,
    handleChangeCheckbox,
  } = props;
  const [open, setOpen] = useState(false);
  const [nombreCliente, setNombreCliente] = useState(null);
  const [status, setStatus] = useState("Estado no encontrado");
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModalEmail, setOpenModalEmail] = useState(false);
  const [closeModalEmail, setCloseModalEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [toname, setToname] = useState("");

  const openDataOrderCard = async (id) => {
    const refCollection = collection(db, "userOrders");
    const snapShotCollection = await getDocs(refCollection);
    setOpenOrder(true);
    snapShotCollection.forEach((element) => {
      console.log(element.data());
      if (element.data().numberOrder === id) setDataOrder(element.data());
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
    } else if (estado === "Archivada") {
      return (
        <Alert variant="contained" color="info">
          <AlertTitle>Archivada</AlertTitle>
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

  const handleOpenModal = async (clientRef) => {
    try {
      const clienteDoc = await getDoc(clientRef);

      if (clienteDoc.exists()) {
        // Si existe, obtener los datos del cliente y construir el nombre
        const clienteData = clienteDoc.data();
        const nombreCliente = clienteData.name;
        const emailCliente = clienteData.email; // Suponiendo que el campo del nombre del cliente se llama "nombre"

        // Establecer los valores de toname, email y abrir el modal
        setToname(nombreCliente);
        setEmail(emailCliente);
        setOpenModalEmail(true);

        return nombreCliente;
      } else {
        console.log("El documento del cliente no existe.");
        return null;
      }
    } catch (error) {
      console.error("Error al abrir el modal:", error);
      return null;
    }
  };

  const sendEmail = (subject, message, toname) => {
    emailjs
      .send(
        "service_trtdi6v",
        "template_59j1wkl",
        {
          from_email: email,
          subject: subject,
          message: message,
          to_name: toname,
        },
        "uAivPuB-RJ_3LBVlN"
      )
      .then(
        (response) => {
          console.log("Correo electrónico enviado con éxito:", response);
        },
        (error) => {
          console.error("Error al enviar el correo electrónico:", error);
        }
      );
  };

  const agregarDocumentoAFirebase = async (
    docSnapshot,
    lastState,
    nuevoEstado
  ) => {
    try {
      const newCollectionRef = collection(db, "archivadas"); // Reemplaza "nuevaColeccion" con el nombre de tu nueva colección
      await addDoc(newCollectionRef, {
        ...docSnapshot.data(), // Copia todos los campos existentes del documento
        lastState: lastState,
        status: nuevoEstado,
      });
      console.log("Documento guardado en la nueva colección correctamente.");
    } catch (error) {
      console.error(
        "Error al guardar el documento en la nueva colección:",
        error
      );
    }
  };

  const handleChangeStatus = async (nuevoEstado, orderId) => {
    try {
      const refCollection = collection(db, "userOrders");
      const snapShotCollection = await getDocs(refCollection);
      let idOrder = "";
      let lastState = "";
      snapShotCollection.forEach(async (element) => {
        if (element.data().numberOrder === orderId) {
          idOrder = element.id;
          const docSnapshot = await getDoc(doc(db, "userOrders", idOrder));
          if (nuevoEstado === "pagoRecibido") {
            const orderItems = docSnapshot.data().orderItems;
            // Restar stock de cada producto en orderItems
            orderItems.forEach(async (item) => {
              const productId = item.productId;
              const quantity = item.quantity;
              // Obtener el documento del producto
              const productRef = doc(db, "products", productId);
              const productDoc = await getDoc(productRef);
              if (productDoc.exists()) {
                const currentStock = productDoc.data().stock;
                // Actualizar el stock restando la cantidad de la orden
                const updatedStock = currentStock - quantity;
                // Actualizar el documento del producto en la base de datos
                await updateDoc(productRef, { stock: updatedStock });
                console.log(`Stock actualizado para el producto ${productId}`);
              } else {
                console.log(`No se encontró el producto con ID ${productId}`);
              }
            });
          }

          lastState = docSnapshot.data().status;
          if (docSnapshot.exists()) {
            // Update the status field of the document
            await updateDoc(doc(db, "userOrders", idOrder), {
              status: nuevoEstado,
              lastState: lastState,
            });
            setChangeStatus(!changeStatus);
            openDataOrderCard(orderId);
            if (openOrder) {
              setOpenOrder(false);
            }
            console.log("Estado de la orden actualizado correctamente.");

            // Aquí agregamos la condición para verificar si el nuevo estado es "enviada"
            if (nuevoEstado === "enviada") {
              // Ejecutar la función que deseas cuando el estado es "enviada"
              handleOpenModal(row.client);
            } else if (nuevoEstado === "archivada") {
              // Guardar el documento en la nueva colección con lastState y status
              await agregarDocumentoAFirebase(
                docSnapshot,
                lastState,
                nuevoEstado
              );
            }
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
      <EmailModalOrder
        open={openModalEmail}
        setCloseModalEmail={setCloseModalEmail}
        setOpenModalEmail={setOpenModalEmail}
        handleClose={closeModalEmail}
        sendEmail={sendEmail}
        email={email}
        toname={toname}
      />
      {row.status !== "archivada" && (
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            <Checkbox
              onClick={() => handleChangeCheckbox(row)} // Manejar los cambios en el checkbox
              inputProps={{ "aria-label": "controlled" }}
            />
          </TableCell>
          <TableCell align="center" style={{ width: "5%" }}>
            <Button onClick={() => openDataOrderCard(row.numberOrder)}>
              #{row.numberOrder}
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
                    onClick={() =>
                      handleChangeStatus("enviada", row.numberOrder)
                    }
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
                {row.status !== "nueva" &&
                row.status !== "pagoRecibido" &&
                row.status !== "empaquetada" ? (
                  <MenuItem
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                    onClick={() =>
                      handleChangeStatus("archivada", row.numberOrder)
                    }
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
                ) : (
                  <div></div>
                )}

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
      )}
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
  const [selectedOrders, setSelectedOrders] = useState([]);

  const exportToExcel = () => {
    // Construir los datos para cada orden seleccionada
    const data = selectedOrders.flatMap((order, index) => {
      const client = order.client || {};
      const date = order.date || {};
      const orderItems = order.orderItems || [];

      // Crear una fila de datos para cada ítem de la orden
      const orderRows = orderItems.map((item) => {
        const filaPedido = [
          order.numberOrder,
          client.calle || "",
          client.numero || "",
          client.pisoDpto || "",
          client.ciudad || "",
          client.estado || "",
          client.codigoPostal || "",
          client.pais || "",
          order.canalVenta || "",
          new Date(date.seconds * 1000).toLocaleString(), // Convertir la fecha UNIX a una cadena legible
          order.total || "",
          order.status || "",
          item.productId || "",
          item.name || "",
          item.color || "",
          item.talle || "",
          item.quantity || "",
          item.unit_price || "",
          item.descuento || "",
          item.subtotal || "",
        ];
        return filaPedido;
      });

      // Agregar una fila de línea divisoria después de cada orden (excepto después de la última)
      if (index < selectedOrders.length - 1) {
        const filaDivisoria = [
          "---",
          "---",
          "---",
          "---",
          "---",
          "---",
          "---",
          "---",
          "---",
          "---",
          "---",
          "---",
          "---",
          "---",
          "---",
          "---",
          "---",
          "---",
          "---",
        ];
        orderRows.push(filaDivisoria);
      }

      return orderRows;
    });

    // Encabezados de las columnas
    const header = [
      "Número de Orden",
      "Calle",
      "Número",
      "Piso/Dpto",
      "Ciudad",
      "Estado",
      "Código Postal",
      "País",
      "Canal de Venta",
      "Fecha",
      "Total",
      "Estado de la Orden",
      "ID Producto",
      "Nombre",
      "Color",
      "Talle",
      "Cantidad",
      "Precio Unitario",
      "Descuento",
      "Subtotal",
    ];

    // Combinar encabezados y datos
    const wsData = [header, ...data];

    // Crear hoja de cálculo
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MiHojaDeCalculo");

    // Descargar el archivo Excel
    XLSX.writeFile(wb, "OrdenesSeleccionadas.xlsx");
  };

  const handleCheckboxChange = (order) => {
    // Verifica si la orden ya está seleccionada
    const selectedIndex = selectedOrders.findIndex(
      (selectedOrder) => selectedOrder.id === order.id
    );
    const newSelectedOrders = [...selectedOrders];

    // Si la orden ya está seleccionada, la quita del arreglo; de lo contrario, la agrega
    if (selectedIndex === -1) {
      newSelectedOrders.push(order);
    } else {
      newSelectedOrders.splice(selectedIndex, 1);
    }

    setSelectedOrders(newSelectedOrders);
  };
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "nowrap",
        width: "100%",
        height: "auto",
        backgroundColor: "transparent",
        zoom: "0.9",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignItems: "flex-start",
        }}
      >
        <Button
          style={{ margin: "1rem" }}
          variant="outlined"
          onClick={() => exportToExcel()}
        >
          <span
            style={{ marginRight: "1rem" }}
            class="material-symbols-outlined"
          >
            download
          </span>{" "}
          Exportar
        </Button>
        <TableContainer
          component={Paper}
          style={{ backgroundColor: "rgba(249, 214, 224, 0.6)" }}
        >
          <Table
            aria-label="collapsible table"
            style={{ backgroundColor: "white" }}
          >
            <TableHead style={{ backgroundColor: "rgba(249, 214, 224, 0.6)" }}>
              <TableCell
                align="center"
                style={{
                  width: "5%",
                  paddingLeft: "8px",
                  fontFamily: "Roboto Condensed, sans-serif",
                }}
              >
                <span class="material-symbols-outlined">check_box</span>
              </TableCell>
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
              {orders.map((order) => (
                <Row
                  key={order.id}
                  row={order}
                  setOpenOrder={setOpenOrder}
                  setDataOrder={setDataOrder}
                  setChangeStatus={setChangeStatus}
                  changeStatus={changeStatus}
                  openOrder={openOrder}
                  selected={selectedOrders} // Indicar si la orden está seleccionada
                  handleChangeCheckbox={handleCheckboxChange} // Pasar la función de manejo de cambio del checkbox
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {openOrder ? (
        <div
          style={{
            width: "30%",
            marginLeft: "0.5rem",
            marginRigth: "0.5rem",
            borderRadius: "5px",
            marginTop: "4.1rem",
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
