import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../../firebaseConfig";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert(
      "Se ha enviado un mensaje a su casilla de Correo No Deseado. Sigue las instrucciones para recuperar su cuenta."
    );
    const res = await forgotPassword(email);
    console.log(res);
    navigate("/login");
    return res;
  };

  return (
    <div>
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "40px",
          // backgroundColor: theme.palette.secondary.main,
        }}
      >
        <Typography
          variant="h5"
          color={"primary"}
          style={{ fontFamily: '"Kanit", sans-serif' }}
        >
          ¿Desea actualizar su contraseña?
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid
            container
            rowSpacing={2}
            // alignItems="center"
            justifyContent={"center"}
          >
            <Grid item xs={10} md={12}>
              <TextField
                type="text"
                variant="outlined"
                label="Email"
                fullWidth
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                style={{ fontFamily: '"Kanit", sans-serif' }}
                InputLabelProps={{
                  shrink: true,
                  style: { fontFamily: '"Kanit", sans-serif' }, // Cambiar la fuente de la etiqueta
                }}
                InputProps={{
                  style: { fontFamily: '"Kanit", sans-serif' }, // Cambiar la fuente del valor
                }}
              />
            </Grid>
            <Grid item xs={10} md={12}>
              <Button
                style={{ fontFamily: '"Kanit", sans-serif' }}
                type="submit"
                variant="contained"
                fullWidth
              >
                Recuperar
              </Button>
            </Grid>
            <Grid item xs={10} md={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                onClick={() => navigate("/login")}
                style={{ fontFamily: '"Kanit", sans-serif' }}
              >
                Regresar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </div>
  );
};

export default ForgotPassword;
