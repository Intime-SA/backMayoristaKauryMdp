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
import Alert from "@mui/joy/Alert";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import {
  OpenInNew,
  OpenInNewOff,
  OpenInNewOffOutlined,
} from "@mui/icons-material";

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);
  const [nombreCliente, setNombreCliente] = useState(null);
  const [productosCompletos, setProductosCompletos] = useState([]);

  useEffect(() => {
    const obtenerNombre = async () => {
      try {
        obtenerOrderItems();
        // Obtener el nombre del cliente
        const nombre = await obtenerNombreCliente(row.client.id);
        setNombreCliente(nombre);
      } catch (error) {
        console.error("Error al obtener el nombre del cliente:", error);
      }
    };

    obtenerNombre();
  }, [row.client.id]);

  const obtenerNombreCliente = async (clienteId) => {
    try {
      // Obtener la referencia a la colección "users" en Firestore
      const refCollection = collection(db, "users");

      // Obtener todos los documentos de la colección "users"
      const querySnapshot = await getDocs(refCollection);

      // Iterar sobre los documentos para encontrar el cliente específico
      let nombreCliente = "Cliente no encontrado"; // Valor predeterminado si no se encuentra el cliente

      querySnapshot.forEach((doc) => {
        // Verificar si el ID del documento coincide con el clienteId
        if (doc.id === clienteId) {
          // Si coincide, obtener los datos del documento y el nombre del cliente
          const clienteData = doc.data();
          nombreCliente = clienteData.nombre + " " + clienteData.apellido; // Suponiendo que el campo del nombre del cliente se llama "nombre"
        }
      });

      // Devolver el nombre del cliente encontrado
      return nombreCliente;
    } catch (error) {
      console.error("Error al obtener el nombre del cliente:", error);
      throw error;
    }
  };

  const obtenerOrderItems = async () => {
    const refCollection = collection(db, "userOrders");
    const querySnapshot = await getDocs(refCollection);
    let newArray = [];
    querySnapshot.forEach((doc) => {
      newArray.push(...doc.data().orderItems);
    });

    let productos = [];

    for (const item of newArray) {
      try {
        const productDoc = await getDoc(doc(db, "products", item.productId));
        const productData = productDoc.data();
        const subtotal = productData.unit_price * item.quantity;
        if (productDoc.exists()) {
          // Agregar el producto completo al arreglo con la cantidad
          productos.push({
            id: productDoc.id,
            ...productDoc.data(),
            cantidad: item.quantity,
            subtotal: subtotal,
          });
        } else {
          console.log("El producto con ID", item.productId, "no existe.");
        }
      } catch (error) {
        console.error(
          "Error obteniendo el producto con ID",
          item.productId,
          ":",
          error
        );
      }
    }

    setProductosCompletos(productos);
    return productos;
  };

  const calcularTotalOrden = (productos) => {
    let total = 0;
    for (const producto of productos) {
      total += producto.subtotal;
    }
    return total;
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell style={{ width: "5%" }} component="th" scope="row">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell style={{ width: "5%" }}>{row.numberOrder}</TableCell>
        <TableCell style={{ width: "15%" }}>{row.date}</TableCell>
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
            {calcularTotalOrden(productosCompletos).toLocaleString("es-AR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </TableCell>
        <TableCell style={{ width: "25%" }} align="right">
          {nombreCliente === null ? "Cargando..." : nombreCliente}
        </TableCell>
        <TableCell style={{ width: "15%" }} align="right">
          <Alert variant="solid" color="success">
            {row.status}
          </Alert>
        </TableCell>
        <TableCell style={{ width: "15%" }} align="right">
          <IconButton
            aria-label="Open in new tab"
            component="a"
            href="#as-link"
          >
            <OpenInNew />
          </IconButton>
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
                  {productosCompletos.map((producto) => (
                    <TableRow key={producto.id}>
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
                        {producto.name}{" "}
                        {/* Reemplaza 'nombre' con la propiedad correcta que contiene el nombre del producto */}
                      </TableCell>
                      <TableCell align="right">{producto.cantidad}</TableCell>{" "}
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

function UserOrdersDetail({ orders }) {
  // Aquí se espera la prop products
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableCell />
          <TableCell align="left" style={{ width: "5%", paddingLeft: "8px" }}>
            ID
          </TableCell>
          <TableCell align="left" style={{ width: "30%" }}>
            Fecha
          </TableCell>
          <TableCell align="right" style={{ width: "15%" }}>
            Total
          </TableCell>
          <TableCell align="right" style={{ width: "25%" }}>
            Comprador
          </TableCell>
          <TableCell align="center" style={{ width: "10%" }}>
            Estado
          </TableCell>
          <TableCell align="center" style={{ width: "20%" }}>
            Acciones
          </TableCell>
        </TableHead>
        <TableBody>
          {orders.map((user) => (
            <Row key={user.id} row={user} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

UserOrdersDetail.propTypes = {
  products: PropTypes.array.isRequired, // Definiendo las propTypes
};

export default UserOrdersDetail;
