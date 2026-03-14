import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";

export default function Layout() {
  const [userImage, setUserImage] = useState(localStorage.getItem("userImage"));
  const [userName, setUserName] = useState(localStorage.getItem("userName"));
  return (
    <div>
      <NavBar userImage={userImage} />
      <div className="bg-slate-200  py-20">
        <Outlet context={{ setUserImage, userImage, userName, setUserName }} />
      </div>
      <Footer />
    </div>
  );
}
