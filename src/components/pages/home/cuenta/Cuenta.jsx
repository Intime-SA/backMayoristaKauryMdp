import React, { useContext, useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";
import LockResetIcon from "@mui/icons-material/LockReset";
import { AuthContext } from "../../../context/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { Link } from "react-router-dom";

const UserInfo = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
}));

const UserDetails = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    marginLeft: 0,
    marginTop: theme.spacing(1),
  },
}));

const Cuenta = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserByEmail = async () => {
      try {
        // Referencia a la colección "users" y filtra por el campo "email"
        const usersCollection = collection(db, "users");
        const userQuery = query(
          usersCollection,
          where("email", "==", user.email)
        );
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
          // Asumiendo que solo habrá un documento que coincida con el email
          const doc = querySnapshot.docs[0];
          const userData = { id: doc.id, ...doc.data() };
          setUserData(userData);
        } else {
          console.log("No user found with the given email.");
        }
      } catch (error) {
        console.error("Error fetching user: ", error);
      }
    };

    fetchUserByEmail();
  }, []);

  return (
    <Container maxWidth="md" style={{ marginTop: "40px" }}>
      {userData && ( // Renderizado condicional basado en userData
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#FF9550",
              marginRight: "20px",
              width: "70px",
              fontFamily: '"Kanit", sans-serif',
              height: "70px",
            }}
          >
            {userData.nombre.charAt(0).toUpperCase()}
            {userData.apellido.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <Typography
              style={{ fontFamily: '"Kanit", sans-serif' }}
              color="textSecondary"
            >
              {userData.nombre}, {userData.apellido}
            </Typography>
            <Typography
              style={{ fontFamily: '"Kanit", sans-serif' }}
              color="textSecondary"
            ></Typography>
            <Typography
              style={{ fontFamily: '"Kanit", sans-serif' }}
              color="textSecondary"
            >
              {userData.email}
            </Typography>
            <Typography
              style={{ fontFamily: '"Kanit", sans-serif', fontWeight: "900" }}
              color="textSecondary"
            >
              Administrador
            </Typography>
            {/* <Typography color="textSecondary">{userData?.phone}</Typography> */}
          </div>
          <Grid container justifyContent="flex-end">
            <Link to="/forgot-password">
              <Button
                variant="contained"
                color="primary"
                startIcon={<LockResetIcon />}
                style={{ fontFamily: '"Kanit", sans-serif' }}
              >
                Cambiar Contraseña
              </Button>
            </Link>
          </Grid>
        </div>
      )}
    </Container>
  );
};

export default Cuenta;
