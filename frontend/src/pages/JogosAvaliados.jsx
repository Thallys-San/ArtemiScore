import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import GameCard from "../components/cards/GameCard";
import { AuthContext } from "../components/AuthContext";
import HamsterLoading from "../components/commom/HamsterLoading";
import "../components/layout/css/HamsterLoading.css";
import "../style.css";

const JogosAvaliados = () => {
  const { token, logout, uid: myUid } = useContext(AuthContext); // uid do usuário logado
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ totalAvaliados: 0, mediaAvaliacao: 0 });
  const { uid } = useParams(); // se tiver uid, estamos vendo outro usuário

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

        const url = uid
          ? `http://localhost:8080/avaliacoes/usuario/uid/${uid}`
          : "http://localhost:8080/avaliacoes/meus-jogos";

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const avaliacoes = response.data || [];

        const totalAvaliados = avaliacoes.length;
        const somaNotas = avaliacoes.reduce((acc, a) => acc + a.nota, 0);
        const mediaAvaliacao = totalAvaliados > 0 ? somaNotas / totalAvaliados : 0;

        const jogosComDados = await Promise.all(
          avaliacoes.map(async (av) => {
            const res = await fetch(`http://localhost:8080/api/games/${av.jogo_id}`);
            const gameData = await res.json();
            return {
              ...gameData,
              mediaAvaliacao: av.nota,
              dataAvaliacao: av.dataAvaliacao,
              avaliacaoId: av.id, // salva o id da avaliação para exclusão
            };
          })
        );

        setGames(jogosComDados);
        setStats({ totalAvaliados, mediaAvaliacao });
      } catch (err) {
        console.error("Erro ao carregar jogos avaliados:", err);
        if (err.response?.status === 401) logout();
        setError("Erro ao carregar os jogos avaliados.");
      } finally {
        setLoading(false);
      }
    };

    fetchRatedGames();
  }, [token, logout, uid]);

  const handleDelete = async (avaliacaoId) => {
    if (!window.confirm("Tem certeza que deseja excluir esta avaliação?")) return;

    try {
      await axios.delete(`http://localhost:8080/avaliacoes/${avaliacaoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Atualiza a lista local e as estatísticas
      setGames((prev) => prev.filter((g) => g.avaliacaoId !== avaliacaoId));
      setStats((prev) => ({
        ...prev,
        totalAvaliados: prev.totalAvaliados - 1,
      }));
    } catch (err) {
      console.error("Erro ao excluir avaliação:", err);
      alert("Não foi possível excluir a avaliação.");
    }
  };

  if (loading) return <div className="loading-container"><HamsterLoading /></div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      <Header />
      <main className="main-content">
        <section className="popular-games">
          <div className="container">
            <h1 className="page-title">
              {uid ? "Jogos Avaliados do Usuário" : "Meus Jogos Avaliados"}
            </h1>

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
                {games.map((jogo) => (
                  <div key={jogo.id} className="game-card-wrapper">
                    <GameCard jogo={jogo} />

                    {/* Botão de excluir só aparece para o usuário logado */}
                    {(!uid || uid === myUid) && (
                      <button
                        className="btn-excluir"
                        onClick={() => handleDelete(jogo.avaliacaoId)}
                      >
                        Excluir
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="sem-jogos">
                <p>Nenhum jogo avaliado ainda.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default JogosAvaliados;
