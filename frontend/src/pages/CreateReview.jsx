import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../components/layout/css/CreateReview.css';

// StarRating component
const StarRating = ({ rating, onRate }) => {
  const handleClick = (e, star) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isHalf = clickX < rect.width / 2;
    const value = isHalf ? star - 0.5 : star;
    onRate(Math.max(1, value));
  };

  const handleKeyDown = (e, star) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onRate(Math.max(1, star - 0.5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      onRate(Math.min(5, star + 0.5));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const newRating = rating === star ? star - 0.5 : star;
      onRate(newRating >= 1 ? newRating : star);
    }
  };

  return (
    <div className="star-rating" role="radiogroup" aria-label="Avaliação do jogo">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star-btn ${
            rating >= star ? 'filled' : rating >= star - 0.5 ? 'half-filled' : ''
          }`}
          onClick={(e) => handleClick(e, star)}
          onKeyDown={(e) => handleKeyDown(e, star)}
          role="radio"
          aria-checked={rating === star || rating === star - 0.5}
          tabIndex={0}
          aria-label={`Avaliar com ${
            rating === star - 0.5 ? star - 0.5 : star
          } estrela${star > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

// Componentes auxiliares
const SuccessState = ({ onReset }) => (
  <div className="success-state" role="status" aria-live="polite">
    <svg
      className="success-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
    <h3>Avaliação enviada com sucesso! 🎉</h3>
    <p>Sua avaliação já está visível na página do jogo.</p>
    <button onClick={onReset} className="btn-primary" type="button">
      Escrever outra Avaliação
    </button>
  </div>
);

const LoadingSpinner = () => (
  <span className="loader" aria-hidden="true"></span>
);

const CreateReview = () => {
  const { id: gameId } = useParams();
  const [gameName, setGameName] = useState('');
  const [loadingGame, setLoadingGame] = useState(true);
  const [gameError, setGameError] = useState(null);

  const platforms = ['PC', 'PlayStation 5', 'Xbox Series X', 'Nintendo Switch', 'Outros'];

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [platform, setPlatform] = useState('');
  const [playTime, setPlayTime] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const token = localStorage.getItem('token');

  const usuario_id = 1; // pegar do auth real depois

  const clearError = (field) => {
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  const validate = () => {
    const newErrors = {};
    if (rating <= 0) newErrors.rating = 'Por favor, avalie com 0.5 a 5 estrelas.';
    if (!title.trim()) newErrors.title = 'O título é obrigatório.';
    else if (title.trim().length < 5) newErrors.title = 'O título deve ter pelo menos 5 caracteres.';
    if (!comment.trim()) newErrors.comment = 'O comentário é obrigatório.';
    else if (comment.trim().length < 10) newErrors.comment = 'O comentário deve ter pelo menos 10 caracteres.';
    if (!platform) newErrors.platform = 'Selecione uma plataforma.';
    if (playTime && isNaN(playTime)) newErrors.playTime = 'O tempo de jogo deve ser um número.';
    else if (playTime && playTime < 0) newErrors.playTime = 'O tempo de jogo não pode ser negativo.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);

    try {
      const reviewData = {
        usuario_id,
        jogo_id: gameId,
        nota: rating,
        tempoDeJogo: playTime ? parseInt(playTime, 10) : null,
        plataforma: platform,
        comentario: `${title.trim()}: ${comment.trim()}`,
        dataAvaliacao: new Date().toISOString(), // LocalDateTime ISO
      };

      const response = await fetch('http://localhost:8080/avaliacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status} ao enviar avaliação`);
      }

      setSuccess(true);
    } catch (error) {
      console.error(error);
      setErrors({ submit: 'Erro ao enviar a opinião. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setRating(0);
    setTitle('');
    setComment('');
    setPlatform('');
    setPlayTime('');
    setErrors({});
    setSuccess(false);
  };

useEffect(() => {
  const fetchGameName = async () => {
    try {
      setLoadingGame(true);
      setGameError(null);

      const response = await fetch(`http://localhost:8080/api/games/${gameId}`);
      if (!response.ok) {
        throw new Error(`Erro na API (${response.status})`);
      }

      const gameData = await response.json();
      
      // Ajustar conforme o nome real da propriedade no seu backend
      setGameName(gameData.name || gameData.nome || 'Nome do jogo não disponível');

    } catch (error) {
      console.error(error);
      setGameError('Erro ao carregar o nome do jogo');
    } finally {
      setLoadingGame(false);
    }
  };

  if (gameId) {
    fetchGameName();
  }
}, [gameId]);


  return (
    <section className="create-review-section" aria-labelledby="review-title">
      <div className="container">
        <div className="review-card">
          <header className="review-header">
            <h2 id="review-title">Escreva sua Avaliação</h2>
            {loadingGame && <p>Carregando nome do jogo...</p>}
            {gameError && <p className="error">{gameError}</p>}
            {!loadingGame && !gameError && <h3>Jogo: {gameName}</h3>}
            <p>Compartilhe sua experiência com a comunidade de jogadores</p>
          </header>

          {success ? (
            <SuccessState onReset={handleReset} />
          ) : (
            <form onSubmit={handleSubmit} className="review-form">
              {errors.submit && <span className="error form-error">{errors.submit}</span>}

              <div className="form-group">
                <label htmlFor="platform">Plataforma</label>
                <select
                  id="platform"
                  value={platform}
                  onChange={(e) => {
                    setPlatform(e.target.value);
                    clearError('platform');
                  }}
                  aria-invalid={!!errors.platform}
                >
                  <option value="">Escolha uma plataforma...</option>
                  {platforms.map((plat) => (
                    <option key={plat} value={plat}>{plat}</option>
                  ))}
                </select>
                {errors.platform && <span className="error">{errors.platform}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="playTime">Tempo de Jogo (horas, opcional)</label>
                <input
                  type="number"
                  id="playTime"
                  value={playTime}
                  onChange={(e) => {
                    setPlayTime(e.target.value);
                    clearError('playTime');
                  }}
                  placeholder="Ex: 20"
                  aria-invalid={!!errors.playTime}
                  step="any"
                  className="no-spinner"
                />
                {errors.playTime && <span className="error">{errors.playTime}</span>}
              </div>

              <div className="form-group">
                <label id="rating-label">Nota</label>
                <StarRating rating={rating} onRate={(value) => { setRating(value); clearError('rating'); }} />
                {errors.rating && <span className="error">{errors.rating}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="title">Título</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    clearError('title');
                  }}
                  placeholder="Ex: Ótima experiência!"
                  aria-invalid={!!errors.title}
                />
                {errors.title && <span className="error">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="comment">Comentário</label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                    clearError('comment');
                  }}
                  rows="6"
                  placeholder="Descreva sua experiência: gráficos, jogabilidade, história, trilha sonora, etc."
                  aria-invalid={!!errors.comment}
                />
                {errors.comment && <span className="error">{errors.comment}</span>}
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleReset} className="btn-secondary" disabled={isSubmitting}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? (<><LoadingSpinner /> Enviando...</>) : 'Enviar Opinião'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default CreateReview;
