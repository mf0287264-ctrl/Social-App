import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { contToken } from "../../../Context/ContextToken";

export default function ProtectedRoutes({ children }) {
  const { token } = useContext(contToken);
  if (!token) {
    return <Navigate to={"/login"} />;
  }
  return <>{children}</>;
}
