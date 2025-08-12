import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../commom/StarRating';
import './css/ReleaseCard.css';

const ReleaseCard = ({ jogo }) => {
  const date = new Date(jogo.released || jogo.release_date);
  const dia = date.getDate().toString().padStart(2, '0');
  const mes = date.toLocaleString('pt-BR', { month: 'short' }).toUpperCase();
  const plataformas = (jogo.platforms || []).map((p, i) => (
    <span key={i} className="platform-tag">{p.platform.name}</span>
  ));

  return (
    <div className="release-card" key={jogo.id}>
      <Link to={`/jogos/${jogo.id}`} className="release-link">
        <div className="release-date">
          <span className="release-day">{dia}</span>
          <span className="release-month">{mes}</span>
        </div>
        <img
          src={jogo.background_image || 'https://i.redd.it/x1sr1lob3ai41.jpg'}
          alt={jogo.name}
          className="release-image"
        />
        <div className="release-info">
          <h3 className="release-title">{jogo.name}</h3>
          <div className="release-platforms">{plataformas}</div>
          {jogo.mediaAvaliacao && (
            <div className="rating-box">
              <span className="score">{jogo.mediaAvaliacao.toFixed(1)}/5</span>
              <StarRating rating={jogo.mediaAvaliacao} />
            </div>
          )}
        </div>
      </Link>

      <div className="release-wishlist">
        <button className="wishlist-button">
          <i className="ri-heart-line"></i> Lista de Desejos
        </button>
      </div>
    </div>
  );
};

export default ReleaseCard;
