import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-16 flex-grow">{children}</div>
    </div>
  );
};

export default Layout;
