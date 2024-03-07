import React, { useState } from "react";
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
import { Link } from "react-router-dom";
import { Button, Tooltip } from "@mui/material";
import ClientShippingTooltip from "./ClientShippingTooltip";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import EditClient from "./EditClient";

function Row(props) {
  const {
    row,
    setStatusDelete,
    statusDelete,
    setEditingClientId,
    setIsEditing,
    setOpenForm,
  } = props;
  const [open, setOpen] = useState(false);

  const renderShippingData = () => {
    if (row.datosEnvio && Object.keys(row.datosEnvio).length > 0) {
      return (
        <div>
          <Typography variant="body1">Datos de Envío:</Typography>
          <ul>
            {Object.entries(row.datosEnvio).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      );
    } else {
      return (
        <Typography variant="body1">
          No existen datos de envío guardados para este cliente.
        </Typography>
      );
    }
  };

  console.log(row.fechaInicio);

  const fechaInicio = new Date(row.fechaInicio.seconds * 1000);

  // Formatear la fecha como string en formato dd/mm/yyyy
  const formattedFechaInicio = `${fechaInicio.getDate()}/${
    fechaInicio.getMonth() + 1
  }/${fechaInicio.getFullYear()}`;

  const client = () => {
    if (row.roll === "customer") {
      let client = "Cliente";
      return client;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setStatusDelete(!statusDelete);
      console.log(`Usuario ${id} eliminado correctamente.`);
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };

  const editClient = async (id) => {
    try {
      setEditingClientId(id);
      setIsEditing(true);
    } catch (error) {
      console.log(error);
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
          {row.name + " " + row.apellido}
        </TableCell>
        <TableCell>$</TableCell>
        <TableCell>$</TableCell>
        <TableCell align="right">{client()}</TableCell>
        <TableCell align="rigth">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button onClick={() => editClient(row.id)}>
              <span class="material-symbols-outlined">edit</span>
            </Button>
            <Tooltip title={renderShippingData()} arrow>
              <Button>
                <span class="material-symbols-outlined">local_shipping</span>
              </Button>
              <Button onClick={() => deleteProduct(row.id)}>
                <span class="material-symbols-outlined">delete</span>
              </Button>
            </Tooltip>
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            backgroundColor: "#C7C7C7",
            paddingBottom: 0,
            paddingTop: 0,
          }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, backgroundColor: "#C7C7C7" }}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
              ></Typography>
              <Table size="small" aria-label="purchases">
                <TableHead style={{ backgroundColor: "#C7C7C7" }}>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>Fecha Adhesion</TableCell>
                    <TableCell align="right">Contacto</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody style={{ backgroundColor: "#C7C7C7", border: 0 }}>
                  <TableRow /* key={row.fec} */>
                    <TableCell component="th" scope="row">
                      {row.email}
                    </TableCell>
                    <TableCell>{formattedFechaInicio}</TableCell>
                    <TableCell align="right">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                      >
                        <a style={{ margin: "1rem" }} href="/dashboard">
                          <span class="material-symbols-outlined">mail</span>
                        </a>
                        <a style={{ marginBottom: "0.5rem" }} href="/dashboard">
                          <img
                            width="20rem"
                            src="https://firebasestorage.googleapis.com/v0/b/mayoristakaurymdp.appspot.com/o/whatsapp.svg?alt=media&token=83bb48a7-7405-4a69-867c-44568a7e108f"
                            alt="logowsp"
                          />
                        </a>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

/* Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
}; */

function ClientListDetail({
  customers,
  setStatusDelete,
  statusDelete,
  setOpenForm,
  setStatusEdit,
  statusEdit,
}) {
  const [isEditing, setIsEditing] = useState(false); // Estado para indicar si se está editando el producto
  const [editingClientId, setEditingClientId] = useState(null); // Estado para almacenar el ID del producto que se está editando

  // Aquí se espera la prop products
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell align="left">Nombre Completo</TableCell>
            <TableCell align="left">Total Consumido</TableCell>
            <TableCell align="left">Cantidad Compras</TableCell>
            <TableCell align="right">Canal</TableCell>
            <TableCell align="center">Acciones</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((user) => (
            <Row
              key={user.id}
              row={user}
              setStatusDelete={setStatusDelete}
              statusDelete={statusDelete}
              setEditingClientId={setEditingClientId}
              setIsEditing={setIsEditing}
              setOpenForm={setOpenForm}
            />
          ))}
        </TableBody>
      </Table>
      <table>
        <TableCell>
          <div style={{ width: "100%" }}>
            {isEditing && ( // Renderizar el componente EditProducts si se está editando un producto
              <EditClient
                setEditingClientId={setEditingClientId}
                editingClientId={editingClientId}
                setIsEditing={setIsEditing}
                setOpenForm={setOpenForm}
                setStatusEdit={setStatusEdit}
                statusEdit={statusEdit}
              />
            )}
          </div>
        </TableCell>
      </table>
    </TableContainer>
  );
}

ClientListDetail.propTypes = {
  products: PropTypes.array.isRequired, // Definiendo las propTypes
};

export default ClientListDetail;
