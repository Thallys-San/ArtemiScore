import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cadastro from "../pages/Cadastro";
import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import Jogos from "../pages/Jogos";
import Lancamentos from "../pages/Lancamentos";
import Perfil from "../pages/Perfil";
import Ranking from "../pages/Ranking";
import RecuperarSenha from "../pages/RecuperarSenha"
import ConfigScreen from "../pages/ConfigScreen";
import DetalheJogo from '../pages/DetalheJogo';
import PerfilOutroUsuario from "../pages/PerfilOutroUsuario";

const App = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/jogos" element={<Jogos />} />
      <Route path="/ranking" element={<Ranking />} />
      <Route path="/lancamentos" element={<Lancamentos />} /> 
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/perfil/:id" element={<PerfilOutroUsuario />} />
      <Route path="/recuperarsenha" element={<RecuperarSenha />} />
      {/* <Route path="/avaliacoes" element={<Avaliacoes />} /> */}
      {/* <Route path="/favoritos" element={<Favoritos />} /> */}
      <Route path="/configuracoes" element={<ConfigScreen />} />
      <Route path="/jogos/:id" element={<DetalheJogo />} />
      {/* <Route path="/logout" element={<Logout />} /> */}
    </Routes>
     {/* Toasts visíveis globalmente */}
      <ToastContainer position="top-right" autoClose={3000} />
      </>
  );
};

export default App;
