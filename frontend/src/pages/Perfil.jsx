import React, { useEffect, useState } from "react";
import axios from "axios";
import "../components/layout/css/Perfil.css";
import Header from "../components/layout/Header";
import { Link } from "react-router-dom";
import ProfilePicture from "../components/commom/ProfilePicture";

const Perfil = () => {
  // Estado que armazena os dados do usuário
  const [usuario, setUsuario] = useState(null);

  // Estado para controlar o carregamento
  const [carregando, setCarregando] = useState(true);

  const [profilePic, setProfilePic] = useState("");
  // useEffect roda assim que o componente for montado
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        // Recupera o token JWT salvo no login
        const token = localStorage.getItem("token");

        // Faz a requisição GET para buscar o perfil do usuário logado
        const response = await axios.get(
          "http://localhost:8080/api/usuarios/me",
          {
            headers: { Authorization: `Bearer ${token}` }, // Envia o token no cabeçalho
          }
        );

        // Salva os dados do usuário no estado
        setUsuario(response.data);
        setProfilePic(response.data.foto_perfil)
      } catch (error) {
        // Mostra erro no console, caso ocorra
        console.error("Erro ao carregar o perfil: ", error);
      } finally {
        // Marca que terminou o carregamento
        setCarregando(false);
      }
    };

    // Chama a função que busca os dados
    fetchPerfil();
  }, []); // Array vazio significa que executa só 1 vez ao montar

  // Se ainda estiver carregando, mostra mensagem de loading
  if (carregando) return <p>Carregando perfil...</p>;

  // Se não houver dados de usuário (erro), exibe erro
  if (!usuario) return <p>Erro ao carregar perfil.</p>;

  return (
    <main className="profile">
      {/* Cabeçalho do perfil */}
      <Header></Header>

      <div>
        <ProfilePicture src={usuario.foto_perfil} />
      </div>

      {/* Informações principais do usuário */}
      <div className="profile-info">
        <h2>{usuario.nome}</h2>
        <p className="data">
          Membro desde{" "}
          {new Date(usuario.dataCadastro).toLocaleDateString("pt-BR")}
        </p>
        <p>{usuario.bio || "Sem descrição pessoal."}</p>
        <button className="edit">Editar Perfil</button>
        <button className="share">+ Compartilhar</button>
      </div>

      {/* Métricas: avaliações e likes */}
      <section className="metrics">
        <div className="card">
          Avaliações: <strong>{usuario.totalAvaliacoes}</strong>
        </div>
        <div className="card">
          Likes recebidos: <strong>{usuario.totalLikes}</strong>
        </div>
      </section>

      {/* Avaliações recentes do usuário */}
      <section className="reviews">
        <h3>Avaliações Recentes</h3>
        {usuario.avaliacoes?.map((avaliacao, index) => (
          <div key={index} className="review">
            <h4>
              {avaliacao.jogo} <span>{avaliacao.nota}</span>
            </h4>
            <p>{avaliacao.comentario}</p>
          </div>
        ))}
      </section>

      {/* Informações adicionais: preferências, plataformas e conquistas */}
      <aside className="sidebar">
        {/* Preferências de gênero */}
        <div className="prefs">
          <h4>Preferências de Jogos</h4>
          <ul>
            {usuario.preferencias?.map((pref, index) => (
              <li key={index}>{pref}</li>
            ))}
          </ul>
        </div>

        {/* Plataformas mais usadas */}
        <div className="platforms">
          <h4>Plataformas mais Utilizadas</h4>
          <p>{usuario.plataformas?.join(", ")}</p>
        </div>

      </aside>
    </main>
  );
};

export default Perfil;
