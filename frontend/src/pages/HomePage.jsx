import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HeroBanner from "../components/layout/HeroBanner";
import GameCard from "../components/cards/GameCard";
import ReleaseCard from "../components/cards/ReleaseCard";
//import 'remixicon/fonts/remixicon.css';

const HomePage = () => {
  const [popularGames, setPopularGames] = useState([]);
  const [upcomingGames, setUpcomingGames] = useState([]);

  const MAX_POPULAR_CARDS = 8;
  const MAX_RELEASE_CARDS = 4;

  useEffect(() => {
    fetchPopularGames();
    fetchUpcomingGames();
  }, []);

  const fetchPopularGames = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/games/cards");
      const cards = await res.json();
      if (Array.isArray(cards)) {
        setPopularGames(cards.slice(0, MAX_POPULAR_CARDS));
      }
    } catch (err) {
      console.error("Erro ao carregar jogos populares:", err);
    }
  };

  const fetchUpcomingGames = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/games/cards/upcoming");
      const cards = await res.json();
      if (Array.isArray(cards)) {
        setUpcomingGames(cards.slice(0, MAX_RELEASE_CARDS));
      }
    } catch (err) {
      console.error("Erro ao carregar lançamentos:", err);
    }
  };

  return (
    <>
      <Header />
      <main>
        <HeroBanner />
        <section className="popular-games">
          <div className="container">
            <h2 className="section-title">Jogos Populares</h2>
            <div className="games-grid">
              {popularGames.map((jogo) => (
                <GameCard key={jogo.id} jogo={jogo} />
              ))}
            </div>
          </div>
        </section>

        <section className="upcoming-releases">
          <div className="container">
            <h2 className="section-title">Próximos Lançamentos</h2>
            <div className="releases-slider">
              {upcomingGames.map((jogo) => (
                <ReleaseCard key={jogo.id} jogo={jogo} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
