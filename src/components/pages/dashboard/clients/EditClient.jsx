import React, { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import { db } from "../../../../firebaseConfig";
import { updateDoc, doc, getDoc } from "firebase/firestore";

const EditClient = ({
  customer,
  setOpenForm,
  editingClientId,
  setIsEditing,
  setStatusEdit,
  statusEdit,
}) => {
  const [editedClient, setEditedClient] = useState({
    datosEnvio: {
      calle: "",
      numero: "",
      pisoDpto: "",
      codigoPostal: "",
      barrio: "",
      ciudad: "",
      provincia: "",
    },
  });
  useEffect(() => {
    const fetchData = async () => {
      const clientRef = doc(db, "users", editingClientId);
      const clientSnap = await getDoc(clientRef);

      if (clientSnap.exists()) {
        const clientData = clientSnap.data();
        console.log(clientData);
        setEditedClient(clientData);
      } else {
        console.log("no se encontro el cliente por ID");
      }
    };
    fetchData();
  }, [editingClientId]);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("datosEnvio")) {
      // Si el campo pertenece a datos de envío, actualiza el estado nested
      const nestedName = name.split(".")[1];
      setEditedClient({
        ...editedClient,
        datosEnvio: {
          ...editedClient.datosEnvio,
          [nestedName]: value,
        },
      });
    } else {
      // Si es un campo normal, actualiza el estado como antes
      setEditedClient({ ...editedClient, [name]: value });
    }
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos obligatorios
    const requiredFields = ["name", "apellido", "email"];
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!editedClient[field]) {
        newErrors[field] = `El ${field} es requerido.`;
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Actualizar los datos del cliente en la base de datos
    const docRef = doc(db, "users", editingClientId);
    console.log(docRef);
    await updateDoc(docRef, {
      name: editedClient.name,
      email: editedClient.email,
      apellido: editedClient.apellido,
      telefono: editedClient.telefono,
      datosEnvio: editedClient.datosEnvio,
    });
    setIsEditing(false);
    setStatusEdit(!statusEdit);
    console.log("ok");
  };

  const handleReturn = () => {
    setIsEditing(false);
  };

  return (
    <div style={{ overflow: "auto", height: "50vh", zoom: "0.8" }}>
      <h5 style={{ marginTop: "1rem", fontFamily: '"Kanit", sans-serif' }}>
        Editar Cliente
      </h5>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
        >
          {/* Sección de Datos de Cliente */}
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "1rem",
              marginBottom: "0.5rem",
            }}
          >
            <h5
              style={{
                margin: "1rem",
                marginBottom: "2rem",
                fontFamily: '"Kanit", sans-serif',
              }}
            >
              Datos de Cliente
            </h5>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <TextField
                name="name"
                variant="outlined"
                label="Nombre"
                value={editedClient.name}
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "50%",
                  maxWidth: "200px",
                }}
                InputLabelProps={{
                  shrink: true,
                  style: { fontFamily: '"Kanit", sans-serif' }, // Cambiar la fuente de la etiqueta
                }}
                InputProps={{
                  style: { fontFamily: '"Kanit", sans-serif' }, // Cambiar la fuente del valor
                }}
                error={!!errors.name}
                helperText={errors.name}
                disabled // Deshabilitar edición
              />
              <TextField
                name="apellido"
                variant="outlined"
                label="Apellido"
                value={editedClient.apellido}
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "50%",
                  maxWidth: "200px",
                }}
                InputLabelProps={{
                  shrink: true,
                  style: { fontFamily: '"Kanit", sans-serif' }, // Cambiar la fuente de la etiqueta
                }}
                InputProps={{
                  style: { fontFamily: '"Kanit", sans-serif' }, // Cambiar la fuente del valor
                }}
                error={!!errors.apellido}
                helperText={errors.apellido}
                disabled // Deshabilitar edición
              />
              <TextField
                name="email"
                variant="outlined"
                label="Correo electrónico"
                value={editedClient.email}
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "100%",
                  maxWidth: "400px",
                }}
                InputLabelProps={{
                  shrink: true,
                  style: { fontFamily: '"Kanit", sans-serif' }, // Cambiar la fuente de la etiqueta
                }}
                InputProps={{
                  style: { fontFamily: '"Kanit", sans-serif' }, // Cambiar la fuente del valor
                }}
                error={!!errors.email}
                helperText={errors.email}
                disabled // Deshabilitar edición
              />
              <TextField
                name="telefono"
                variant="outlined"
                label="Telefono"
                value={editedClient.telefono}
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "100%",
                  maxWidth: "400px",
                }}
                InputLabelProps={{
                  shrink: true,
                  style: { fontFamily: '"Kanit", sans-serif' }, // Cambiar la fuente de la etiqueta
                }}
                InputProps={{
                  style: { fontFamily: '"Kanit", sans-serif' }, // Cambiar la fuente del valor
                }}
                error={!!errors.telefono}
                helperText={errors.telefono}
              />
            </div>
          </div>

          {/* Sección de Datos de Envío */}
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "1rem",
              marginBottom: "0.5rem",
            }}
          >
            <h5
              style={{
                marginTop: "0rem",
                marginBottom: "2rem",
                marginLeft: "1rem",
                fontFamily: '"Kanit", sans-serif',
              }}
            >
              Datos de Envío
            </h5>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <TextField
                name="datosEnvio.calle"
                variant="outlined"
                label="Calle"
                value={
                  editedClient.datosEnvio
                    ? editedClient.datosEnvio.calle || ""
                    : ""
                }
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "100%",
                  maxWidth: "400px",
                }}
                InputLabelProps={{
                  shrink: true,
                  style: { fontFamily: '"Kanit", sans-serif' }, // Cambiar la fuente de la etiqueta
                }}
                InputProps={{
                  style: { fontFamily: '"Kanit", sans-serif' }, // Cambiar la fuente del valor
                }}
              />

              <TextField
                name="datosEnvio.numero"
                variant="outlined"
                label="Número"
                value={
                  editedClient.datosEnvio
                    ? editedClient.datosEnvio.numero || ""
                    : ""
                }
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "50%",
                  maxWidth: "200px",
                }}
                InputLabelProps={{
                  shrink: true,
                  style: { fontFamily: '"Kanit", sans-serif' }, // Cambiar la fuente de la etiqueta
                }}
                InputProps={{
                  style: { fontFamily: '"Kanit", sans-serif' }, // Cambiar la fuente del valor
                }}
              />

              <TextField
                name="datosEnvio.pisoDpto"
                variant="outlined"
                label="Piso/Dpto"
                value={
                  editedClient.datosEnvio
                    ? editedClient.datosEnvio.pisoDpto || ""
                    : ""
                }
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "50%",
                  maxWidth: "200px",
                }}
                InputLabelProps={{
                  shrink: true,
                  style: { fontFamily: '"Kanit", sans-serif' }, // Cambiar la fuente de la etiqueta
                }}
                InputProps={{
                  style: { fontFamily: '"Kanit", sans-serif' }, // Cambiar la fuente del valor
                }}
              />

              <TextField
                name="datosEnvio.codigoPostal"
                variant="outlined"
                label="Código Postal"
                value={
                  editedClient.datosEnvio
                    ? editedClient.datosEnvio.codigoPostal || ""
                    : ""
                }
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "50%",
                  maxWidth: "200px",
                }}
                InputLabelProps={{
                  shrink: true,
                  style: { fontFamily: '"Kanit", sans-serif' }, // Cambiar la fuente de la etiqueta
                }}
                InputProps={{
                  style: { fontFamily: '"Kanit", sans-serif' }, // Cambiar la fuente del valor
                }}
              />

              <TextField
                name="datosEnvio.barrio"
                variant="outlined"
                label="Barrio"
                value={
                  editedClient.datosEnvio
                    ? editedClient.datosEnvio.barrio || ""
                    : ""
                }
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "100%",
                  maxWidth: "400px",
                }}
                InputLabelProps={{
                  shrink: true,
                  style: { fontFamily: '"Kanit", sans-serif' }, // Cambiar la fuente de la etiqueta
                }}
                InputProps={{
                  style: { fontFamily: '"Kanit", sans-serif' }, // Cambiar la fuente del valor
                }}
              />

              <TextField
                name="datosEnvio.ciudad"
                variant="outlined"
                label="Ciudad"
                value={
                  editedClient.datosEnvio
                    ? editedClient.datosEnvio.ciudad || ""
                    : ""
                }
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "100%",
                  maxWidth: "400px",
                }}
                InputLabelProps={{
                  shrink: true,
                  style: { fontFamily: '"Kanit", sans-serif' }, // Cambiar la fuente de la etiqueta
                }}
                InputProps={{
                  style: { fontFamily: '"Kanit", sans-serif' }, // Cambiar la fuente del valor
                }}
              />

              <TextField
                name="datosEnvio.provincia"
                variant="outlined"
                label="Provincia"
                value={
                  editedClient.datosEnvio
                    ? editedClient.datosEnvio.provincia || ""
                    : ""
                }
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "100%",
                  maxWidth: "400px",
                }}
                InputLabelProps={{
                  shrink: true,
                  style: { fontFamily: '"Kanit", sans-serif' }, // Cambiar la fuente de la etiqueta
                }}
                InputProps={{
                  style: { fontFamily: '"Kanit", sans-serif' }, // Cambiar la fuente del valor
                }}
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{
              marginBottom: "1rem",
              width: "50%",
              maxWidth: "200px",
              fontFamily: '"Kanit", sans-serif',
            }}
          >
            Guardar Cambios
          </Button>
        </form>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          style={{ fontFamily: '"Kanit", sans-serif' }}
          variant="contained"
          onClick={handleReturn}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default EditClient;
