import React from 'react';
import StarRating from '../commom/StarRating';
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
    </div>
  </div>
);

export default GameCard;
