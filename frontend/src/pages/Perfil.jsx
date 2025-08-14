import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "../components/layout/css/Perfil.css";
import Header from "../components/layout/Header";
import { Link } from "react-router-dom";
import AvatarDisplay, { DEFAULT_PROFILE_PIC } from "../components/commom/AvatarDisplay";
import { AuthContext } from "../components/AuthContext";
import HamsterLoading from "../components/commom/HamsterLoading";
import "../components/layout/css/HamsterLoading.css";
import JogosFavoritosPopup from "../components/layout/JogosFavoritosPopUp";
import JogosFavoritosLista from "../components/layout/JogosFavoritosLista";

function Perfil() {
  const { token, logout } = useContext(AuthContext);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [jogosFavoritos, setJogosFavoritos] = useState([]);
  const [loadingFavoritos, setLoadingFavoritos] = useState(false);
  const [totalAvaliados, setTotalAvaliados] = useState(0);
  const [horasJogadas, setHorasJogadas] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchPerfil = async () => {
      if (!token) {
        if (isMounted) {
          setError("Usuário não autenticado");
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          "http://localhost:8080/api/usuarios/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (isMounted) setPerfil(response.data);
      } catch (err) {
        console.error("Erro ao carregar o perfil:", err);
        if (err.response?.status === 401) logout();
        if (isMounted)
          setError(err.response?.data?.message || "Erro ao carregar os dados do perfil");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPerfil();
    return () => { isMounted = false; };
  }, [token, logout]);

  useEffect(() => {
    const fetchTotalAvaliados = async () => {
      if (!token) return;

      try {
        const response = await axios.get(
          "http://localhost:8080/avaliacoes/meus-jogos",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTotalAvaliados(response.data.length);
      } catch (err) {
        console.error("Erro ao buscar total de avaliações:", err);
      }
    };

    fetchTotalAvaliados();
  }, [token]);

  // Buscar horas jogadas
useEffect(() => {
  if (!token || !perfil) return;

  const fetchHorasJogadas = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/usuarios/${perfil.id}/horas`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Horas recebidas:", response.data);
      setHorasJogadas(response.data || 0);
    } catch (err) {
      console.error("Erro ao buscar horas jogadas:", err.response || err);
    }
  };

  fetchHorasJogadas();
}, [token, perfil]);



  useEffect(() => {
    const fetchFavoritos = async () => {
      if (!token || !perfil) return;

      try {
        setLoadingFavoritos(true);
        const response = await axios.get(
          "http://localhost:8080/api/usuarios/me/favoritos",
          { headers: { Authorization: `Bearer ${token}` } }
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

  if (loading) return <div className="loading-container"><HamsterLoading /></div>;
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
      <div className="container-perfil">
        <div className="card-perfil">
          <AvatarDisplay
            src={perfil.foto_perfil || DEFAULT_PROFILE_PIC}
            alt={perfil.nome}
            className="avatar-display"
          />
          <div className="informacoes-usuario">
            <h1 className="titulo">{perfil.nome || "Usuário"}</h1>
            <p className="bio">{perfil.bio || "Este usuário ainda não adicionou uma biografia."}</p>
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

        <div className="linha-dupla">
          <div className="secao-perfil">
            <h2 className="titulo-secao"><i className="ri-computer-line"></i> Plataformas Utilizadas</h2>
            {perfil.plataformas_utilizadas?.length > 0 ? (
              <div className="plataformas-container">
                {perfil.plataformas_utilizadas.map((pl, index) => (
                  <div key={index} className="plataforma-item">
                    <i className="ri-checkbox-circle-line"></i>
                    <span>{pl}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="sem-conteudo">Nenhuma plataforma cadastrada.</p>
            )}
          </div>

          <div className="secao-perfil">
            <h2 className="titulo-secao"><i className="ri-gamepad-line"></i> Preferências de Jogos</h2>
            {perfil.preferencias_jogos?.length > 0 ? (
              <div className="tags-container">
                {perfil.preferencias_jogos.map((pref, index) => (
                  <span key={index} className="tag-preferencia">{pref}</span>
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

        <div className="linha-dupla">
          <div className="secao-perfil">
            <h2 className="titulo-secao"><i className="ri-bar-chart-line"></i> Estatísticas</h2>
            <div className="estatisticas">
              <Link to={"/jogosAvaliados"} className="link-destaque">
                <div className="estatistica-item">
                  <div className="estatistica-valor">{totalAvaliados}</div>
                  <div className="estatistica-label">Jogos Avaliados</div>
                </div>
              </Link>

              <div className="estatistica-item">
                <div className="estatistica-valor">{horasJogadas}</div>
                <div className="estatistica-label">Horas Jogadas</div>
              </div>
            </div>
          </div>

          <div className="secao-perfil">
            <div className="secao-header">
              <h2 className="titulo-secao"><i className="ri-heart-line"></i> Jogos Favoritos</h2>
              <button className="add-favorite-button" onClick={() => setIsPopupOpen(true)} aria-label="Adicionar jogos favoritos">
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
