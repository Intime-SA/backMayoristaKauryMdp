import React, { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import ItemListDetail from "./ItemListDetail";
import { Box, Button, Modal, Tooltip } from "@mui/material";
import ProductForm from "./ProductForm";

const ItemListContainer = () => {
  const [products, setProducts] = useState([]);
  const [isChange, setIsChange] = useState(false);
  const [productSelected, setProductSelected] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let refCollection = collection(db, "products");
    getDocs(refCollection)
      .then((res) => {
        let newArray = res.docs.map((product) => {
          return { ...product.data(), id: product.id };
        });
        setProducts(newArray);
      })
      .catch((err) => console.log(err));
  }, [isChange, open]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = (product) => {
    setProductSelected(product);
    setOpen(true);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: "80vh",
    width: "80vw",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  console.log(products);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-start",
        flexDirection: "column",
        fontSize: "2rem",
        top: "5rem",
        position: "relative",
        width: "70vw",
      }}
    >
      <div
        style={{
          display: "flex",
          margin: "1rem",
        }}
      >
        <Tooltip describeChild title="Agregar producto nuevo">
          <Button onClick={() => handleOpen(null)}>
            <span class="material-symbols-outlined">add_box</span>
          </Button>
        </Tooltip>
        <Tooltip describeChild title="Actualizar stock">
          <Button>
            <span class="material-symbols-outlined">upload_file</span>
          </Button>
        </Tooltip>
        <Tooltip describeChild title="Descargar lista de productos">
          <Button>
            <span class="material-symbols-outlined">download</span>
          </Button>
        </Tooltip>
      </div>

      {open ? (
        <Box>
          <ProductForm
            handleClose={handleClose}
            setIsChange={setIsChange}
            productSelected={productSelected}
            setProductSelected={setProductSelected}
            setOpen={setOpen}
          />
        </Box>
      ) : null}

      {open === false ? (
        <div>
          <ItemListDetail products={products} setIsChange={setIsChange} />
        </div>
      ) : null}
    </div>
  );
};

export default ItemListContainer;
