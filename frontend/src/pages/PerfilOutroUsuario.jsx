import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import AvatarDisplay, { DEFAULT_PROFILE_PIC } from "../components/commom/AvatarDisplay";
import HamsterLoading from "../components/commom/HamsterLoading";
import "../components/layout/css/Perfil.css";
import JogosFavoritosLista from "../components/layout/JogosFavoritosLista";
import { auth } from "../components/firebase";
import { getIdToken } from "firebase/auth";

function PerfilOutroUsuario() {
  const { uid } = useParams();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jogosFavoritos, setJogosFavoritos] = useState([]);
  const [token, setToken] = useState(null);

  // Primeiro pega o token do Firebase
  useEffect(() => {
    const fetchToken = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const idToken = await getIdToken(user);
          setToken(idToken);
        } catch (err) {
          console.error("Erro ao obter token do Firebase:", err);
        }
      }
    };
    fetchToken();
  }, []);

  // Depois que o token estiver disponível, busca os dados do usuário
  useEffect(() => {
    if (!token) return; // Espera o token estar definido

    const fetchPerfil = async () => {
      setLoading(true);
      try {
        // Perfil do usuário
        const resPerfil = await axios.get(
          `http://localhost:8080/api/usuarios/uid/${uid}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPerfil(resPerfil.data);

        // Jogos favoritos
        const resFavoritos = await axios.get(
          `http://localhost:8080/api/usuarios/${uid}/favoritos`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setJogosFavoritos(resFavoritos.data);
      } catch (err) {
        console.error("Erro ao carregar perfil do usuário:", err);
        setError("Erro ao carregar perfil do usuário");
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, [uid, token]);

  if (loading) return <HamsterLoading />;
  if (error) return <div className="error-message">{error}</div>;
  if (!perfil) return <div className="no-data">Nenhum dado disponível</div>;

  const [year, month, day] = perfil.data_criacao.split("-");
  const dataCriacao = new Date(year, month - 1, day);
  const dataCriacaoFormatada = dataCriacao.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Header />
      <div className="container-perfil" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="card-perfil" style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <div style={{ flex: '0 0 auto', marginRight: '40px' }}>
            <AvatarDisplay
              src={perfil.foto_perfil || DEFAULT_PROFILE_PIC}
              alt={perfil.nome}
              className="avatar-display"
              style={{ marginLeft: '0' }}
            />
          </div>
          <div className="informacoes-usuario" style={{ flex: 1 }}>
            <h1 className="titulo">{perfil.nome || "Usuário"}</h1>
            <p className="bio">{perfil.bio || "Este usuário ainda não adicionou uma biografia."}</p>
            <div className="metadados">
              <div className="metadado-item">
                <i className="ri-calendar-line"></i>
                <span>Membro desde: {dataCriacaoFormatada}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="secoes-combinadas">
          <div className="secao-perfil" style={{ flex: 1 }}>
            <h2 className="titulo-secao"><i className="ri-computer-line"></i> Plataformas Utilizadas</h2>
            {perfil.plataformas_utilizadas?.length > 0 ? (
              <div className="plataformas-container">
                {perfil.plataformas_utilizadas.map((plataforma, index) => (
                  <div key={index} className="plataforma-item">
                    <i className="ri-checkbox-circle-line"></i>
                    <span>{plataforma}</span>
                  </div>
                ))}
              </div>
            ) : <p className="sem-conteudo">Nenhuma plataforma cadastrada.</p>}
          </div>

          <div className="secao-perfil" style={{ flex: 1 }}>
            <h2 className="titulo-secao"><i className="ri-gamepad-line"></i> Preferências de Jogos</h2>
            {perfil.preferencias_jogos?.length > 0 ? (
              <div className="tags-container">
                {perfil.preferencias_jogos.map((preferencia, index) => (
                  <span key={index} className="tag-preferencia">{preferencia}</span>
                ))}
              </div>
            ) : <p className="sem-conteudo">Nenhuma preferência cadastrada.</p>}
          </div>
        </div>

        <div className="secoes-combinadas">
          <div className="secao-perfil" style={{ flex: 1 }}>
            <h2 className="titulo-secao"><i className="ri-bar-chart-line"></i> Estatísticas</h2>
            <div className="estatisticas">
              <div className="estatistica-item">
                <div className="estatistica-valor">...</div>
                <div className="estatistica-label">Jogos Avaliados</div>
              </div>
              <div className="estatistica-item">
                <div className="estatistica-valor">...</div>
                <div className="estatistica-label">Horas Jogadas</div>
              </div>
            </div>
          </div>

          <div className="secao-perfil" style={{ flex: 1 }}>
            <h2 className="titulo-secao"><i className="ri-heart-line"></i> Jogos Favoritos</h2>
            <JogosFavoritosLista jogosIds={jogosFavoritos} token={token} />
          </div>
        </div>
      </div>
    </>
  );
}

export default PerfilOutroUsuario;
