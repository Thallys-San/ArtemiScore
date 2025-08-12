import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import LeaderboardCard from '../components/cards/LeaderboardCard';
import GameFilter from '../components/layout/GameFilter';
import HamsterLoading from '../components/commom/HamsterLoading';
import '../components/layout/css/Ranking.css';

const Ranking = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    genre: 'all',
    platform: 'all',
    search: '',
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Refs para controlar a renderização do observer
  const observer = useRef();

  // Monta a query string com filtros e página
  const buildQuery = () => {
    const params = new URLSearchParams();
    if (filters.genre && filters.genre !== 'all') params.append('genre', filters.genre);
    if (filters.platform && filters.platform !== 'all') params.append('platform', filters.platform);
    if (filters.search && filters.search.trim() !== '') params.append('search', filters.search.trim());
    params.append('page', page);
    params.append('limit', 6); // controle do tamanho da página na API
    return params.toString();
  };

  // Função para carregar dados da API
  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryString = buildQuery();
      const response = await fetch(`http://localhost:8080/api/games/top-rated-monthly?${queryString}`);

      if (!response.ok) {
        throw new Error('Erro na resposta da API');
      }

      const data = await response.json();

      // Se página 1, substitui lista; se não, acumula
      setGames(prev => (page === 1 ? data : [...prev, ...data]));

      setHasMore(data.length > 0); // se recebeu algo, tem mais para carregar

    } catch (err) {
      setError(`Erro ao carregar ranking. Tente novamente mais tarde. ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  // Recarrega sempre que filtros ou página mudam
  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  // Quando filtros mudam, resetar paginação e lista
  useEffect(() => {
    setPage(1);
  }, [filters]);

  // Observer para infinite scroll
  const lastGameElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Controlador de filtro (passa para o estado)
const handleFilterChange = (e) => {
  if (!e) return;

  if (e.target) {
    // Evento DOM
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  } else if (e.name && e.value) {
    // Objeto customizado
    setFilters(prev => ({ ...prev, [e.name]: e.value }));
  }
};



  return (
    <>
      <Header />
      <section className="rk-section">
        <div className="container">
          <div className="rk-container">
            <div className="rk-controls">
              <GameFilter filters={filters} onChange={handleFilterChange} />
            </div>
            
            <h1 className='page-title'>Ranking</h1>
           
            <div className="rk-cards-container">
              {games.map((game, index) => {
                if (index === games.length - 1) {
                  return (
                    <LeaderboardCard
                      ref={lastGameElementRef}
                      key={game.id}
                      posicao={index + 1}
                      jogo={game}
                    />
                  );
                } else {
                  return <LeaderboardCard key={game.id} posicao={index + 1} jogo={game} />;
                }
              })}
              {loading && (
                <div className="container-loading">
                  <HamsterLoading />
                </div>
              )}
              {!hasMore && !loading && <p style={{ textAlign: 'center', color: '#888' }}>Fim do ranking.</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Ranking;
