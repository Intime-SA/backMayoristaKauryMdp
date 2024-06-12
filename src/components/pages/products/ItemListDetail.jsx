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
import { Button, Tooltip } from "@mui/material";
import EditProduct from "./EditProduct";
import "./ItemListDetail.css";

function Row(props) {
  const { row, setIsChange, isChange, setCambio, cambio } = props;
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Estado para indicar si se está editando el producto
  const [editingProductId, setEditingProductId] = useState(null); // Estado para almacenar el ID del producto que se está editando

  useEffect(() => {
    const traerCategorias = async (param) => {
      const docRef = doc(db, "categorys", param);
      const docNamber = await getDoc(docRef);
      setCategory(docNamber.data().name);
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
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          fontFamily: '"Kanit", sans-serif',
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell
          sx={{ fontFamily: '"Kanit", sans-serif', fontWeight: 900 }}
          component="th"
          scope="row"
        >
          {row.idc}
        </TableCell>
        <TableCell
          sx={{ fontFamily: '"Kanit", sans-serif' }}
          component="th"
          scope="row"
        >
          {row.name}
        </TableCell>
        <TableCell
          sx={{ fontFamily: '"Kanit", sans-serif' }}
          align="right"
          style={{ fontWeight: "900" }}
        >
          $ {row.unit_price.toFixed(2)}
        </TableCell>

        <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }} align="right">
          {row.stock}
        </TableCell>
        <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }} align="right">
          {row.talle}
        </TableCell>
        <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }} align="right">
          {row.color}
        </TableCell>
        <TableCell
          sx={{ fontFamily: '"Kanit", sans-serif', fontWeight: 900 }}
          align="right"
        >
          {category}
        </TableCell>
        <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }} align="right">
          <Tooltip describeChild title="Editar">
            <Button onClick={() => editProducts(row.idc)}>
              <span class="material-symbols-outlined">edit</span>
            </Button>
          </Tooltip>
          <Tooltip describeChild title="Borrar">
            <Button onClick={() => deleteProduct(row.id)}>
              <span class="material-symbols-outlined">delete</span>
            </Button>
          </Tooltip>
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
                      sx={{ fontFamily: '"Kanit", sans-serif' }}
                    >
                      Imagen
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ fontFamily: '"Kanit", sans-serif' }}
                    >
                      Descripción
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontFamily: '"Kanit", sans-serif' }}
                    >
                      Precio Promocional
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row.id}>
                    <TableCell
                      sx={{ fontFamily: "Roboto, sans-serif" }}
                      component="th"
                      scope="row"
                    >
                      {row.imageCard ? (
                        <img
                          src={row.imageCard}
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
                    <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                      {row.description}
                    </TableCell>
                    <TableCell
                      sx={{ fontFamily: '"Kanit", sans-serif' }}
                      align="right"
                    >
                      $ {row.promotional_price}
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
              setCambio={setCambio}
              cambio={cambio}
            />
          )}
        </div>
      </TableCell>
    </React.Fragment>
  );
}

function ItemListDetail({
  products,
  setIsChange,
  isChange,
  setCambio,
  cambio,
}) {
  return (
    <TableContainer
      component={Paper}
      className="tableContainer" // Aplicando clase de estilo CSS
      style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}
    >
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow style={{ backgroundColor: "#121621", color: "white" }}>
            <TableCell />
            <TableCell
              sx={{ fontFamily: '"Kanit", sans-serif', color: "white" }}
            >
              ID
            </TableCell>
            <TableCell
              sx={{ fontFamily: '"Kanit", sans-serif', color: "white" }}
            >
              Producto
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontFamily: '"Kanit", sans-serif', color: "white" }}
            >
              Precio
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontFamily: '"Kanit", sans-serif', color: "white" }}
            >
              Stock
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontFamily: '"Kanit", sans-serif', color: "white" }}
            >
              Talle
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontFamily: '"Kanit", sans-serif', color: "white" }}
            >
              Color
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontFamily: '"Kanit", sans-serif', color: "white" }}
            >
              Categoria
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontFamily: '"Kanit", sans-serif', color: "white" }}
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
              setCambio={setCambio}
              cambio={cambio}
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
