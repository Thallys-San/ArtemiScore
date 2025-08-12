import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import GameCard from "../components/cards/GameCard";
import { AuthContext } from "../components/AuthContext";
import HamsterLoading from "../components/commom/HamsterLoading";
import "../components/layout/css/HamsterLoading.css";
import "../style.css";

const JogosAvaliados = () => {
  const { token } = useContext(AuthContext);
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

        // Busca os jogos avaliados
        const [gamesResponse, statsResponse] = await Promise.all([
          axios.get("http://localhost:8080/api/avaliacoes/meus-jogos", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:8080/api/avaliacoes/minhas-estatisticas", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setGames(gamesResponse.data);
        setStats({
          totalAvaliados: statsResponse.data.totalAvaliacoes,
          mediaAvaliacao: statsResponse.data.mediaAvaliacoes
        });
      } catch (err) {
        console.error("Erro ao carregar jogos avaliados:", err);
        setError("Erro ao carregar seus jogos avaliados");
      } finally {
        setLoading(false);
      }
    };

    fetchRatedGames();
  }, [token]);

  if (loading) {
    return (
      <div className="loading-container">
        <HamsterLoading />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="main-content">
          <div className="error-message">{error}</div>
        </main>
        <Footer />
      </>
    );
  }

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
                <div className="estatistica-valor">
                  {stats.mediaAvaliacao.toFixed(1)}/5
                </div>
                <div className="estatistica-label">Média de Avaliação</div>
              </div>
            </div>

            {/* Lista de jogos */}
            {games.length > 0 ? (
              <div className="games-grid">
                {games.map((jogo) => (
                  <GameCard 
                    key={jogo.id} 
                    jogo={jogo}
                    showUserRating={true}
                    userRating={jogo.nota} // Supondo que a API retorna a nota dada pelo usuário
                    ratingDate={jogo.dataAvaliacao} // Data da avaliação
                  />
                ))}
              </div>
            ) : (
              <div className="sem-jogos">
                <p>Você ainda não avaliou nenhum jogo.</p>
                <Link to="/jogos" className="botao-primario">
                  Explorar Jogos
                </Link>
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