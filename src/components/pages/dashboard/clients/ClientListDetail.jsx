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
import { Button } from "@mui/material";

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);
  console.log(row.fechaInicio.fecha);

  const client = () => {
    if (row.roll === "customer") {
      let client = "Cliente";
      return client;
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
          {row.nombre + " " + row.apellido}
        </TableCell>
        <TableCell>$</TableCell>
        <TableCell>$</TableCell>
        <TableCell align="right">{client()}</TableCell>
        <TableCell align="rigth">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <Link to="/edit">
              <span class="material-symbols-outlined">edit_note</span>
            </Link>
            <Link to="/envio">
              <span
                style={{ marginLeft: "1rem" }}
                class="material-symbols-outlined"
              >
                local_shipping
              </span>
            </Link>
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
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.email}
                    </TableCell>
                    <TableCell>{row.fechaInicio}</TableCell>
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

                      {row.telefono}
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

function ClientListDetail({ customers }) {
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
            <TableCell align="center">Datos Envio</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((user) => (
            <Row key={user.id} row={user} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

ClientListDetail.propTypes = {
  products: PropTypes.array.isRequired, // Definiendo las propTypes
};

export default ClientListDetail;
