import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "../components/layout/css/Perfil.css";
import Header from "../components/layout/Header";
import { Link } from "react-router-dom";
import ProfilePicture from "../components/commom/ProfilePicture";
import { AuthContext } from "../components/AuthContext";

function Perfil() {
  const { token } = useContext(AuthContext);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Token atual:", token);
    const fetchPerfil = async () => {
      if (!token) {
        setError("Usuário não autenticado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get("http://localhost:8080/api/usuarios/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPerfil(response.data);
      } catch (err) {
        console.error("Erro ao carregar o perfil:", err);
        setError("Erro ao carregar os dados do perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, [token]);

  if (loading) return <div className="loading">Carregando perfil...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!perfil) return <div className="no-data">Nenhum dado disponível</div>;

  return (
    <>
      <Header />
      <div className="container-perfil">
        <div className="card-perfil">
          <ProfilePicture src={perfil.fotoPerfilUrl} alt={perfil.nome || "Foto do usuário"} />
          <div className="informacoes-usuario">
            <h1 className="titulo">{perfil.nome || "Usuário"}</h1>
            <p className="bio">{perfil.bio || "Adicione uma bio"}</p>
          </div>
        </div>

        {/* Outros cards (estatísticas, avaliações, etc) aqui */}
      </div>
    </>
  );
}

export default Perfil;
