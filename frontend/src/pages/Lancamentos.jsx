import React, { useEffect, useState, useRef, useCallback } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ReleaseCard from "../components/cards/ReleaseCard";
import GameFilter from "../components/layout/GameFilter";
import "../style.css";
import HamsterLoading from "../components/commom/HamsterLoading";
import "../components/layout/css/HamsterLoading.css"

const LIMIT_PER_REQUEST = 20;

const JogosUpcoming = () => {
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [filters, setFilters] = useState({ genre: "", platform: "", sort: "relevance" });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const pageRef = useRef(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);

  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  const buildQuery = () => {
    const params = new URLSearchParams({
      offset: pageRef.current * LIMIT_PER_REQUEST,
      limit: LIMIT_PER_REQUEST,
      sort: appliedFilters.sort,
    });

    if (appliedFilters.genre) {
      params.append('generos', appliedFilters.genre);
    }

    if (appliedFilters.platform) {
      params.append('plataformas', appliedFilters.platform);
    }

    return params.toString();
  };

  const loadMoreGames = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:8080/api/games/cards/upcoming?${buildQuery()}`);
      if (!res.ok) throw new Error("Erro ao carregar jogos");

      const newGames = await res.json();

      if (newGames.length === 0 || newGames.length < LIMIT_PER_REQUEST) {
        hasMoreRef.current = false;
        setHasMore(false);
      }

      setUpcomingGames(prev => [...prev, ...newGames]);
      pageRef.current += 1;

    } catch (e) {
      console.error(e);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [appliedFilters]);

  useEffect(() => {
    if (!sentinelRef.current) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMoreGames();
      }
    }, { rootMargin: "200px", threshold: 0.01 });

    observerRef.current.observe(sentinelRef.current);

    return () => observerRef.current?.disconnect();
  }, [loadMoreGames, hasMore, loading]);

  const handleApplyFilters = () => {
    pageRef.current = 0;
    setUpcomingGames([]);
    setHasMore(true);
    hasMoreRef.current = true; // resetar ref
    setAppliedFilters({ ...filters });
  };

  const handleResetFilters = () => {
    const defaultFilters = { genre: "", platform: "", sort: "relevance" };
    setFilters(defaultFilters);
    pageRef.current = 0;
    setUpcomingGames([]);
    setHasMore(true);
    hasMoreRef.current = true; // resetar ref
    setAppliedFilters(defaultFilters);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    loadMoreGames();
  }, [appliedFilters, loadMoreGames]);

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

        <section className="upcoming-releases">
          <div className="container">
            <div className="section-wrapper">
              <h2 className="section-title">Próximos Lançamentos</h2>
              <div className="releases-slider">
                {upcomingGames.map(jogo => (
                  <ReleaseCard key={jogo.id} jogo={jogo} />
                ))}
              </div>
              {loading && (
                <div className="container-loading">
                  <HamsterLoading />
                </div>
            )}

              {!loading && !hasMore && upcomingGames.length > 0 && (
                <div style={{ textAlign: "center", padding: "1rem", color: "#888" }}>
                  Você alcançou o fim da lista de jogos.
                </div>
              )}

              {!loading && !hasMore && upcomingGames.length === 0 && (
                <div style={{ textAlign: "center", padding: "1rem", color: "#888" }}>
                  Nenhum jogo encontrado com os filtros aplicados.
                </div>
              )}
              <div ref={sentinelRef} style={{ height: "1px" }} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default JogosUpcoming;
