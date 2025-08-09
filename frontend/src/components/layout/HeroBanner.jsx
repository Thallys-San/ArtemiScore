import React, { useEffect, useState } from "react";
import StarRating from "../commom/StarRating";
import HamsterLoading from "../../components/commom/HamsterLoading";
import "../../components/layout/css/HamsterLoading.css";
import "./css/HeroBanner.css";

const HeroBanner = () => {
  const [games, setGames] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8080/api/games/top-rated-monthly")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setGames(data.slice(0, 3)); // limita para 3 jogos
        } else {
          setGames([]);
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar jogos mais bem avaliados:", err);
        setGames([]);
      });
  }, []);

  useEffect(() => {
  if (games.length > 1) {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % games.length);
    }, 10000);
    return () => clearInterval(interval);
  }
}, [games, currentIndex]);



  // Se não tiver jogos ou o índice atual for inválido
  if (games.length === 0 || !games[currentIndex]) {
    return (
      <div className="hero-banner loading">
        <HamsterLoading />
      </div>
    );
  }

  const topGame = games[currentIndex];

  function decodeHtmlEntities(text) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

const cleanDescription = topGame?.description
  ? decodeHtmlEntities(topGame.description.replace(/<[^>]*>/g, ""))
  : "Sem descrição disponível.";


  return (
    <section className="hero-banner">
      <div className="hero-slide active">
        <div className="hero-background">
          <img
            src={
              topGame?.background_image ||
              topGame?.background_image_additional ||
              "/default.jpg"
            }
            alt={topGame?.name || "Jogo sem nome"}
            className="hero-image"
          />
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-container">
          <div className="hero-content">
            <span className="hero-tag">MELHOR AVALIADO</span>
            <h1 className="hero-title">{topGame?.name || "Título não disponível"}</h1>

            <div className="hero-rating">
              <div className="star-rating">
                <StarRating rating={topGame?.mediaAvaliacao ?? 0} />
              </div>
              <span className="rating-text">
                {(topGame?.mediaAvaliacao ?? 0).toFixed(1)} (
                {topGame?.totalAvaliacoes ?? 0} Avaliações)
              </span>
            </div>

            <p className="hero-description">
              {cleanDescription.length > 200
                ? cleanDescription.substring(0, 200) + "..."
                : cleanDescription}
            </p>

            <div className="hero-buttons">
              <button className="hero-button primary-button">
                <i className="ri-information-line"></i> Ver Detalhes
              </button>
              <button className="hero-button secondary-button">
                <i className="ri-star-line"></i> Avaliar Agora
              </button>
            </div>
          </div>
        </div>

        <div className="hero-indicators">
          {games.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
