import React, { createContext, useState } from "react";
export let contToken = createContext();
export default function ContextToken({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <>
      <contToken.Provider value={{ setToken, token }}>
        {children}
      </contToken.Provider>
    </>
  );
}
