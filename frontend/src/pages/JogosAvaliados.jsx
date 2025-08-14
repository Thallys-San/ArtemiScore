import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import GameCard from "../components/cards/GameCard";
import { AuthContext } from "../components/AuthContext";
import HamsterLoading from "../components/commom/HamsterLoading";
import "../components/layout/css/HamsterLoading.css";
import "../style.css";

const JogosAvaliados = () => {
  const { token, logout } = useContext(AuthContext);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalAvaliados: 0,
    mediaAvaliacao: 0
  });

  useEffect(() => {
    const fetchRatedGames = async () => {
      if (!token) {
        setError("Usuário não autenticado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Busca todas as avaliações do usuário
        const response = await axios.get(
          "http://localhost:8080/avaliacoes/meus-jogos",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const avaliacoes = response.data;

        const totalAvaliados = avaliacoes.length;
        const somaNotas = avaliacoes.reduce((acc, a) => acc + a.nota, 0);
        const mediaAvaliacao = totalAvaliados > 0 ? somaNotas / totalAvaliados : 0;

        // Busca detalhes completos de cada jogo
        const jogosComDados = await Promise.all(
          avaliacoes.map(async (av) => {
            const res = await fetch(`http://localhost:8080/api/games/${av.jogo_id}`);
            const gameData = await res.json();
            return {
              ...gameData,
              mediaAvaliacao: av.nota,
              dataAvaliacao: av.dataAvaliacao,
              avaliacaoId: av.id // para poder deletar
            };
          })
        );

        setGames(jogosComDados);
        setStats({ totalAvaliados, mediaAvaliacao });
      } catch (err) {
        console.error("Erro ao carregar jogos avaliados:", err);
        if (err.response?.status === 401) logout();
        setError("Erro ao carregar seus jogos avaliados");
      } finally {
        setLoading(false);
      }
    };

    fetchRatedGames();
  }, [token, logout]);

  const handleExcluirAvaliacao = async (avaliacaoId) => {
    if (!window.confirm("Tem certeza que deseja excluir sua avaliação?")) return;

    try {
      await axios.delete(
        `http://localhost:8080/avaliacoes/${avaliacaoId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Remove do estado local
      const novasAvaliacoes = games.filter(g => g.avaliacaoId !== avaliacaoId);
      setGames(novasAvaliacoes);

      // Atualiza estatísticas
      const totalAvaliados = novasAvaliacoes.length;
      const somaNotas = novasAvaliacoes.reduce((acc, a) => acc + a.mediaAvaliacao, 0);
      const mediaAvaliacao = totalAvaliados > 0 ? somaNotas / totalAvaliados : 0;
      setStats({ totalAvaliados, mediaAvaliacao });

      toast.success("Avaliação excluída com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir avaliação:", err);
      toast.error("Não foi possível excluir a avaliação.");
    }
  };

  if (loading) return <div className="loading-container"><HamsterLoading /></div>;

  return (
    <>
      <Header />
      <main className="main-content">
        <section className="popular-games">
          <div className="container">
            <h1 className="page-title">Meus Jogos Avaliados</h1>

            {/* Estatísticas */}
            <div className="estatisticas-avaliacoes">
              <div className="estatistica-item">
                <div className="estatistica-valor">{stats.totalAvaliados}</div>
                <div className="estatistica-label">Jogos Avaliados</div>
              </div>
              <div className="estatistica-item">
                <div className="estatistica-valor">{stats.mediaAvaliacao.toFixed(1)}/5</div>
                <div className="estatistica-label">Média de Avaliação</div>
              </div>
            </div>

            {/* Lista de jogos */}
            {games.length > 0 ? (
              <div className="games-grid">
                {games.map(jogo => (
                  <div key={jogo.id} className="game-card-wrapper">
                    <GameCard jogo={jogo} />

                    <button
                      className="botao-excluir"
                      onClick={() => handleExcluirAvaliacao(jogo.avaliacaoId)}
                    >
                      Excluir Avaliação
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="sem-jogos">
                <p>Você ainda não avaliou nenhum jogo.</p>
                <Link to="/jogos" className="botao-primario">Explorar Jogos</Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default JogosAvaliados;
