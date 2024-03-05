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
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { Button } from "@mui/material";
import EditProduct from "./EditProduct";
import "./ItemListDetail.css";

function Row(props) {
  const { row, setIsChange, isChange } = props;
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Estado para indicar si se está editando el producto
  const [editingProductId, setEditingProductId] = useState(null); // Estado para almacenar el ID del producto que se está editando

  useEffect(() => {
    const traerCategorias = async (param) => {
      const docSnap = await getDoc(param);
      if (docSnap.exists()) {
        setCategory(docSnap.data().name);
        setIsChange(false);
      }
    };

    traerCategorias(row.category);
  }, [row.category]);

  const editProducts = (productId) => {
    const idString = productId.toString();
    setEditingProductId(idString);
    setIsEditing(true);
  };

  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      setIsChange(!isChange);
      console.log(`Producto ${id} eliminado correctamente.`);
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.idc}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right" style={{ fontWeight: "bold" }}>
          $ {row.unit_price.toFixed(2)}
        </TableCell>

        <TableCell align="right">{row.stock}</TableCell>
        <TableCell align="right">{row.talle}</TableCell>
        <TableCell align="right">{row.color}</TableCell>
        <TableCell align="right">{category}</TableCell>
        <TableCell align="right">
          <Button onClick={() => editProducts(row.idc)}>
            <span class="material-symbols-outlined">edit</span>
          </Button>
          <Button onClick={() => deleteProduct(row.id)}>
            <span class="material-symbols-outlined">delete</span>
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
              ></Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="center"
                      sx={{ fontFamily: "Roboto Condensed, sans-serif" }}
                    >
                      Imagen
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ fontFamily: "Roboto Condensed, sans-serif" }}
                    >
                      Descripción
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontFamily: "Roboto Condensed, sans-serif" }}
                    >
                      Precio Promocional
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.image ? (
                        <img
                          src={row.image}
                          alt={row.name}
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
                    </TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell align="right">
                      {(row.unit_price - (row.unit_price * 15) / 100).toFixed(
                        2
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <TableCell colSpan={12}>
        <div style={{ width: "100%" }}>
          {isEditing && ( // Renderizar el componente EditProducts si se está editando un producto
            <EditProduct
              editingProductId={editingProductId}
              setIsEditing={setIsEditing}
              setIsChange={setIsChange}
              isChange={isChange}
            />
          )}
        </div>
      </TableCell>
    </React.Fragment>
  );
}

function ItemListDetail({ products, setIsChange, isChange }) {
  return (
    <TableContainer
      component={Paper}
      className="tableContainer" // Aplicando clase de estilo CSS
      style={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }}
    >
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell sx={{ fontFamily: "Roboto Condensed, sans-serif" }}>
              ID
            </TableCell>
            <TableCell sx={{ fontFamily: "Roboto Condensed, sans-serif" }}>
              Producto
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontFamily: "Roboto Condensed, sans-serif" }}
            >
              Precio
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontFamily: "Roboto Condensed, sans-serif" }}
            >
              Stock
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontFamily: "Roboto Condensed, sans-serif" }}
            >
              Talle
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontFamily: "Roboto Condensed, sans-serif" }}
            >
              Color
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontFamily: "Roboto Condensed, sans-serif" }}
            >
              Categoria
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontFamily: "Roboto Condensed, sans-serif" }}
            >
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <Row
              key={product.id}
              row={product}
              setIsChange={setIsChange}
              isChange={isChange}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

ItemListDetail.propTypes = {
  products: PropTypes.array.isRequired,
};

export default ItemListDetail;
