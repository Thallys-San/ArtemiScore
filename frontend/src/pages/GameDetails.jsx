import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../components/layout/css/GameDetail.css';

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login")
  };

  return (
    <header>
      <div className="container header-container">
        <div className="flex items-center">
          <Link to="/" className="logo font-pacifico">AtermiScore</Link>
          <nav className="main-nav">
            <Link to="/home" className="nav-link active">Início</Link>
            <Link to="/jogos" className="nav-link">Jogos</Link>
            <Link to="/ranking" className="nav-link">Ranking</Link>
            <Link to="/Lancamentos" className="nav-link">Lançamentos</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="search-bar">
            <input type="text" placeholder="Buscar jogos..." className="search-input" />
            <div className="search-icon">
              <i className="ri-search-line"></i>
            </div>
          </div>
          <div className="relative user-menu-container">
            <div className="user-menu-button">
              <i className="ri-user-line user-icon"></i>
            </div>
            <div className="user-dropdown">
              {isLoggedIn ? (
                <>
                  <Link to="/perfil" className="dropdown-item">
                    <div className="dropdown-icon"><i className="ri-user-3-line"></i></div>
                    <span>Meu Perfil</span>
                  </Link>
                  <Link to="/minhasavaliacoes" className="dropdown-item">
                    <div className="dropdown-icon"><i className="ri-star-line"></i></div>
                    <span>Minhas Avaliações</span>
                  </Link>
                  <Link to="/jogosfavoritos" className="dropdown-item">
                    <div className="dropdown-icon"><i className="ri-heart-line"></i></div>
                    <span>Jogos Favoritos</span>
                  </Link>
                  <Link to="/configuracoes" className="dropdown-item">
                    <div className="dropdown-icon"><i className="ri-settings-3-line"></i></div>
                    <span>Configurações</span>
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item button-logout"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, font: "inherit", color: "inherit" }}
                  >
                    <div className="dropdown-icon"><i className="ri-logout-box-line"></i></div>
                    <span>Sair</span>
                  </button>
                </>
              ) : (
                <Link to="/login" className="dropdown-item">
                  <div className="dropdown-icon"><i className="ri-login-box-line"></i></div>
                  <span>Entrar</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-column">
          <h3 className="footer-title">AtermiScore</h3>
          <p className="footer-about">A plataforma definitiva para avaliação e descoberta de jogos. Conecte-se com outros jogadores e compartilhe suas opiniões.</p>
          <div className="footer-social">
            <a href="#" className="social-link"><i className="ri-facebook-fill"></i></a>
            <a href="#" className="social-link"><i className="ri-twitter-fill"></i></a>
            <a href="#" className="social-link"><i className="ri-instagram-fill"></i></a>
            <a href="#" className="social-link"><i className="ri-discord-fill"></i></a>
            <a href="#" className="social-link"><i className="ri-youtube-fill"></i></a>
          </div>
        </div>
        <div className="footer-column">
          <h3 className="footer-title">Links Rápidos</h3>
          <ul className="footer-links">
            <li><a href="#" className="footer-link">Início</a></li>
            <li><a href="#" className="footer-link">Jogos</a></li>
            <li><a href="#" className="footer-link">Ranking</a></li>
            <li><a href="#" className="footer-link">Lançamentos</a></li>
            <li><a href="#" className="footer-link">Comunidade</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3 className="footer-title">Informações</h3>
          <ul className="footer-links">
            <li><a href="#" className="footer-link">Sobre Nós</a></li>
            <li><a href="#" className="footer-link">Termos de Serviço</a></li>
            <li><a href="#" className="footer-link">Política de Privacidade</a></li>
            <li><a href="#" className="footer-link">FAQ</a></li>
            <li><a href="#" className="footer-link">Contato</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3 className="footer-title">Newsletter</h3>
          <p className="footer-newsletter-text">Inscreva-se para receber as últimas novidades e atualizações.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Seu e-mail" className="newsletter-input" />
            <button type="submit" className="newsletter-button"><i className="ri-send-plane-fill"></i></button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-copyright">
          &copy; 2023 AtermiScore. Todos os direitos reservados.
        </div>
        <div className="footer-legal">
          <a href="#" className="legal-link">Termos de Uso</a>
          <a href="#" className="legal-link">Política de Privacidade</a>
          <a href="#" className="legal-link">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
);

const MetacriticTemplate = ({ gameData }) => {
  return (
    <div className="metacritic-template">
      <Header />

      {/* Game Hero Section */}
      <div className="game-hero">
        <div className="game-hero-container">
          <div className="game-cover">
            <img src={gameData?.coverImage} alt={gameData?.title} />
          </div>
          <div className="game-info">
            <h1 className="game-title">{gameData?.title}</h1>
            {gameData?.originalTitle && <h2 className="game-original-title">{gameData.originalTitle}</h2>}
            
            <div className="game-scores">
              <div className="metascore-box">
                <div className="metascore-header">METASCORE</div>
                <div className="metascore-value highlight">{gameData?.metascore || '—'}</div>
                <div className="metascore-label">Critic reviews</div>
              </div>
              
              <div className="userscore-box">
                <div className="userscore-header">USER SCORE</div>
                <div className="userscore-value">{gameData?.userScore || '—'}</div>
                <div className="userscore-label">User reviews</div>
              </div>
            </div>
            
            <div className="game-platforms">
              {gameData?.platforms?.map((platform, index) => (
                <span key={index} className="platform-tag">{platform}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="game-content-container">
        <main className="game-main-content">
          {/* Summary Section */}
          {gameData?.summary && (
            <section className="summary-section">
              <h2 className="section-title">Summary</h2>
              <p className="game-summary">{gameData.summary}</p>
            </section>
          )}
          
          {/* Description Section */}
          {gameData?.description && (
            <section className="description-section">
              <h2 className="section-title">Description</h2>
              <p className="game-description">{gameData.description}</p>
            </section>
          )}
          
          {/* Critic Reviews */}
          <section className="reviews-section">
            <div className="section-header">
              <h2 className="section-title">Critic Reviews</h2>
              {gameData?.criticReviews && (
                <div className="section-summary">
                  <span className="review-count">{gameData.criticReviews.length} Critic Reviews</span>
                </div>
              )}
            </div>
            
            {gameData?.criticReviews?.length > 0 ? (
              <div className="reviews-grid">
                {gameData.criticReviews.map((review, index) => (
                  <div key={index} className="review-card">
                    <div className="review-header">
                      <div className="review-source">{review.source}</div>
                      <div className={`review-score ${review.score >= 90 ? "positive" : review.score >= 75 ? "mixed" : "negative"}`}>
                        {review.score}
                      </div>
                    </div>
                    <div className="review-excerpt">"{review.excerpt}"</div>
                    <div className="review-meta">
                      <span className="review-author">— {review.author}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No critic reviews available.</p>
            )}
          </section>
          
          {/* User Reviews */}
          <section className="user-reviews-section">
            <div className="section-header">
              <h2 className="section-title">User Reviews</h2>
              {gameData?.userReviews && (
                <div className="section-summary">
                  <span className="review-count">{gameData.userReviews.length} User Reviews</span>
                </div>
              )}
            </div>
            
            {gameData?.userReviews?.length > 0 ? (
              <div className="user-reviews-grid">
                {gameData.userReviews.map((review, index) => (
                  <div key={index} className="user-review-card">
                    <div className="user-review-header">
                      <div className={`user-score ${review.score >= 9 ? "positive" : review.score >= 7 ? "mixed" : "negative"}`}>
                        {review.score}
                      </div>
                      <div className="user-name">{review.username}</div>
                      <div className="review-date">{review.date}</div>
                    </div>
                    <div className="user-review-text">"{review.text}"</div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No user reviews yet. Be the first to review!</p>
            )}
          </section>
          
          {/* Media Section */}
          {(gameData?.screenshots?.length > 0 || gameData?.trailers?.length > 0) && (
            <section className="media-section">
              <h2 className="section-title">Media</h2>
              
              {/* Screenshots */}
              {gameData?.screenshots?.length > 0 && (
                <div className="screenshots-container">
                  <h3>Screenshots</h3>
                  <div className="screenshots-grid">
                    {gameData.screenshots.map((screenshot, index) => (
                      <div key={index} className="screenshot-item">
                        <img 
                          src={screenshot} 
                          alt={`${gameData.title} screenshot ${index + 1}`} 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Trailers */}
              {gameData?.trailers?.length > 0 && (
                <div className="trailers-container">
                  <h3>Trailers</h3>
                  <div className="trailers-grid">
                    {gameData.trailers.map((trailer, index) => (
                      <div key={index} className="trailer-item">
                        <div className="trailer-thumbnail">
                          <img 
                            src={trailer.thumbnail} 
                            alt={`${trailer.title} thumbnail`} 
                          />
                          <div className="play-icon">▶</div>
                        </div>
                        <div className="trailer-title">{trailer.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}
        </main>
        
        {/* Sidebar */}
        <aside className="game-sidebar">
          {/* Details Card */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">Details</h3>
            <ul className="details-list">
              <li>
                <span className="detail-label">Release Date:</span>
                <span className="detail-value">{gameData?.releaseDate || 'TBD'}</span>
              </li>
              <li>
                <span className="detail-label">Developer:</span>
                <span className="detail-value">{gameData?.developer || 'Unknown'}</span>
              </li>
              <li>
                <span className="detail-label">Publisher:</span>
                <span className="detail-value">{gameData?.publisher || 'Unknown'}</span>
              </li>
              <li>
                <span className="detail-label">Genres:</span>
                <span className="detail-value">
                  {gameData?.genres?.join(", ") || 'N/A'}
                </span>
              </li>
              {gameData?.esrbRating && (
                <li>
                  <span className="detail-label">Rating:</span>
                  <span className="detail-value">{gameData.esrbRating}</span>
                </li>
              )}
            </ul>
          </div>
          
          {/* Tags Card */}
          {gameData?.tags?.length > 0 && (
            <div className="sidebar-card">
              <h3 className="sidebar-title">Tags</h3>
              <div className="tags-container">
                {gameData.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          )}
          
          {/* Where to Buy */}
          {gameData?.stores?.length > 0 && (
            <div className="sidebar-card">
              <h3 className="sidebar-title">Where to Buy</h3>
              <div className="stores-list">
                {gameData.stores.map((store, index) => (
                  <a key={index} href={store.url} className="store-item" target="_blank" rel="noopener noreferrer">
                    <span className="store-name">{store.name}</span>
                    <span className="store-price">{store.price}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
          
          {/* Similar Games */}
          {gameData?.similarGames?.length > 0 && (
            <div className="sidebar-card">
              <h3 className="sidebar-title">Similar Games</h3>
              <div className="similar-games-list">
                {gameData.similarGames.map((game, index) => (
                  <div key={index} className="similar-game-item">
                    <img 
                      src={game.coverImage} 
                      alt={game.title} 
                      className="similar-game-cover" 
                    />
                    <div className="similar-game-info">
                      <div className="similar-game-title">{game.title}</div>
                      {game.score && <div className="similar-game-score">{game.score}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Achievements */}
          {gameData?.achievements?.length > 0 && (
            <div className="sidebar-card">
              <h3 className="sidebar-title">Achievements</h3>
              <div className="achievements-list">
                {gameData.achievements.map((achievement, index) => (
                  <div key={index} className="achievement-item">
                    <span className="achievement-name">{achievement.name}</span>
                    <span className="achievement-percent">{achievement.percent}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
      
      <Footer />
    </div>
  );
};

export default MetacriticTemplate;
