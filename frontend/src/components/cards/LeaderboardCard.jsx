import React from 'react';
import StarRating from '../commom/StarRating';
import platformIcons from '../utils/platformIcons';
import './css/LeaderboardCard.css';

const LeaderboardCard = ({ posicao, jogo }) => {
  // Defensive checks para evitar erros caso dados estejam incompletos
  const imageSrc = jogo.background_image || './assets/images/sem-imagem.jpg';
  const rating = jogo.mediaAvaliacao ?? 0; // 0 se undefined ou null
  const platforms = jogo.platforms ?? [];
  const tags = jogo.tags ?? [];

  return (
    <div className="leaderboard-card" key={jogo.id}>
      <div className="leaderboard-position">
        #{posicao}
      </div>

      <div className="leaderboard-thumb">
        <img
          src={imageSrc}
          alt={jogo.name}
          className="leaderboard-image"
        />
      </div>

      <div className="leaderboard-info">
        <h3 className="leaderboard-title">{jogo.name}</h3>

        {/* Plataformas com ícones */}
        <div className="leaderboard-platforms">
          {platforms.map(({ platform }) => {
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

        {/* Tags, limitado a 3 por exemplo */}
        <div className="leaderboard-tags">
          {tags.slice(0, 3).map(tag => (
            <span key={tag.id} className="tag">
              {tag.name}
            </span>
          ))}
        </div>

        {/* Avaliação */}
        <div className="leaderboard-rating">
          <StarRating rating={rating} />
          <span className="score">{rating.toFixed(1)}/5</span>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardCard;
