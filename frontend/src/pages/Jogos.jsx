import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import GameCard from "../components/cards/GameCard";
import GameFilter from "../components/layout/GameFilter";
import "../style.css";
import HamsterLoading from "../components/commom/HamsterLoading";
import "../components/layout/css/HamsterLoading.css";

const LIMIT_PER_REQUEST = 20;

const Jogos = () => {
  const location = useLocation();

  const [games, setGames] = useState([]);
  const [filters, setFilters] = useState({ genre: "", platform: "", sort: "relevance" });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const pageRef = useRef(0);
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);

  // Captura o parâmetro 'search' da query string
  const params = new URLSearchParams(location.search);
  const searchTerm = params.get("search")?.trim() || "";

  // Função para montar query para filtros normais
  const buildQuery = () => {
    const params = new URLSearchParams({
      offset: pageRef.current * LIMIT_PER_REQUEST,
      limit: LIMIT_PER_REQUEST,
      sort: appliedFilters.sort,
    });

    if (appliedFilters.genre) {
      params.append("generos", appliedFilters.genre);
    }
    if (appliedFilters.platform) {
      params.append("plataformas", appliedFilters.platform);
    }

    return params.toString();
  };

  // Função que carrega mais jogos, ajustando para busca ou filtros
const loadMoreGames = useCallback(async () => {
  if (loading || !hasMore) return;
  setLoading(true);

  try {
    let url = "";
    if (searchTerm) {
      const params = new URLSearchParams({
        nome: searchTerm, // Confirme o nome correto do parâmetro
        offset: pageRef.current * LIMIT_PER_REQUEST,
        limit: LIMIT_PER_REQUEST,
      });
      url = `http://localhost:8080/api/games/search?${params.toString()}`;
    } else {
      url = `http://localhost:8080/api/games/cards?${buildQuery()}`;
    }

    console.log("Buscando em:", url);
    const res = await fetch(url);
    if (!res.ok) throw new Error("Erro ao carregar jogos");
    const data = await res.json();
    console.log("Resposta da API:", data);

    // Ajuste para quando resposta for objeto
    const jogos = data.results || data;

    if (pageRef.current === 0) {
      setGames(jogos);
    } else {
      setGames(prev => [...prev, ...jogos]);
    }

    if (jogos.length < LIMIT_PER_REQUEST) {
      setHasMore(false);
    } else {
      pageRef.current += 1;
    }
  } catch (err) {
    console.error(err);
    setHasMore(false);
  } finally {
    setLoading(false);
  }
}, [loading, hasMore, appliedFilters, searchTerm]);



  // Observar o sentinel para scroll infinito
  useEffect(() => {
    if (!sentinelRef.current) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMoreGames();
      },
      { rootMargin: "200px", threshold: 0.01 }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => observerRef.current?.disconnect();
  }, [loadMoreGames]);

  // Resetar dados quando filtros ou search mudam
  useEffect(() => {
    pageRef.current = 0;
    setHasMore(true);
    setGames([]);
    // Quando searchTerm muda, ignorar filtros
    if (!searchTerm) {
      setAppliedFilters(filters);
    }
  }, [filters, searchTerm]);

  // Aplicar filtros (ignorado se estiver buscando por nome)
  const handleApplyFilters = () => {
    if (!searchTerm) {
      pageRef.current = 0;
      setGames([]);
      setHasMore(true);
      setAppliedFilters({ ...filters });
    }
  };

  // Resetar filtros (ignorado se estiver buscando por nome)
  const handleResetFilters = () => {
    const defaultFilters = { genre: "", platform: "", sort: "relevance" };
    setFilters(defaultFilters);
    if (!searchTerm) {
      pageRef.current = 0;
      setGames([]);
      setHasMore(true);
      setAppliedFilters(defaultFilters);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <Header />
      <main className="main-content">
        {!searchTerm && (
          <GameFilter
            filters={filters}
            onChange={handleFilterChange}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />
        )}

        <section className="popular-games">
          <div className="container">
            <h1 className="page-title">
              {searchTerm ? `Resultados para: "${searchTerm}"` : "Jogos Populares"}
            </h1>

            <div className="games-grid">
              {games.map((jogo) => (
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
