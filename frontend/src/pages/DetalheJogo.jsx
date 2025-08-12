import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../layout/css/GameDetails.css';
import Header from './Header';
import Footer from './Footer';

const MetacriticTemplate = ({ gameData }) => {
  const navigate = useNavigate();
  const [hoveredRating, setHoveredRating] = useState(null);
  const [userRating, setUserRating] = useState(null); // Store user's selected rating

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: gameData?.name,
        text: `Confira ${gameData?.name} - ${gameData?.metacriticScore || 'N/A'} no Metacritic`,
        url: window.location.href,
      }).catch((err) => console.error('Falha ao compartilhar:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'A ser definido';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const renderScoreColor = (score) => {
    if (!score) return 'neutral';
    if (score >= 75) return 'positive';
    if (score >= 50) return 'mixed';
    return 'negative';
  };

  // Calculate average rating (assuming gameData.userRating is a number between 0-10 or null)
  const averageRating = gameData?.userRating ? (gameData.userRating / 2).toFixed(1) : null;

  // Handle star click to set user rating
  const handleStarClick = (rating) => {
    setUserRating(rating);
    // Here you could add logic to submit the rating to a backend
    console.log(`User rated ${gameData?.name} with ${rating} stars`);
  };

  return (
    <div className="metacritic-template">
      <Header />
      
      <div className="game-content-wrapper">
        {/* Game Hero Section */}
        <div 
          className="game-hero"
          style={{ 
            backgroundImage: gameData?.background_image 
              ? `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), var(--darker)), url(${gameData.background_image})`
              : 'none'
          }}
        >
          <div className="game-hero-container">
            <div className="game-cover">
              <img 
                src={gameData?.background_image || '/placeholder.jpg'} 
                alt={`Capa de ${gameData?.name || 'Jogo'}`}
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder.jpg';
                }}
              />
            </div>
            <div className="game-info">
              <div className="game-title-container">
                <div>
                  <h1 className="game-title">{gameData?.name || 'Jogo sem título'}</h1>
                  {gameData?.name_original && (
                    <h2 className="game-original-title">{gameData.name_original}</h2>
                  )}
                  <div className="star-rating-container">
                    {averageRating ? (
                      <span className="average-rating">
                        {[...Array(5)].map((_, index) => (
                          <span
                            key={index}
                            className={`star ${index < Math.round(averageRating) ? 'filled' : ''}`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="rating-value">({averageRating}/5)</span>
                      </span>
                    ) : (
                      <span className="no-rating"></span>
                    )}
                    <div className="user-star-rating">
                      {[...Array(5)].map((_, index) => (
                        <span
                          key={index}
                          className={`star ${index < (hoveredRating || userRating || 0) ? 'filled' : ''}`}
                          onMouseEnter={() => setHoveredRating(index + 1)}
                          onMouseLeave={() => setHoveredRating(null)}
                          onClick={() => handleStarClick(index + 1)}
                          role="button"
                          aria-label={`Avaliar com ${index + 1} estrela${index + 1 > 1 ? 's' : ''}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <button
                      className="rate-now-button"
                      onClick={() => navigate(`/game/${gameData?.slug}/rate`)}
                      aria-label="Avaliar este jogo agora"
                    >
                      Avaliar Agora
                    </button>
                  </div>
                </div>
                <button 
                  className="share-button" 
                  onClick={handleShare}
                  aria-label="Compartilhar este jogo"
                >
                  <i className="icon-share"></i> Compartilhar
                </button>
              </div>

              <div className="game-scores">
                
              </div>

              <div className="game-meta">
                <div className="game-platforms">
                  {gameData?.platforms?.map((platform, index) => (
                    <span key={index} className="platform-tag">
                      {platform.platform.name}
                    </span>
                  )) || <span className="platform-tag">Nenhuma plataforma listada</span>}
                </div>
                
                <div className="game-release-date">
                  <span className="release-label">Lançamento:</span>
                  <span>{formatDate(gameData?.released)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="game-content-container">
          <main className="game-main-content">
            <section className="details-section">
              <h2 className="section-title">Sobre o Jogo</h2>
              
              {gameData?.description_raw && (
                <div className="detail-block">
                  <p className="game-description">{gameData.description_raw}</p>
                </div>
              )}
            </section>

            {gameData?.similar_games?.length > 0 && (
              <section className="similar-games-section">
                <div className="section-header">
                  <h2 className="section-title">Jogos Semelhantes</h2>
                  <Link to={`/games?similar_to=${gameData.slug}`} className="view-all">
                    Ver Todos
                  </Link>
                </div>
                <div className="similar-games-carousel">
                  {gameData.similar_games.slice(0, 5).map((game, index) => (
                    <div 
                      key={index} 
                      className="similar-game-card"
                      onClick={() => navigate(`/game/${game.slug}`)}
                    >
                      <div className="similar-game-cover-container">
                        <img 
                          src={game.background_image || '/placeholder.jpg'} 
                          alt={`Capa de ${game.name}`}
                          className="similar-game-cover"
                          loading="lazy"
                        />
                        <div className="similar-game-score">
                          {game.metacritic || 'N/A'}
                        </div>
                      </div>
                      <div className="similar-game-info">
                        <div className="similar-game-title">{game.name}</div>
                        <div className="similar-game-release">
                          {game.released ? new Date(game.released).getFullYear() : 'A ser anunciado'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>

          <aside className="game-sidebar">
            <div className="sidebar-card quick-facts">
              <h3 className="sidebar-title">Fatos Rápidos</h3>
              <ul className="facts-list">
                <li>
                  <span className="fact-label">Data de Lançamento</span>
                  <span className="fact-value">{formatDate(gameData?.released)}</span>
                </li>
                <li>
                  <span className="fact-label">Desenvolvedor</span>
                  <span className="fact-value">
                    {gameData?.developers?.map(dev => dev.name).join(", ") || 'Desconhecido'}
                  </span>
                </li>
                <li>
                  <span className="fact-label">Publicador</span>
                  <span className="fact-value">
                    {gameData?.publishers?.map(pub => pub.name).join(", ") || 'Desconhecido'}
                  </span>
                </li>
                <li>
                  <span className="fact-label">Gênero</span>
                  <span className="fact-value">
                    {gameData?.genres?.map(genre => genre.name).join(", ") || 'N/A'}
                  </span>
                </li>
                {gameData?.esrb_rating && (
                  <li>
                    <span className="fact-label">Classificação</span>
                    <span className="fact-value">{gameData.esrb_rating}</span>
                  </li>
                )}
                {gameData?.playtime && (
                  <li>
                    <span className="fact-label">Tempo Médio de Jogo</span>
                    <span className="fact-value">
                      {gameData.playtime} horas
                    </span>
                  </li>
                )}
              </ul>
            </div>
            
            {gameData?.tags?.length > 0 && (
              <div className="sidebar-card tags-card">
                <h3 className="sidebar-title">Tags</h3>
                <div className="tags-container">
                  {gameData.tags.slice(0, 15).map((tag, index) => (
                    <Link 
                      key={index} 
                      to={`/games?tag=${tag.id}`}
                      className="tag"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {gameData?.stores?.length > 0 && (
              <div className="sidebar-card stores-card">
                <h3 className="sidebar-title">Onde Comprar</h3>
                <div className="stores-list">
                  {gameData.stores.map((store, index) => (
                    <a 
                      key={index} 
                      href={store.url} 
                      className="store-item" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <span className="store-icon">
                        <img 
                          src={`/store-icons/${store.store.name.toLowerCase()}.png`} 
                          alt={store.store.name}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </span>
                      <span className="store-name">{store.store.name}</span>
                      {store.price && (
                        <span className="store-price">{store.price}</span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MetacriticTemplate;
