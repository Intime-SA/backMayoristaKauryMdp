import React, { useContext } from "react";
import { AuthContext } from "../components/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedUsers = () => {
  const { isLogged } = useContext(AuthContext);
  console.log(isLogged);

  return <>{isLogged ? <Outlet /> : <Navigate to="/login" />}</>;
};

export default ProtectedUsers;
