import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Usuario = () => {
  const { user, isLogged, handleLogoutContext } = useContext(AuthContext);
  const firstLetter = user?.email ? user.email.charAt(0).toUpperCase() : "";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const rolAdmin = import.meta.env.VITE_ADMIN;
  const rolAdminTotal = import.meta.env.VITE_ADMINTOTAL;
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [logoutMessage, setLogoutMessage] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    if (open) {
      handleClose();
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderAdmin = (rol) => {
    if (rol === rolAdminTotal) {
      return "Administrador";
    } else if (rol === "usuario") return "Reservador";
    else return "Anonimo";
  };

  const cerrarSesion = () => {
    handleLogoutContext();
    window.location.reload();
    navigate("/");
  };

  return (
    <div
      style={{
        textAlign: "right",
        width: "100%",
        padding: "1rem",
        fontFamily: '"Kanit", sans-serif',
        fontWeight: 900,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isLogged && (
        <>
          {!isMobile && (
            <div style={{}}>
              <h6
                style={{
                  fontWeight: 100,
                  fontFamily: '"Kanit", sans-serif',
                  fontSize: "130%",
                }}
              >
                {" "}
                <strong
                  style={{ fontFamily: '"Kanit", sans-serif', fontWeight: 100 }}
                >
                  {renderAdmin(user.rol)}
                </strong>
              </h6>

              <h4
                style={{
                  fontWeight: 100,
                  fontFamily: '"Kanit", sans-serif',
                  fontSize: "80%",
                }}
              >
                {user.email}
              </h4>
            </div>
          )}

          <div>
            <Link
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <Avatar sx={{ bgcolor: "rgb(237, 97, 113)", margin: "1rem" }}>
                {user.email.charAt(0).toUpperCase()}
              </Avatar>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem>
                  <Link
                    style={{
                      fontFamily: '"Kanit", sans-serif',
                      display: "flex",
                      alignItems: "center",
                    }}
                    to="/cuenta"
                  >
                    <IconButton sx={{ color: "#FFFFFF" }}>
                      <AccountCircleIcon
                        sx={{ fontSize: "1.3rem", color: "black" }}
                      />
                    </IconButton>
                    Perfil
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link style={{ fontFamily: '"Kanit", sans-serif' }}>
                    <IconButton
                      onClick={cerrarSesion}
                      sx={{ color: "#FFFFFF" }}
                    >
                      <LogoutIcon sx={{ fontSize: "1.3rem", color: "black" }} />
                    </IconButton>
                    Cerrar sesión
                  </Link>
                </MenuItem>
              </Menu>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Usuario;
