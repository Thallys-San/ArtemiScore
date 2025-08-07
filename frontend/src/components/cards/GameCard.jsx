import React from 'react';
import StarRating from '../commom/StarRating';
import platformIcons from '../utils/platformIcons';
import './css/GameCard.css';

const GameCard = ({ jogo }) => (
  <div className="game-card" key={jogo.id}>
    <img
      src={jogo.background_image || './assets/images/sem-imagem.jpg'}
      alt={jogo.name}
      className="game-img"
    />

    <div className="game-content">
      <h2>{jogo.name}</h2>

      {jogo.mediaAvaliacao && (
        <div className="rating-box">
          <span className="score">{jogo.mediaAvaliacao.toFixed(1)}/5</span>
          <StarRating rating={jogo.mediaAvaliacao} />
        </div>
      )}

      {/* Ícones das plataformas */}
      <div className="platform-icons">
        {jogo.platforms?.map(({ platform }) => {
          const icon = platformIcons[platform.slug];
          return (
            icon && (
              <img
                key={platform.id}
                src={icon}
                alt={platform.name}
                title={platform.name}
                className="platform-icon"
              />
            )
          );
        })}
      </div>

      {/* Tags do jogo */}
      <div className="game-tags">
        {jogo.tags?.slice(0, 5).map(tag => (
          <span key={tag.id} className="tag">
            {tag.name}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default GameCard;
