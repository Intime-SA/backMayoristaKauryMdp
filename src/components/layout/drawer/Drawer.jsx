import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { menuItems } from "../../../router/navigation";
import { Link } from "react-router-dom";
import { Button, Slide, Tooltip, useMediaQuery } from "@mui/material";
import { createTheme, useTheme } from "@mui/material/styles";
import { DrawerContext } from "../../context/DrawerContext";
import { AuthContext } from "../../context/AuthContext";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./Drawer.css";

export default function DrawerMenu() {
  const { user } = React.useContext(AuthContext);
  const rolAdmin = import.meta.env.VITE_ADMIN;
  const { setOpenDrawer, openDrawer } = React.useContext(DrawerContext);
  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 800, // Define md como 800px
        lg: 1200,
        xl: 1536,
      },
    },
  });
  const isMiddleMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [drawerWidth, setDrawerWidth] = React.useState(
    isMiddleMobile ? 75 : 240
  );

  React.useEffect(() => {
    if (openDrawer) {
      // Si el cajón está abierto, establece el ancho en 60
      setDrawerWidth(240);
    } else {
      // Si el cajón está cerrado, restablece el ancho a su valor original (240 o 60)
      setDrawerWidth(75);
    }
  }, [openDrawer, isMiddleMobile]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar
          sx={{ fontFamily: '"Kanit", sans-serif', backgroundColor: "#121621" }}
        >
          <img
            style={{ width: "200px" }}
            src="https://www.kaury.com/img/kaury_logo_19.svg"
            alt="logoKaury"
          />
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth, // Establece el ancho del Drawer
          flexShrink: 0,
          transition: "width 0.5s ease", // Agrega una transición suave al ancho del Drawer
          "& .MuiDrawer-paper": {
            width: drawerWidth, // Establece el ancho del papel del Drawer
            boxSizing: "border-box",
            backgroundColor: "#121621",
          },
        }}
        variant="permanent"
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Toolbar />
        {openDrawer && (
          <Button onClick={() => setOpenDrawer(false)}>
            <span
              style={{ margin: "1rem", color: "white" }}
              class="material-symbols-outlined"
            >
              arrow_back_ios
            </span>
          </Button>
        )}

        {!openDrawer && (
          <Button onClick={() => setOpenDrawer(true)}>
            <span class="material-symbols-outlined">arrow_forward_ios</span>
          </Button>
        )}

        <Divider />
        <List>
          {menuItems.map(({ id, path, title, Icon }) => (
            <ListItem style={{ color: "white" }} key={id} disablePadding>
              <ListItemButton component={Link} to={path}>
                {!openDrawer && (
                  <Tooltip title={title}>
                    <ListItemIcon>
                      <Icon sx={{ color: "white" }} />
                    </ListItemIcon>
                  </Tooltip>
                )}
                {openDrawer && (
                  <>
                    <ListItemIcon>
                      <Icon sx={{ color: "white" }} />
                    </ListItemIcon>
                    <h5
                      className="hover-effect"
                      style={{ fontFamily: '"Kanit", sans-serif' }}
                    >
                      {title}
                    </h5>
                  </>
                )}
              </ListItemButton>
            </ListItem>
          ))}
          {user.rol === rolAdmin && (
            <Link to={"/dashboard"}>
              <ListItem disablePadding>
                <ListItemButton>
                  {!openDrawer && (
                    <Tooltip title="Clientes">
                      <ListItemIcon>
                        <AccountCircleIcon sx={{ color: "white" }} />
                      </ListItemIcon>
                    </Tooltip>
                  )}
                  {openDrawer && (
                    <>
                      <ListItemIcon>
                        <AccountCircleIcon sx={{ color: "white" }} />
                      </ListItemIcon>
                      <h5
                        className="hover-effect"
                        style={{
                          fontFamily: '"Kanit", sans-serif',
                          color: "white",
                        }}
                      >
                        Clientes
                      </h5>
                    </>
                  )}
                </ListItemButton>
              </ListItem>
            </Link>
          )}
        </List>
        <Divider />

        <br />
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Toolbar />
      </Box>
    </Box>
  );
}
