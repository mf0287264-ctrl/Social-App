import React, { useContext } from "react";
import { contToken } from "../../Context/ContextToken";
import { Navigate } from "react-router-dom";

export default function AuthRoute({ children }) {
  const { token } = useContext(contToken);
  if (token) {
    return <Navigate to={"/home"}></Navigate>;
  }
  return <>{children}</>;
}
