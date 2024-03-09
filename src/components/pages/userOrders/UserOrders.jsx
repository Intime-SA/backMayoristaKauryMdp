import React, { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Box, Button } from "@mui/material";
import UserOrdersDetail from "./UserOrdersDetail";
import UserOrderForm from "./UserOrderForm";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [openForm, setOpenForm] = useState(false);

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
        setOrders(newArray);
      })
      .catch((err) => console.log(err));
  }, []);

  console.log(orders);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-end",
        flexDirection: "column",
        fontSize: "2rem",
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
              add
            </span>
            Agregar orden de Compra
          </Button>
        </div>
      </Box>
      <div style={{ width: "100%" }}>
        {openForm ? <UserOrderForm /> : <UserOrdersDetail orders={orders} />}
      </div>
    </div>
  );
};

export default UserOrders;
