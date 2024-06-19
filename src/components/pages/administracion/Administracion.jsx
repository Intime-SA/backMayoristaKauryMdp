import React, { useEffect, useState } from "react";
import { TextField, Button, ThemeProvider, createTheme } from "@mui/material";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const theme = createTheme({
  typography: {
    fontFamily: '"Kanit", sans-serif',
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label": {
            fontFamily: '"Kanit", sans-serif',
          },
          "& input": {
            fontFamily: '"Kanit", sans-serif',
          },
          "& .MuiInputBase-root": {
            fontFamily: '"Kanit", sans-serif',
          },
          "& .MuiFormHelperText-root": {
            fontFamily: '"Kanit", sans-serif',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Kanit", sans-serif',
        },
      },
    },
  },
});

const Administracion = () => {
  const [costos, setCostos] = useState([]);
  const [nuevosCostos, setNuevosCostos] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "costos"));
      const costosData = [];
      querySnapshot.forEach((doc) => {
        costosData.push({ id: doc.id, ...doc.data() });
      });
      setCostos(costosData);
    };

    fetchData();
  }, []);

  const formatCurrency = (value) => {
    const stringValue = String(value);
    console.log(stringValue);
    return parseFloat(stringValue).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    });
  };

  const handleChange = (index, field, value) => {
    const updatedCostos = { ...nuevosCostos };
    if (!updatedCostos[index]) {
      updatedCostos[index] = {};
    }
    // Eliminar signos de dólar, porcentaje, puntos y comas, luego convertir a número
    const numericValue = Number(value.replace(/[$%,.]/g, ""));
    updatedCostos[index][field] = numericValue;
    setNuevosCostos(updatedCostos);
  };

  const handleInput = (e) => {
    e.target.value = e.target.value.replace(/[$.,]/g, "");
  };

  const handleSubmit = async () => {
    try {
      for (const index in nuevosCostos) {
        const costo = nuevosCostos[index];
        const docRef = doc(db, "costos", costos[index].id);
        await updateDoc(docRef, costo);
        window.location.reload();
      }
      alert("Datos actualizados correctamente");
    } catch (error) {
      console.error("Error actualizando los datos: ", error);
      alert("Error actualizando los datos");
    }
  };

  const formatPercentage = (value) => {
    return `${value} %`;
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ marginTop: "5rem" }}>
        <h4 style={{ fontFamily: '"Kanit", sans-serif' }}>Administracion</h4>
        {costos.map((costo, index) => (
          <div key={index}>
            <div style={{ margin: "1rem" }}>
              <TextField
                id={`andreaniCostoDomicilio_${index}`}
                label="Costo de Envio"
                defaultValue={formatCurrency(costo.andreaniCostoDomicilio || 0)}
                helperText="Este es el costo de envio a Domicilio Cliente"
                variant="standard"
                onChange={(e) =>
                  handleChange(index, "andreaniCostoDomicilio", e.target.value)
                }
                onInput={handleInput} // Validar entrada
              />
            </div>
            <div style={{ margin: "1rem" }}>
              <TextField
                id={`andreaniAsucursal_${index}`}
                label="Costo de Envio"
                defaultValue={formatCurrency(costo.andreaniAsucursal || 0)}
                helperText="Este es el costo de envio a Sucursal Andreani"
                variant="standard"
                onChange={(e) =>
                  handleChange(index, "andreaniAsucursal", e.target.value)
                }
                onInput={handleInput} // Validar entrada
              />
            </div>
            <div style={{ margin: "1rem" }}>
              <TextField
                id={`transferencia_${index}`}
                label="Costo Transferencia"
                defaultValue={formatPercentage(costo.transferencia) || 0}
                helperText="Este es el costo % de pagar con transferencia en Retiro Showroom"
                variant="standard"
                onChange={(e) =>
                  handleChange(index, "transferencia", e.target.value)
                }
                onInput={handleInput} // Validar entrada
              />
            </div>
            <div style={{ margin: "1rem" }}>
              <TextField
                id={`minimoCompra_${index}`}
                label="Minimo de Compra"
                defaultValue={formatCurrency(costo.minimoCompra) || 0}
                helperText="Este es el minimo de compra que tienen los usuarios en la Web"
                variant="standard"
                onChange={(e) =>
                  handleChange(index, "minimoCompra", e.target.value)
                }
                onInput={handleInput} // Validar entrada
              />
            </div>
          </div>
        ))}
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Guardar Cambios
        </Button>
      </div>
    </ThemeProvider>
  );
};

export default Administracion;
