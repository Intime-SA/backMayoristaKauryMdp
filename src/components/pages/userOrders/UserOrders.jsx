import React, { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Box, Button } from "@mui/material";
import UserOrdersDetail from "./UserOrdersDetail";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);

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
        top: "15rem",
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
      <UserOrdersDetail orders={orders} />
      {/* <div>
        <h1 style={{ color: "#c4072c" }}>Productos</h1>
      </div>

      <div style={{ display: "flex" }}>
        {products.map((product) => (
          <div
            key={product.id}
            className="card"
            style={{ width: "20rem", margin: "5rem", height:  }}
          >
            <img
              src={product.image}
              className="card-img-top"
              alt={product.name}
              width={"250px"}
              height={"450px"}
            />
            <div className="card-body">
              <h3 className="card-title">{product.id}</h3>
              <h5 className="card-title">{product.name}</h5>
              <p className="card-text">{product.description}</p>
              <ul>
                <li>{product.talle}</li>
                <li>{product.color}</li>
              </ul>
              <h3 style={{ fontFamily: "arial" }} className="card-text">
                ARS$ {product.unit_price}
              </h3>
              <button type="button" class="btn btn-secondary">
                <span
                  style={{ fontSize: "2rem" }}
                  class="material-symbols-outlined"
                >
                  edit_note
                </span>
              </button>
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default UserOrders;
