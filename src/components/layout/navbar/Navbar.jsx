import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./Navbar.css";
import LogoutIcon from "@mui/icons-material/Logout";
import { menuItems } from "../../../router/navigation";
import { logOut } from "../../../firebaseConfig";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import ClassIcon from "@mui/icons-material/Class";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DrawerMenu from "../drawer/Drawer";

const drawerWidth = 200;

function Navbar(props) {
  const { user } = useContext(AuthContext);
  const rolAdmin = import.meta.env.VITE_ADMIN;
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const cerrarSesion = () => {
    logOut();
    navigate("/login");
  };

  const welcomeUser = () => {
    const userData = JSON.parse(localStorage.getItem("userInfo"));
    if (userData.rol === rolAdmin) {
      let admin = "Administrador";
      return `Usuario: ${userData.email} - Rol: ${admin}`;
    } else if (userData.rol === "user") {
      let usuario = "Usuario restringido";
      return `Usuario: ${userData.email} - Rol: ${usuario}`;
    } else {
      return ""; // Si no hay datos de usuario en el localStorage, devuelve una cadena vacía
    }
  };

  const drawer = (
    <div
      style={{
        color: "#c4072c",
        backgroundColor: "whitesmoke",
        height: "100%",
      }}
    >
      <Toolbar />

      <List
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {menuItems.map(({ id, path, title, Icon }) => {
          return (
            <Link key={id} to={path}>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <Icon sx={{ color: "#c4072c", marginBottom: "1rem" }} />
                  </ListItemIcon>
                  <ListItemText primary={title} sx={{ color: "#c4072c" }} />
                </ListItemButton>
              </ListItem>
            </Link>
          );
        })}
        {user.rol === rolAdmin && (
          <Link to={"/dashboard"}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <AccountCircleIcon sx={{ color: "#c4072c" }} />
                </ListItemIcon>
                <ListItemText primary={"Clientes"} sx={{ color: "#c4072c" }} />
              </ListItemButton>
            </ListItem>
          </Link>
        )}

        <ListItem disablePadding>
          <ListItemButton onClick={cerrarSesion}>
            <ListItemIcon>
              <LogoutIcon sx={{ color: "#c4072c" }} />
            </ListItemIcon>
            <ListItemText primary={"Cerrar sesion"} sx={{ color: "#c4072c" }} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box
      sx={{
        display: "flex",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: "100%",
          backgroundColor: "#c4072c",
        }}
      >
        <Toolbar
          sx={{
            gap: "0px",
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "white",
          }}
        >
          <Link to="/" style={{ color: "#c4072c" }}>
            <div
              style={{
                marginLeft: "0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                height: "20%",
                width: "50vw",
              }}
            >
              <img
                style={{ height: "50px", marginLeft: "9.3%" }}
                src="https://www.kaury.com/img/kaury_logo_19.svg"
                alt="logo"
              />
              {/*               <h3 style={{ color: "#c4072c", marginLeft: "10.5%" }}>
                Mayorista Mar del Plata
              </h3>
              <h6 style={{ color: "#c4072c", marginLeft: "10.5%" }}>
                Back-End
              </h6> */}
              <h6 style={{ color: "#c4072c", marginLeft: "10.5%" }}>
                {welcomeUser()}
              </h6>
            </div>
          </Link>
          <IconButton
            color="#c4072c"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon color="secondary.primary" />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        aria-label="mailbox folders"
        sx={{
          [container]: {
            display: { xs: "block" },
          },
        }}
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          anchor={"right"}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#1976d2",
            },
          }}
        >
          {drawer}
        </Drawer>
        <DrawerMenu />
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
          width: "100%",
          minHeight: "100vh",
          px: 2,
          background: "#linear-gradient(252deg, #ffffff 0%, #121621 77%)",
        }}
      >
        <Toolbar />

        <Outlet />
      </Box>
    </Box>
  );
}

export default Navbar;
