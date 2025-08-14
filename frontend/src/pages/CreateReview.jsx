import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../components/layout/css/CreateReview.css';
import HamsterLoading from '../components/commom/HamsterLoading';

// Componente de avaliação por estrelas
const StarRating = ({ rating, onRate }) => {
  const handleClick = (e, star) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isHalf = clickX < rect.width / 2;
    const value = isHalf ? star - 0.5 : star;
    onRate(Math.max(0.5, value));
  };

  const handleKeyDown = (e, star) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onRate(Math.max(0.5, star - 0.5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      onRate(Math.min(5, star + 0.5));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const newRating = rating === star ? star - 0.5 : star;
      onRate(newRating >= 0.5 ? newRating : star);
    }
  };

  return (
    <div className="star-rating" role="radiogroup" aria-label="Avaliação do jogo">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star-btn ${rating >= star ? 'filled' : rating >= star - 0.5 ? 'half-filled' : ''}`}
          onClick={(e) => handleClick(e, star)}
          onKeyDown={(e) => handleKeyDown(e, star)}
          role="radio"
          aria-checked={rating === star || rating === star - 0.5}
          tabIndex={0}
          aria-label={`Avaliar com ${rating === star - 0.5 ? star - 0.5 : star} estrela${star > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

// Estado de sucesso
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

const LoadingSpinner = () => <span className="loader" aria-hidden="true"></span>;

const CreateReview = () => {
  const { id: gameId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [gameData, setGameData] = useState(null);
  const [loadingGame, setLoadingGame] = useState(true);
  const [gameError, setGameError] = useState(null);

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [platform, setPlatform] = useState('');
  const [playTime, setPlayTime] = useState('');

  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Navegar para detalhes do jogo
  const handleCancel = () => navigate(`/jogos/${gameId}`);

  const clearError = (field) => {
    setValidationErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  const validate = () => {
    const errors = {};
    if (rating <= 0) errors.rating = 'Por favor, avalie com 0.5 a 5 estrelas.';
    if (!title.trim()) errors.title = 'O título é obrigatório.';
    else if (title.trim().length < 5) errors.title = 'O título deve ter pelo menos 5 caracteres.';
    if (!comment.trim()) errors.comment = 'O comentário é obrigatório.';
    else if (comment.trim().length < 10) errors.comment = 'O comentário deve ter pelo menos 10 caracteres.';
    if (!platform) errors.platform = 'Selecione uma plataforma.';
    if (playTime && (isNaN(playTime) || playTime < 0)) errors.playTime = 'Tempo de jogo inválido.';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      Object.values(errors).forEach((msg) => toast.error(msg));
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData = {
        jogo_id: gameId,
        nota: rating,
        tempoDeJogo: playTime ? parseInt(playTime, 10) : null,
        plataforma: platform,
        titulo: title.trim(),
        comentario: comment.trim(),
        dataAvaliacao: new Date().toISOString(),
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
        const errorData = await response.json();
        if (errorData.message?.includes('unique_usuario_jogo_plataforma')) {
          toast.error('Você já avaliou este jogo nesta plataforma!');
        } else {
          toast.error(`Erro ${response.status} ao enviar avaliação`);
        }
        throw new Error(errorData.message || 'Erro ao enviar avaliação');
      }

      toast.success('Avaliação enviada com sucesso!');
      setSuccess(true);
    } catch (error) {
      console.error(error);
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
    setValidationErrors({});
    setSuccess(false);
  };

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setLoadingGame(true);
        setGameError(null);

        const response = await fetch(`http://localhost:8080/api/games/${gameId}`);
        if (!response.ok) throw new Error(`Erro na API (${response.status})`);

        const data = await response.json();
        setGameData(data);
      } catch (error) {
        console.error(error);
        setGameError('Erro ao carregar o jogo');
        toast.error('Erro ao carregar dados do jogo.');
      } finally {
        setLoadingGame(false);
      }
    };

    if (gameId) fetchGameData();
  }, [gameId]);

  return (
    <section
      className="create-review-section"
      aria-labelledby="title-create-review"
      style={{
        backgroundImage: gameData?.background_image
          ? `url(${gameData.background_image})`
          : 'url("/assets/default-bg.png")',
      }}
    >
      <div className="container">
        <div className="review-card">
          <header className="review-header">
            <h2 id="title-create-review">Escreva sua Avaliação</h2>
            {loadingGame && <p>Carregando nome do jogo...</p>}
            {gameError && <p className="error">{gameError}</p>}
            {!loadingGame && !gameError && <h3>Jogo: {gameData?.name || 'Nome não disponível'}</h3>}
          </header>

          {success ? (
            <SuccessState onReset={handleReset} />
          ) : (
            <form onSubmit={handleSubmit} className="review-form">
              <div className="form-group">
                <label htmlFor="platform">Plataforma</label>
                <select
                  id="platform"
                  value={platform}
                  onChange={(e) => {
                    setPlatform(e.target.value);
                    clearError('platform');
                  }}
                  aria-invalid={!!validationErrors.platform}
                >
                  <option value="">Escolha uma plataforma...</option>
                  {gameData?.platforms?.length > 0
                    ? gameData.platforms.map((p) => (
                        <option key={p.platform.id} value={p.platform.name}>
                          {p.platform.name}
                        </option>
                      ))
                    : null}
                </select>
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
                  step="any"
                  className="no-spinner"
                />
              </div>

              <div className="form-group">
                <label id="rating-label">Nota</label>
                <StarRating rating={rating} onRate={(value) => { setRating(value); clearError('rating'); }} />
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
                />
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
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? (<><HamsterLoading /> Enviando...</>) : 'Enviar Opinião'}
                </button>
                <button type="button" onClick={handleCancel} className="btn-secondary" disabled={isSubmitting}>
                  Cancelar
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
