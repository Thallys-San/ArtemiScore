// src/components/RankingSection.jsx
import React, { useState, useEffect } from 'react';

const Ranking = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Simulando chamada à API
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        // Aqui você colocará: const res = await fetch('https://suaapi.com/ranking');
        // const data = await res.json();

        // Simulação de delay + resposta vazia (API real virá depois)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Dados da API virão aqui. Por enquanto, deixamos vazio ou mockamos se precisar
        const apiData = []; // ← deixe vazio ou use [] para simular "sem dados"

        setGames(apiData);
      } catch (err) {
        setError('Erro ao carregar ranking. Tente novamente mais tarde.');
        setGames([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleSort = (key) => {
    if (!games.length) return;

    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...games].sort((a, b) => {
      if (key === 'pos') {
        return direction === 'asc' ? a.pos - b.pos : b.pos - a.pos;
      } else if (key === 'rating') {
        return direction === 'asc' ? a.rating - b.rating : b.rating - a.rating;
      }
      return 0;
    });
    setGames(sorted);
  };

  if (loading) {
    return (
      <section className="ranking-section">
        <div className="container">
          <div className="ranking-header">
            <h1>Ranking de Jogos</h1>
            <p>Carregando os melhores jogos da comunidade...</p>
          </div>
          <div className="ranking-container">
            <p style={{ textAlign: 'center', padding: '2rem', color: '#c688ff' }}>
              🎮 Carregando...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="ranking-section">
        <div className="container">
          <div className="ranking-header">
            <h1>Ranking de Jogos</h1>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="ranking-section">
      <div className="container">
        <div className="ranking-header">
          <h1>Ranking de Jogos</h1>
          <p>Descubra os jogos mais bem avaliados pela comunidade ArtemiScore. Este ranking é atualizado diariamente com base nas avaliações de milhares de jogadores.</p>
        </div>

        <div className="ranking-controls">
          <div className="filter-group">
            <span className="filter-label">Filtrar por:</span>
            <select className="filter-select" disabled={loading}>
              <option>Todos os Gêneros</option>
              {/* Será preenchido pela API depois */}
            </select>
            <select className="filter-select" disabled={loading}>
              <option>Todas as Plataformas</option>
              {/* Será preenchido pela API depois */}
            </select>
            <select className="filter-select" disabled={loading}>
              <option>Ordenar por: Melhor Avaliação</option>
              <option>Mais Avaliados</option>
              <option>Lançamento Recente</option>
              <option>Popularidade</option>
            </select>
          </div>
          <div className="search-control">
            <input type="text" placeholder="Buscar jogo..." disabled={loading} />
            <div className="search-icon">
              <i className="ri-search-line"></i>
            </div>
          </div>
        </div>

        <div className="ranking-container">
          {games.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#6d6d7a' }}>
              Nenhum jogo encontrado no ranking.
            </p>
          ) : (
            <>
              <table className="ranking-table">
                <thead>
                  <tr>
                    <th className="sortable" onClick={() => handleSort('pos')}>
                      Posição <i className="ri-arrow-up-down-line"></i>
                    </th>
                    <th>Jogo</th>
                    <th>Plataformas</th>
                    <th className="sortable" onClick={() => handleSort('rating')}>
                      Avaliação <i className="ri-arrow-up-down-line"></i>
                    </th>
                    <th>Tendência</th>
                  </tr>
                </thead>
                <tbody>
                  {games.map((game) => (
                    <tr key={game.pos || game.id} className={game.pos <= 3 ? `position-${game.pos}` : ''}>
                      <td className="position-cell">{game.pos}</td>
                      <td>
                        <div className="game-info">
                          <img
                            src={game.image || 'https://via.placeholder.com/70'}
                            alt={game.name}
                            className="game-image"
                            onError={(e) => (e.target.src = 'https://via.placeholder.com/70/1e1e24/ffffff?text=Game')}
                          />
                          <div className="game-details">
                            <div className="game-title">{game.name}</div>
                            <div className="game-genre">{game.genre}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="platforms">
                          {game.platforms?.map((platform) => (
                            <span key={platform} className="platform-tag">
                              {platform}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="rating-cell">
                          <div className="stars">
                            {[...Array(5)].map((_, i) => {
                              const rating = game.rating || 0;
                              return (
                                <i
                                  key={i}
                                  className={
                                    i < Math.floor(rating)
                                      ? "ri-star-fill"
                                      : i === Math.floor(rating) && rating % 1 !== 0
                                      ? "ri-star-half-fill"
                                      : "ri-star-line"
                                  }
                                ></i>
                              );
                            })}
                          </div>
                          <div>
                            <div className="rating-value">{game.rating?.toFixed(1)}</div>
                            <div className="reviews-count">({game.reviews_count} avaliações)</div>
                          </div>
                        </div>
                      </td>
                      <td className={`trend ${game.trend}`}>
                        <i className={
                          game.trend === 'up' ? 'ri-arrow-up-line' :
                          game.trend === 'down' ? 'ri-arrow-down-line' :
                          'ri-arrow-right-line'
                        }></i> {game.trend_text || 'Estável'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pagination">
                <div className="page-item disabled"><i className="ri-arrow-left-s-line"></i></div>
                <div className="page-item active">1</div>
                <div className="page-item">2</div>
                <div className="page-item">3</div>
                <div className="page-item">4</div>
                <div className="page-item">5</div>
                <div className="page-item"><i className="ri-arrow-right-s-line"></i></div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Ranking;
