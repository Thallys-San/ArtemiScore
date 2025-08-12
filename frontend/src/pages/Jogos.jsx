import React, { useEffect, useState, useRef, useCallback } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import GameCard from "../components/cards/GameCard";
import GameFilter from "../components/layout/GameFilter"; // 🔧
import "../style.css";
import HamsterLoading from "../components/commom/HamsterLoading";
import "../components/layout/css/HamsterLoading.css"

const LIMIT_PER_REQUEST = 20;

const Jogos = () => {
  const [games, setGames] = useState([]);
  const [filters, setFilters] = useState({ genre: "", platform: "", sort: "relevance" }); // 🔧
  const [appliedFilters, setAppliedFilters] = useState(filters); // 🔧
  const pageRef = useRef(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);

const buildQuery = () => {
  const params = new URLSearchParams({
    offset: pageRef.current * LIMIT_PER_REQUEST,
    limit: LIMIT_PER_REQUEST,
    sort: appliedFilters.sort,
  });

  if (appliedFilters.genre) {
    params.append('generos', appliedFilters.genre);  // ou se tiver vários: generos.join(',')
  }

  if (appliedFilters.platform) {
    params.append('plataformas', appliedFilters.platform); // mesmo esquema
  }

  return params.toString();
};




  const loadMoreGames = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:8080/api/games/cards?${buildQuery()}`);
      if (!res.ok) throw new Error("Erro ao carregar jogos");
      const newGames = await res.json();

      if (newGames.length === 0) {
        setHasMore(false);
      } else {
        setGames(prev => [...prev, ...newGames]);
        pageRef.current += 1;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, appliedFilters]); // 🔧

  useEffect(() => {
    if (!sentinelRef.current) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) loadMoreGames();
    }, { rootMargin: "200px", threshold: 0.01 });

    observerRef.current.observe(sentinelRef.current);

    return () => observerRef.current?.disconnect();
  }, [loadMoreGames]);

  // 🔧 Aplicar filtros
  const handleApplyFilters = () => {
    pageRef.current = 0;
    setGames([]);
    setHasMore(true);
    setAppliedFilters({ ...filters });
  };

  // 🔧 Resetar filtros
  const handleResetFilters = () => {
    const defaultFilters = { genre: "", platform: "", sort: "relevance" };
    setFilters(defaultFilters);
    pageRef.current = 0;
    setGames([]);
    setHasMore(true);
    setAppliedFilters(defaultFilters);
  };

  // 🔧 Atualizar estado dos filtros
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <Header />
      <main className="main-content">
        <GameFilter
          filters={filters}
          onChange={handleFilterChange}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />
        
        <section className="popular-games">
          <div className="container">
            <h1 className="page-title">Jogos Populares</h1>
            <div className="games-grid">
              {games.map(jogo => (
                <GameCard key={jogo.id} jogo={jogo} />
              ))}
            </div>
            {loading && (
                <div className="container-loading">
                  <HamsterLoading />
                </div>
            )}
            <div ref={sentinelRef} style={{ height: "1px" }} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Jogos;
