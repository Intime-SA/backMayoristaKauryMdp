import React, { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Box, Button, TextField } from "@mui/material";
import UserOrdersDetail from "./UserOrdersDetail";
import UserOrderForm from "./UserOrderForm";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [changeStatus, setChangeStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [ordersPerPage] = useState(8); // Cantidad de órdenes por página

  useEffect(() => {
    let refCollection = collection(db, "userOrders");
    getDocs(refCollection)
      .then((querySnapshot) => {
        let newArray = [];
        querySnapshot.forEach((doc) => {
          const orderData = doc.data();
          if (orderData) {
            newArray.push({ ...orderData, id: doc.id });
          }
        });

        // Ordenar los pedidos por fecha de más reciente a más antiguo
        newArray.sort((a, b) => {
          const dateA = new Date(a.date.seconds * 1000);
          const dateB = new Date(b.date.seconds * 1000);
          return dateB - dateA; // Invertir el orden de la comparación
        });

        setOrders(newArray);
      })
      .catch((err) => console.log(err));
  }, [openForm, changeStatus]);

  // Calcular índices del primer y último pedido en la página actual
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-end",
        flexDirection: "column",
        fontSize: "2rem",
        position: "relative",
        width: "95vw",
      }}
    >
      <Box>
        <div style={{ marginBottom: "1rem" }}>
          <TextField
            id="date"
            label="Filtrar por fecha"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            style={{ marginRight: "1rem" }}
          />
          <Button
            style={{ marginLeft: "1rem" }}
            variant="outlined"
            color="error"
          >
            <span
              style={{ marginRight: "0.5rem" }}
              class="material-symbols-outlined"
            >
              download
            </span>
            Exportar Lista
          </Button>
          <Button
            style={{ marginLeft: "1rem" }}
            variant="contained"
            color="error"
            onClick={() => setOpenForm(true)}
          >
            <span
              style={{ marginRight: "0.5rem" }}
              class="material-symbols-outlined"
            >
              add
            </span>
            Agregar orden de Compra
          </Button>
        </div>
      </Box>
      <div style={{ width: "100%", height: "auto" }}>
        {openForm ? (
          <UserOrderForm setOpenForm={setOpenForm} />
        ) : (
          <UserOrdersDetail
            orders={currentOrders}
            setChangeStatus={setChangeStatus}
            changeStatus={changeStatus}
            openForm={openForm}
          />
        )}
      </div>
      <Box
        mt={2}
        style={{ display: "flex", justifyContent: "center", width: "100%" }}
      >
        {/* Botones de paginación */}
        <Button
          variant="contained"
          color="inherit"
          disabled={currentPage === 1}
          onClick={() => paginate(currentPage - 1)}
          style={{ margin: "1rem" }}
        >
          <span class="material-symbols-outlined">navigate_before</span>
        </Button>
        <Button
          variant="contained"
          onClick={() => paginate(currentPage + 1)}
          style={{ margin: "1rem" }}
        >
          <span class="material-symbols-outlined">navigate_next</span>
        </Button>
      </Box>
    </div>
  );
};

export default UserOrders;
