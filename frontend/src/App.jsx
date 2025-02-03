import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Files from "./pages/Files";
import PrivateRoute from "./components/PrivateRoute";
import Folder from "./pages/Folder";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/register" element={<Signup />} />
        <Route element={<PrivateRoute />}>
          <Route path="/files" element={<Files />} />
          <Route path="/files/:id" element={<Folder />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
