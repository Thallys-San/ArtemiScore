import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../commom/StarRating';
import platformIcons from '../utils/platformIcons';
import './css/LeaderboardCard.css';

const LeaderboardCard = ({ posicao, jogo }) => {
  const imageSrc = jogo.background_image || './assets/images/sem-imagem.jpg';
  const rating = jogo.mediaAvaliacao ?? 0;
  const platforms = jogo.platforms ?? [];
  const tags = jogo.tags ?? [];

  return (
    <Link to={`/jogos/${jogo.id}`} className="leaderboard-card-link">
      <div className="leaderboard-card">
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

          <div className="leaderboard-tags">
            {tags.slice(0, 3).map(tag => (
              <span key={tag.id} className="tag">
                {tag.name}
              </span>
            ))}
          </div>

          <div className="leaderboard-rating">
            <StarRating rating={rating} />
            <span className="score">{rating.toFixed(1)}/5</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LeaderboardCard;
