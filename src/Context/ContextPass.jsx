import React, { createContext, useState } from "react";
export const contextPass = createContext();
export default function ContextPass({ children }) {
  const [userPass, setUserPass] = useState(localStorage.getItem("userPass"));
  return (
    <contextPass.Provider value={{ userPass, setUserPass }}>
      {children}
    </contextPass.Provider>
  );
}
