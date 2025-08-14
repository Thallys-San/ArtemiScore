import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import AvatarDisplay, { DEFAULT_PROFILE_PIC } from "../components/commom/AvatarDisplay";
import HamsterLoading from "../components/commom/HamsterLoading";
import "../components/layout/css/Perfil.css";

function PerfilOutroUsuario() {
  const { id } = useParams();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalAvaliados, setTotalAvaliados] = useState(0);
  const [horasJogadas, setHorasJogadas] = useState(0);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/usuarios/${id}`);
        setPerfil(response.data);
      } catch (err) {
        setError("Não foi possível carregar o perfil.");
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, [id]);

  // Fetch total de jogos avaliados
  useEffect(() => {
    if (!perfil?.id) return;

    const fetchTotalAvaliados = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/avaliacoes/usuario/${perfil.id}`,
        );
        setTotalAvaliados(response.data.length);
      } catch (err) {
        console.error("Erro ao buscar total de avaliações:", err);
      }
    };

    fetchTotalAvaliados();
  }, [perfil]);

  // Fetch total de horas jogadas
  useEffect(() => {
    if (!perfil?.id) return;

    const fetchHorasJogadas = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/avaliacoes/usuario/${perfil.id}/horas`
        );
        setHorasJogadas(response.data);
      } catch (err) {
        console.error("Erro ao buscar horas jogadas:", err);
      }
    };

    fetchHorasJogadas();
  }, [perfil]);

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
      <div className="container-perfil">
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

        {/* Linha com estatísticas e jogos favoritos */}
        <div className="linha-dupla">
          <div className="secao-perfil">
            <h2 className="titulo-secao">
              <i className="ri-bar-chart-line"></i> Estatísticas
            </h2>
            <div className="estatisticas">
              <div className="estatistica-item">
                <div className="estatistica-valor">{totalAvaliados}</div>
                <div className="estatistica-label">Jogos Avaliados</div>
              </div>
              <div className="estatistica-item">
                <div className="estatistica-valor">{horasJogadas}</div>
                <div className="estatistica-label">Horas Jogadas</div>
              </div>
            </div>
          </div>

          <div className="secao-perfil">
            <h2 className="titulo-secao">
              <i className="ri-heart-line"></i> Jogos Favoritos
            </h2>
            <p className="sem-conteudo">Nenhum jogo favorito adicionado ainda.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default PerfilOutroUsuario;
