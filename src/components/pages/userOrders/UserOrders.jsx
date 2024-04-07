import React, { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import {
  Timestamp,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { Box, Button, TextField, InputAdornment } from "@mui/material";
import UserOrdersDetail from "./UserOrdersDetail";
import UserOrderForm from "./UserOrderForm";
import Typography from "@mui/material/Typography";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [changeStatus, setChangeStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [ordersPerPage] = useState(8); // Cantidad de órdenes por página
  const [filterDate, setFilterDate] = useState(""); // Estado para almacenar la fecha de filtro
  const [searchTerm, setSearchTerm] = useState("");
  const [orderFilters, setOrdersFilters] = useState([]);
  const [ordersLength, setOrdersLength] = useState(0);

  useEffect(() => {
    // Esperar a que orders tenga datos
    if (orders.length > 0) {
      setOrdersFilters(orders);
    }
  }, [orders]);

  useEffect(() => {
    const recorrerOrders = () => {
      let newArrayLength = [];
      orders.forEach((element) => {
        if (element.status !== "archivada") {
          newArrayLength.push(element);
        }
      });
      setOrdersLength(newArrayLength.length);
    };

    recorrerOrders();
  }, [orders]);

  useEffect(() => {
    let refCollection = collection(db, "userOrders");
    let queryRef = refCollection;

    // Si filterDate está vacío o no es una fecha válida, obtener todas las órdenes
    if (!filterDate || isNaN(new Date(filterDate).getTime())) {
      queryRef = refCollection;
    } else {
      // Convertir la fecha del TextField a un objeto Date
      const selectedDate = new Date(filterDate);

      // Extraer la fecha del objeto Date
      const selectedDateOnly = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );

      // Construir el filtro para la fecha
      queryRef = query(
        refCollection,
        where("date", ">=", Timestamp.fromDate(selectedDateOnly)),
        where(
          "date",
          "<",
          Timestamp.fromDate(
            new Date(selectedDateOnly.getTime() + 24 * 60 * 60 * 1000)
          )
        ) // Para incluir todas las horas del día seleccionado
      );
    }

    getDocs(queryRef)
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
  }, [openForm, changeStatus, filterDate]);

  // Calcular índices del primer y último pedido en la página actual
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders =
    orderFilters.length > 0
      ? orderFilters.slice(indexOfFirstOrder, indexOfLastOrder)
      : orders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Función para manejar el cambio en el TextField de fecha
  const handleDateChange = (event) => {
    setFilterDate(event.target.value);
    console.log(event.target.value);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    console.log(searchTerm);

    // Convertir el término de búsqueda a un número
    const searchTermNumber = parseInt(searchTerm);

    console.log(orders);
    // Filtrar los pedidos donde el número de orden sea exactamente igual al término de búsqueda
    const filteredOrder = orders.filter(
      (order) => order.numberOrder === searchTermNumber
    );

    // Establecer los pedidos filtrados como el nuevo estado
    setOrdersFilters(filteredOrder);
  };

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
        <div
          style={{
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <TextField
            id="date"
            label="Filtrar por fecha"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            style={{ marginRight: "1rem" }}
            value={filterDate} // Asignar valor del estado
            onChange={handleDateChange} // Manejar cambio de fecha
          />
          <div>
            <TextField
              label="Orden N°"
              onChange={handleSearch}
              value={searchTerm}
            />
          </div>
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
            ordersLenght={orders.length}
          />
        )}
      </div>
      <Box
        mt={2}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Botones de paginación */}
        <Typography component="span" variant="body2" color="text.primary">
          Ordenes Activas: <strong>{ordersLength}</strong>
        </Typography>
        <div>
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
        </div>
      </Box>
    </div>
  );
};

export default UserOrders;
