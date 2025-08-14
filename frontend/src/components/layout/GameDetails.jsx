import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../layout/css/GameDetails.css';
import Header from './Header';
import Footer from './Footer';
import Review from '../cards/Review';

const MetacriticTemplate = ({ gameData }) => {
  const navigate = useNavigate();
  const [hover, setHover] = useState(null); // controla hover nas estrelas

  // Função auxiliar para formatar datas
  const formatDate = (dateString) => {
    if (!dateString) return 'Data desconhecida';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Compartilhamento simples (apenas copia URL)
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: gameData?.name,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  const handleStarHover = (index) => setHover(index);
  const handleStarLeave = () => setHover(null);

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
                  <div className="game-rating">
                    {/* Bloco com estrelas + nota */}
                    {gameData?.mediaAvaliacao !== undefined && (
                      <div className="rating-info">
                        <div className="rating-caixa">
                          {[1, 2, 3, 4, 5].map((star, i) => {
                            const filledClass =
                              gameData.mediaAvaliacao >= star
                                ? 'filled'
                                : gameData.mediaAvaliacao >= star - 0.5
                                ? 'half-filled'
                                : '';
                            const hoverClass = hover !== null && i <= hover ? 'hovered' : '';

                            return (
                              <span
                                key={star}
                                className={`star ${filledClass} ${hoverClass}`}
                                onMouseEnter={() => handleStarHover(i)}
                                onMouseLeave={handleStarLeave}
                              >
                                ★
                              </span>
                            );
                          })}
                        </div>

                        <div className="media-avaliacao">
                          <span>{typeof gameData?.mediaAvaliacao === 'number' ? gameData.mediaAvaliacao.toFixed(1) : 'N/A'}</span>
                          <span> ({gameData?.totalAvaliacoes || 0} avaliações)</span>
                        </div>
                      </div>
                    )}

                    {/* Botão separado */}
                    <Link
                      to={`/reviews/create/${gameData?.id}`}
                      className="rate-now-button"
                      aria-label="Avaliar este jogo agora"
                    >
                      Avaliar Agora
                    </Link>
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

              <div className="game-meta">
                <div className="game-platforms">
                  {gameData?.platforms?.length > 0
                    ? gameData.platforms.map((platform, index) => (
                        <span key={index} className="platform-tag">
                          {platform.platform.name}
                        </span>
                      ))
                    : <span className="platform-tag">Nenhuma plataforma listada</span>}
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

    {gameData && <Review gameData={gameData} />}

  </section>
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
                        {store.store?.name && (
                          <img 
                            src={`/store-icons/${store.store.name.toLowerCase()}.png`} 
                            alt={store.store.name}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                      </span>
                      <span className="store-name">{store.store?.name || 'Loja'}</span>
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
