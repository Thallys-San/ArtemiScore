import React, { useEffect, useState, useRef, useCallback } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import GameCard from "../components/cards/GameCard";
import '../styles.css';

const LIMIT_PER_REQUEST = 20;

const Jogos = () => {
  const [games, setGames] = useState([]);
  const pageRef = useRef(0); // controle da página atual
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);

  const loadMoreGames = useCallback(async () => {
  if (loading || !hasMore) return;

  setLoading(true);

  try {
    const offset = pageRef.current * LIMIT_PER_REQUEST;
    const res = await fetch(`http://localhost:8080/api/games/cards?offset=${offset}&limit=${LIMIT_PER_REQUEST}`);

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
}, [loading, hasMore]);


  // Configura o IntersectionObserver para scroll infinito
  useEffect(() => {
    if (!sentinelRef.current) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMoreGames();
        }
      },
      {
        rootMargin: "200px",
        threshold: 0.01,
      }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [loadMoreGames]);

  return (
    <>
      <Header />
      <main>
        <section className="popular-games">
          <div className="container">
            <h2 className="section-title">Jogos Populares</h2>
            <div className="games-grid">
              {games.map(jogo => (
                <GameCard key={jogo.id} jogo={jogo} />
              ))}
            </div>
            {loading && <div>Carregando...</div>}
            <div ref={sentinelRef} style={{ height: "1px" }} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Jogos;
