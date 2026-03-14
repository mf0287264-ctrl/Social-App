import React, { createContext, useState } from "react";
export const contextId = createContext();
export default function Contextid({ children }) {
  const [logedInUser, setLogedInUser] = useState(
    localStorage.getItem("logedInUser"),
  );
  return (
    <>
      <contextId.Provider value={{ logedInUser, setLogedInUser }}>
        {children}
      </contextId.Provider>
    </>
  );
}
