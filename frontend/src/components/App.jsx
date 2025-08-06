import React from "react";
import { Routes, Route } from "react-router-dom";
import Cadastro from "../pages/Cadastro";
import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import Jogos from "../pages/Jogos";
import Lancamentos from "../pages/Lancamentos";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/jogos" element={<Jogos />} />
      <Route path="/Lancamentos" element={<Lancamentos />} />
      


    </Routes>
  );
};

export default App;
