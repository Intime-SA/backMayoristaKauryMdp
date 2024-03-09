import React, { useEffect, useState } from "react";
import { db } from "../../../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import ClientListDetail from "./ClientListDetail";
import { Box, Button } from "@mui/material";
import ClientForm from "./ClientForm";
import * as XLSX from "xlsx"; // Importa la biblioteca XLSX

const Clients = () => {
  const [customers, setCustomers] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [statusDelete, setStatusDelete] = useState(false);
  const [statusEdit, setStatusEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [customersPerPage] = useState(5); // Cantidad de clientes por página
  const [clients, setClients] = useState();

  useEffect(() => {
    let refCollection = collection(db, "users");
    getDocs(refCollection)
      .then((querySnapshot) => {
        let newArray = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (
            userData.roll === "customerDirect" ||
            userData.roll === "customer"
          ) {
            newArray.push({ ...userData, id: doc.id });
          }
        });
        setCustomers(newArray);
      })
      .catch((err) => console.log(err));
  }, [statusDelete, openForm, statusEdit]);

  useEffect(() => {
    if (customers) {
      setClients(customers.length);
    }
  }, [customers]);

  const exportToExcel = () => {
    const data = customers.map((customer) => {
      const filaPedido = [
        customer.roll,
        customer.telefono,
        customer.email,
        customer.name,
        customer.apellido,
      ];
      return filaPedido;
    });

    const header = [
      "Roll",
      "Telefono",
      "Correo Electronico",
      "Nombre",
      "Apellido",
    ];
    // const productHeaders = pedidoLista.reduce((headers, pedido) => {
    //   const numProductos = pedido.productos.length;
    //   for (let i = 0; i < numProductos; i++) {
    //     if (header.length < numProductos) {
    //       headers.push(...[`Producto ${i + 1}`]);
    //       // Agrega otras propiedades del producto si es necesario
    //     }
    //   }
    //   return headers;
    // }, []);

    const wsData = [header, ...data];
    // wsData[0].push(...productHeaders); // Agrega los encabezados de productos al encabezado principal

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MiHojaDeCalculo");
    XLSX.writeFile(wb, "mi_archivo_excel.xlsx");
  };

  // Calcular índices del primer y último cliente en la página actual
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        fontSize: "2rem",
        position: "relative",
        width: "70vw",
        marginLeft: "13vw",
        marginRight: "13vw",
      }}
    >
      <Box>
        <div style={{ marginBottom: "1rem" }}>
          <Button
            style={{ marginLeft: "1rem" }}
            variant="outlined"
            color="error"
            onClick={exportToExcel}
          >
            <span
              style={{ marginRight: "0.5rem" }}
              className="material-symbols-outlined"
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
              className="material-symbols-outlined"
            >
              person_add
            </span>
            Nuevo Cliente
          </Button>
        </div>
      </Box>
      <h6>Cantidad total de clientes: {clients}</h6>
      <div style={{ width: "100%" }}>
        {!openForm ? (
          <ClientListDetail
            customers={currentCustomers}
            setStatusDelete={setStatusDelete}
            statusDelete={statusDelete}
            setOpenForm={setOpenForm}
            setStatusEdit={setStatusEdit}
            statusEdit={statusEdit}
          />
        ) : (
          <ClientForm
            customers={customers}
            setOpenForm={setOpenForm}
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

export default Clients;
