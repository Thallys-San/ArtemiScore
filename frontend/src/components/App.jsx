import React from "react";
import { Routes, Route } from "react-router-dom";
import Cadastro from "../pages/Cadastro";
import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import Jogos from "../pages/Jogos";
import Lancamentos from "../pages/Lancamentos";
import Perfil from "../pages/Perfil";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/jogos" element={<Jogos />} />
      {/* <Route path="/ranking" element={<Ranking />} /> */}
      {/* <Route path="/lancamentos" element={<Lancamentos />} /> */}
      <Route path="/perfil" element={<Perfil />} />
      {/* <Route path="/avaliacoes" element={<Avaliacoes />} /> */}
      {/* <Route path="/favoritos" element={<Favoritos />} /> */}
      {/* <Route path="/configuracoes" element={<Configuracoes />} /> */}
      {/* <Route path="/logout" element={<Logout />} /> */}
      <Route path="/Lancamentos" element={<Lancamentos />} />
    </Routes>
  );
};

export default App;
