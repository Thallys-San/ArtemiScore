import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "../components/layout/css/Perfil.css";
import Header from "../components/layout/Header";
import { Link } from "react-router-dom";
import AvatarDisplay, {
  DEFAULT_PROFILE_PIC,
} from "../components/commom/AvatarDisplay";
import { AuthContext } from "../components/AuthContext";
import HamsterLoading from "../components/commom/HamsterLoading";
import "../components/layout/css/HamsterLoading.css";
import JogosFavoritosPopup from "../components/layout/JogosFavoritosPopUp";
import JogosFavoritosLista from "../components/layout/JogosFavoritosLista";

function Perfil() {
  const { token, logout } = useContext(AuthContext); // Adicione logout ao contexto
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [jogosFavoritos, setJogosFavoritos] = useState([]);
  const [loadingFavoritos, setLoadingFavoritos] = useState(false);

  useEffect(() => {
    let isMounted = true; // Para evitar memory leaks

    const fetchPerfil = async () => {
      if (!token) {
        if (isMounted) {
          setError("Usuário não autenticado");
          setLoading(false);
        }
        return;
      }

      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }

        const response = await axios.get(
          "http://localhost:8080/api/usuarios/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (isMounted) {
          setPerfil(response.data);
        }
      } catch (err) {
        console.error("Erro ao carregar o perfil:", err);
        
        // Se for erro 401 (não autorizado), faz logout
        if (err.response?.status === 401) {
          logout();
        }

        if (isMounted) {
          setError(err.response?.data?.message || "Erro ao carregar os dados do perfil");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPerfil();

    return () => {
      isMounted = false; // Cleanup
    };
  }, [token, logout]);

  useEffect(() => {
    const fetchFavoritos = async () => {
      if (!token || !perfil) return; // Só carrega favoritos se o perfil existir

      try {
        setLoadingFavoritos(true);
        const response = await axios.get(
          "http://localhost:8080/api/usuarios/me/favoritos",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setJogosFavoritos(response.data);
      } catch (err) {
        console.error("Erro ao carregar favoritos:", err);
      } finally {
        setLoadingFavoritos(false);
      }
    };

    fetchFavoritos();
  }, [token, isPopupOpen, perfil]);

  if (loading)
    return (
      <div className="loading-container">
        <HamsterLoading />
      </div>
    );
  if (error) return <div className="error-message">{error}</div>;
  if (!perfil) return <div className="no-data">Nenhum dado disponível</div>;
  if (!perfil) return <div>Nenhum dado disponível</div>;

  // Ajuste manual da data:
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
      <div className="container-perfil">
        {/* Card principal com avatar e infos lado a lado */}
        <div className="card-perfil">
          <AvatarDisplay
            src={perfil.foto_perfil || DEFAULT_PROFILE_PIC}
            alt={perfil.nome}
            className="avatar-display"
          />
          <div className="informacoes-usuario">
            <h1 className="titulo">{perfil.nome || "Usuário"}</h1>
            <p className="bio">
              {perfil.bio || "Este usuário ainda não adicionou uma biografia."}
            </p>

            <div className="metadados">
              <div className="metadado-item">
                <i className="ri-calendar-line"></i>
                <span>Membro desde: {dataCriacaoFormatada}</span>
              </div>
            </div>

            <div className="botoes-acao">
              <Link to="/configuracoes" className="botao-perfil botao-primario">
                <i className="ri-edit-line"></i> Configurações
              </Link>
            </div>
          </div>
        </div>

        {/* Linha com preferências e plataformas */}
        <div className="linha-dupla">
          <div className="secao-perfil">
            <h2 className="titulo-secao">
              <i className="ri-computer-line"></i> Plataformas Utilizadas
            </h2>
            {perfil.plataformas_utilizadas?.length > 0 ? (
              <div className="plataformas-container">
                {perfil.plataformas_utilizadas.map((plataforma, index) => (
                  <div key={index} className="plataforma-item">
                    <i className="ri-checkbox-circle-line"></i>
                    <span>{plataforma}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="sem-conteudo">Nenhuma plataforma cadastrada.</p>
            )}
          </div>
          <div className="secao-perfil">
            <h2 className="titulo-secao">
              <i className="ri-gamepad-line"></i> Preferências de Jogos
            </h2>
            {perfil.preferencias_jogos?.length > 0 ? (
              <div className="tags-container">
                {perfil.preferencias_jogos.map((preferencia, index) => (
                  <span key={index} className="tag-preferencia">
                    {preferencia}
                  </span>
                ))}
              </div>
            ) : (
              <p className="sem-conteudo">Nenhuma preferência cadastrada.</p>
            )}
          </div>
        </div>

        <JogosFavoritosPopup
          isOpen={isPopupOpen}
          closeModal={() => setIsPopupOpen(false)}
          userId={perfil}
        />

        {/* Linha com estatísticas e jogos favoritos */}
        <div className="linha-dupla">
          <div className="secao-perfil">
            <h2 className="titulo-secao">
              <i className="ri-bar-chart-line"></i> Estatísticas
            </h2>
            <div className="estatisticas">
              <Link to={"/jogosAvaliados"} className="link-destaque">
                <div className="estatistica-item">
                  <div className="estatistica-valor">...</div>
                  <div className="estatistica-label">Jogos Avaliados</div>
                </div>
              </Link>

              <div className="estatistica-item">
                <div className="estatistica-valor">...</div>
                <div className="estatistica-label">Horas Jogadas</div>
              </div>
            </div>
          </div>

          <div className="secao-perfil">
            <div className="secao-header">
              <h2 className="titulo-secao">
                <i className="ri-heart-line"></i> Jogos Favoritos
              </h2>
              <button
                className="add-favorite-button"
                onClick={() => setIsPopupOpen(true)}
                aria-label="Adicionar jogos favoritos"
              >
                <i className="ri-add-line"></i>
              </button>
            </div>

            <JogosFavoritosLista jogosIds={jogosFavoritos} token={token} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Perfil;
