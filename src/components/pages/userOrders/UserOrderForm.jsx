import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import {
  Autocomplete,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ScrollableContainer from "./ScrolleableContainer";

function UserOrderForm() {
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [datosEnvio, setDatosEnvio] = useState("");
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [cantidadProducto, setCantidadProducto] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modalProductos, setModalProductos] = useState([]);
  const [productSelect, setProductSelect] = useState([]);
  const [porcentajeDescuento, setPorcentajeDescuento] = useState(0);
  const [error1, setError1] = useState("");

  useEffect(() => {
    const obtenerClientes = async () => {
      try {
        const refCollection = collection(db, "users");
        const querySnapshot = await getDocs(refCollection);
        const clientesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClientes(clientesData);
      } catch (error) {
        console.error("Error al obtener clientes:", error);
      }
    };

    obtenerClientes();
  }, []);

  const handleClienteChange = (event, newValue) => {
    setClienteSeleccionado(newValue);
    if (newValue && newValue.direccion) {
      setDatosEnvio(newValue.direccion);
    } else {
      setDatosEnvio("");
    }
  };

  const handleAddProduct = () => {
    // Validar si hay un producto seleccionado
    if (!productSelect.unit_price) {
      setError1("Debe seleccionar un producto para agregar a la Orden");
      return; // Detener la ejecución si no hay producto seleccionado
    }

    // Agregar producto seleccionado a la lista de productos seleccionados
    const productoSeleccionado = {
      ...productSelect,
      name: searchQuery, // Nombre del producto obtenido del campo de búsqueda
      cantidad: cantidadProducto,
      porcentajeDescuento: porcentajeDescuento,
    };

    setProductosSeleccionados((prevProductosSeleccionados) => [
      ...prevProductosSeleccionados,
      productoSeleccionado,
    ]);

    // Limpiar el estado de error
    setError1("");

    // Limpiar el producto seleccionado
    setProductSelect("");

    // Cerrar el modal
    setOpenModal(false);

    // Limpiar el campo de búsqueda
    setSearchQuery("");

    // Restablecer la cantidad de producto a 1
    setCantidadProducto(1);
  };

  const handleBuscarProductos = async () => {
    try {
      const productosRef = collection(db, "products");
      const q = query(
        productosRef,
        orderBy("name"),
        where("name", "==", searchQuery) // Buscar productos con el nombre igual al valor del campo de búsqueda
      );
      const querySnapshot = await getDocs(q);
      const productosData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setModalProductos(productosData);
    } catch (error) {
      console.error("Error al buscar productos:", error);
    }
  };

  const styles = {
    productList: {
      display: "flex",
      flexWrap: "wrap",
      gap: "0.5rem",
      maxHeight: "50vh", // Establece una altura máxima para que los elementos sean desplazables si exceden el espacio
      overflowY: "auto", // Añade una barra de desplazamiento vertical si es necesario
      alignItems: "flex-start",
      width: "100%",
    },
    productContainer: {
      width: "calc(50% - 0.5rem)",
      marginBottom: "0.5rem",
      width: "100%",
    },
    productButton: {
      width: "100%",
      height: "75px",
      display: "flex",
      alignItems: "center",
      textAlign: "left",
      backgroundColor: "#f0f0f0",
      borderRadius: "8px",
      padding: "1rem",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      transition: "background-color 0.3s ease",
      "&:hover": {
        backgroundColor: "#e0e0e0",
      },
    },
    productInfo: {
      flexGrow: 1,
    },
    productName: {
      margin: "0",
      marginBottom: "0.5rem",
      fontSize: "1.2rem",
      fontWeight: "bold",
      color: "#333",
    },
    productDetails: {
      margin: "0",
      fontSize: "0.9rem",
      color: "#666",
      fontFamily: "Roboto Condensed, sans-serif",
      width: "100%",
    },
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "1rem",
        marginBottom: "1rem",
        backgroundColor: "#f7f7f7",
        zoom: "0.9",
      }}
    >
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "1rem",
          marginBottom: "1rem",
          backgroundColor: "#f7f7f7",
        }}
      >
        <h6>Cliente</h6>
        <Autocomplete
          options={clientes}
          getOptionLabel={(option) => `${option.name} ${option.apellido}`}
          onChange={handleClienteChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Seleccionar cliente"
              variant="outlined"
            />
          )}
        />
        <br />
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "1rem",
            marginBottom: "1rem",
            backgroundColor: "#f7f7f7",
          }}
        >
          <h6>Datos de envio</h6>
          <TextField
            label="Datos de envío"
            variant="outlined"
            value={datosEnvio}
            disabled
            fullWidth
            style={{ marginTop: "1rem" }}
          />
        </div>
      </div>

      <Button style={{ margin: "1rem" }} onClick={() => setOpenModal(true)}>
        <span class="material-symbols-outlined">search</span>
        Productos
      </Button>
      {error1 ? <h6 style={{ color: "red" }}>{error1}</h6> : <h6></h6>}

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <ScrollableContainer>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              marginBottom: "1rem",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            <TextField
              label="Buscar producto"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ marginRight: "0.5rem" }}
            />
            <Button
              onClick={handleBuscarProductos}
              variant="contained"
              style={{ height: "100%" }}
            >
              <span class="material-symbols-outlined">search</span>
            </Button>
          </div>
          {modalProductos.map((producto) => (
            <div key={producto.id} style={styles.productContainer}>
              <Button
                onClick={() => {
                  setProductSelect(producto);
                  setSearchQuery(producto.name);
                  setOpenModal(false);
                }}
                style={styles.productButton}
              >
                {producto.image ? (
                  <img
                    src={producto.image}
                    alt={producto.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50px",
                      margin: "1rem",
                    }}
                  />
                ) : (
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/mayoristakaurymdp.appspot.com/o/Mayorista%20Mar%20del%20Plata%20(2).png?alt=media&token=87bdf689-8eb7-49b1-9317-f6a52a9a0781"
                    alt="Imagen por defecto"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50px",
                      margin: "1rem",
                    }}
                  />
                )}
                <div style={styles.productInfo}>
                  <h4 style={styles.productName}>{producto.name}</h4>
                  <p style={styles.productDetails}>
                    Precio: <strong>{producto.unit_price}</strong> | Color:{" "}
                    <strong>{producto.color}</strong> | Talle:{" "}
                    <strong>{producto.talle}</strong>
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: "120%" }}>
                    Stock <strong>{producto.stock}</strong>
                  </p>
                </div>
              </Button>
            </div>
          ))}
        </ScrollableContainer>
      </Modal>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {productSelect.image ? (
          <img
            src={productSelect.image}
            alt={productSelect.name}
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50px",
            }}
          />
        ) : (
          <img
            src="https://firebasestorage.googleapis.com/v0/b/mayoristakaurymdp.appspot.com/o/Mayorista%20Mar%20del%20Plata%20(2).png?alt=media&token=87bdf689-8eb7-49b1-9317-f6a52a9a0781"
            alt="Imagen por defecto"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50px",
            }}
          />
        )}
        {productSelect.name ? (
          <div>
            <h6>{productSelect.name}</h6>
          </div>
        ) : null}
        <TextField
          label="Cantidad"
          type="number"
          value={cantidadProducto}
          onChange={(e) => setCantidadProducto(parseInt(e.target.value))}
          variant="outlined"
          fullWidth
          style={{ marginTop: "1rem", width: "10%" }}
          inputProps={{ min: 1 }}
        />
        <TextField
          label="Descuento %"
          type="number"
          value={porcentajeDescuento}
          onChange={(e) => setPorcentajeDescuento(parseInt(e.target.value))}
          variant="outlined"
          fullWidth
          style={{ marginTop: "1rem", width: "10%" }}
          inputProps={{ min: 1 }}
        />
        <Button
          variant="contained"
          onClick={handleAddProduct}
          style={{ marginTop: "1rem" }}
        >
          <span class="material-symbols-outlined">add_shopping_cart</span>
        </Button>
      </div>

      <h6 style={{ marginTop: "2rem" }}>Articulos agregados a la orden</h6>
      <TableContainer component={Paper} style={{ marginTop: "1rem" }}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Artículo</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Cantidad</TableCell>

              <TableCell>Descuento</TableCell>
              <TableCell>Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productosSeleccionados.map((producto, index) => (
              <TableRow key={index}>
                <TableCell>
                  {producto.image ? (
                    <img
                      src={producto.image}
                      alt={producto.name}
                      style={{
                        width: "75px",
                        height: "75px",
                        borderRadius: "50px",
                      }}
                    />
                  ) : (
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/mayoristakaurymdp.appspot.com/o/Mayorista%20Mar%20del%20Plata%20(2).png?alt=media&token=87bdf689-8eb7-49b1-9317-f6a52a9a0781"
                      alt="Imagen por defecto"
                      style={{
                        width: "75px",
                        height: "75px",
                        borderRadius: "50px",
                      }}
                    />
                  )}
                </TableCell>
                <TableCell>{producto.name}</TableCell>
                <TableCell>$ {producto.unit_price}</TableCell>
                <TableCell>{producto.cantidad}</TableCell>
                <TableCell>{producto.porcentajeDescuento}%</TableCell>
                <TableCell style={{ fontWeight: "900" }}>
                  {/* Subtotal - Descuento */}${" "}
                  {(
                    producto.unit_price * producto.cantidad -
                    (producto.unit_price *
                      producto.cantidad *
                      producto.porcentajeDescuento) /
                      100
                  ).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default UserOrderForm;
