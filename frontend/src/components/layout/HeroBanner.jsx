import React, { useEffect, useState } from "react";
import StarRating from "../commom/StarRating";
import HamsterLoading from "../../components/commom/HamsterLoading";
import "../../components/layout/css/HamsterLoading.css";
import "./css/HeroBanner.css";

import defaultImage1 from "../../assets/banners/banner-1.png";
import defaultImage2 from "../../assets/banners/banner-2.png";
import defaultImage3 from "../../assets/banners/banner-3.png";

const HeroBanner = () => {
  const [games, setGames] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const defaultBanners = [
    {
      id: 1,
      name: "Descubra novos jogos",
      description: "Saiba mais sobre a sua próxima aventura!",
      image: defaultImage1
    },
    {
      id: 2,
      name: "Compartilhe suas opiniões",
      description: "Sua avaliação ajuda outros jogadores a fazerem escolhas melhores.",
      image: defaultImage2
    },
    {
      id: 3,
      name: "Explore novos horizontes!",
      description: "Encontre universos de novas possibilidades",
      image: defaultImage3
    }
  ];


  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:8080/api/games/top-rated-monthly")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro na resposta da API");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Combina os jogos reais com os banners padrão
          const combined = [...data.slice(0, 3)];
          
          // Preenche com banners padrão se não houver jogos suficientes
          while (combined.length < 3) {
            combined.push(defaultBanners[combined.length]);
          }
          
          setGames(combined);
        } else {
          // Se não houver jogos, usa os banners padrão
          setGames(defaultBanners.slice(0, 3));
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar jogos mais bem avaliados:", err);
        // Em caso de erro, usa os banners padrão
        setGames(defaultBanners.slice(0, 3));
      })
      .finally(() => {
        setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="hero-banner loading">
        <HamsterLoading />
      </div>
    );
  }

  const currentItem = games[currentIndex];

  function decodeHtmlEntities(text) {
    if (!text) return "Sem descrição disponível.";
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  }

  const cleanDescription = currentItem?.description
    ? decodeHtmlEntities(currentItem.description.replace(/<[^>]*>/g, ""))
    : currentItem?.description || "Sem descrição disponível.";

  // Verifica se é um banner padrão (que não tem mediaAvaliacao)
  const isDefaultBanner = !currentItem.hasOwnProperty('mediaAvaliacao');

  return (
    <section className="hero-banner">
      <div className="hero-slide active">
        <div className="hero-background">
          <img
            src={
              currentItem?.background_image ||
              currentItem?.background_image_additional ||
              currentItem?.image ||
              "/default.jpg"
            }
            alt={currentItem?.name || "Jogo sem nome"}
            className="hero-image"
          />
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-container">
          <div className="hero-content">
            <span className="hero-tag">
              {isDefaultBanner ? "DESTAQUE" : "MELHOR AVALIADO"}
            </span>
            <h1 className="hero-title">{currentItem?.name || "Título não disponível"}</h1>

            {!isDefaultBanner && (
              <div className="hero-rating">
                <div className="star-rating">
                  <StarRating rating={currentItem?.mediaAvaliacao ?? 0} />
                </div>
                <span className="rating-text">
                  {(currentItem?.mediaAvaliacao ?? 0).toFixed(1)} (
                  {currentItem?.totalAvaliacoes ?? 0} Avaliações)
                </span>
              </div>
            )}

            <p className="hero-description">
              {cleanDescription.length > 200
                ? cleanDescription.substring(0, 200) + "..."
                : cleanDescription}
            </p>

            <div className="hero-buttons">
              {!isDefaultBanner && (
                <>
                  <button className="hero-button primary-button">
                    <i className="ri-information-line"></i> Ver Detalhes
                  </button>
                  <button className="hero-button secondary-button">
                    <i className="ri-star-line"></i> Avaliar Agora
                  </button>
                </>
              )}
              {isDefaultBanner && (
                <button className="hero-button primary-button">
                  <i className="ri-gamepad-line"></i> Explorar Jogos
                </button>
              )}
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
