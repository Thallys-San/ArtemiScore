import React, { useEffect, useState } from 'react';
import StarRating from '../components/StarRating'; // já implementado
import './HeroBanner.css'; // certifique-se de que o CSS está vinculado

const HeroBanner = () => {
  const [topGame, setTopGame] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/games/top-rated') // ou o endpoint que você tiver
      .then(res => res.json())
      .then(data => setTopGame(data))
      .catch(err => console.error('Erro ao buscar o jogo mais bem avaliado:', err));
  }, []);

  if (!topGame) {
    return <div className="hero-banner loading">Carregando...</div>;
  }

  return (
    <section className="hero-banner">
      <div className="hero-slide active">
        <div className="hero-background">
          <img
            src={topGame.bannerImage || topGame.cover || '/default.jpg'}
            alt={topGame.name}
            className="hero-image"
          />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-container">
          <div className="hero-content">
            <span className="hero-tag">MELHOR AVALIADO</span>
            <h1 className="hero-title">{topGame.name}</h1>
            <div className="hero-rating">
              <div className="star-rating">
                <StarRating rating={topGame.ratingAverage} />
              </div>
              <span className="rating-text">{topGame.ratingAverage.toFixed(1)} ({topGame.ratingCount} Avaliações)</span>
            </div>
            <p className="hero-description">
              {topGame.description?.substring(0, 200) || "Sem descrição disponível."}
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
          <button className="indicator active"></button>
          <button className="indicator"></button>
          <button className="indicator"></button>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
