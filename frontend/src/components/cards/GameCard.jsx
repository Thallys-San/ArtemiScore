import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../commom/StarRating';
import platformIcons from '../utils/platformIcons';
import './css/GameCard.css';

const GameCard = ({ jogo }) => (
  <Link to={`/jogos/${jogo.id}`} className="game-card-link">
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
      </div>
    </div>
  </Link>
);

export default GameCard;
