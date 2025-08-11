import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import GameCard from '../components/cards/GameCard';
import GameFilter from '../components/layout/GameFilter';
import '../components/layout/css/Ranking.css';

const Ranking = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    genre: 'all',
    platform: 'all',
    search: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 6,  // Increased items per page for card view
  });

  // Function to fetch data from your backend API
  const fetchGames = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch games data from the API
      const response = await fetch(`http://localhost:8080/api/games/top-rated-monthly?page=${page}`);
      
      // Check if the response is OK (status 200-299)
      if (!response.ok) {
        throw new Error('Erro na resposta da API');
      }
      
      const data = await response.json();
      
      // Filter games based on selected filters
      const filteredGames = data.filter((game) => {
        const matchGenre = filters.genre === 'all' || game.genre === filters.genre;
        const matchPlatform = filters.platform === 'all' || game.platforms.includes(filters.platform);
        const matchSearch = game.name.toLowerCase().includes(filters.search.toLowerCase());
        return matchGenre && matchPlatform && matchSearch;
      });

      // Pagination logic
      const { itemsPerPage } = pagination;
      const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
      const startIndex = (page - 1) * itemsPerPage;
      const paginatedGames = filteredGames.slice(startIndex, startIndex + itemsPerPage);

      setGames(paginatedGames);
      setPagination((prev) => ({ ...prev, currentPage: page, totalPages }));
    } catch (err) {
      setError(`Erro ao carregar ranking. Tente novamente mais tarde. ${err.message}`);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  // Call fetchGames when the page loads
  useEffect(() => {
    fetchGames(1);
  }, [filters]);

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    fetchGames(page);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Header />
      <section className="ranking-section">
        <div className="container">
          <h1>Ranking de Jogos</h1>
          <p>Descubra os jogos mais bem avaliados pela comunidade. Filtros, ordenações e atualizações em tempo real.</p>

          <div className="ranking-controls">
            <GameFilter filters={filters} onChange={handleFilterChange} />
          </div>

          {/* Displaying games as cards */}
          <div className="game-cards-container">
            {loading ? (
              <p>Carregando jogos...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              games.map((game) => <GameCard key={game.id} jogo={game} />)
            )}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
            >
              Anterior
            </button>
            <span>{pagination.currentPage} de {pagination.totalPages}</span>
            <button
              className={`page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
            >
              Próximo
            </button>
          </div>

        </div>
      </section>
      <Footer />
    </>
  );
};

export default Ranking;
