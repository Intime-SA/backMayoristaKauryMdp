import React, { useEffect, useState } from "react";
import { db } from "../../../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import ClientListDetail from "./ClientListDetail";
import { Box, Button } from "@mui/material";
import ClientForm from "./ClientForm";

const Clients = () => {
  const [customers, setCustomers] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [statusDelete, setStatusDelete] = useState(false);
  const [statusEdit, setStatusEdit] = useState(false);

  useEffect(() => {
    let refCollection = collection(db, "users");
    getDocs(refCollection)
      .then((querySnapshot) => {
        let newArray = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.roll === "customer") {
            newArray.push({ ...userData, id: doc.id });
          }
        });
        setCustomers(newArray);
      })
      .catch((err) => console.log(err));
  }, [statusDelete, openForm, statusEdit]);

  console.log(customers);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-end",
        flexDirection: "column",
        fontSize: "2rem",
        top: "5rem",
        position: "relative",
        width: "70vw",
      }}
    >
      <Box>
        <div style={{ marginBottom: "1rem" }}>
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
              person_add
            </span>
            Agregar nuevo Cliente
          </Button>
        </div>
      </Box>
      {!openForm ? (
        <ClientListDetail
          customers={customers}
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
  );
};

export default Clients;
