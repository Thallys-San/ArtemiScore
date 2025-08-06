import React from 'react';
import '../components/layout/css/GameDetail.css';

const MetacriticTemplate = () => {
  // Todos esses dados serão preenchidos pela API
  const gameData = {
    title: "",               // Título do jogo
    originalTitle: "",       // Título original
    coverImage: "",          // URL da imagem de capa
    releaseDate: "",         // Data de lançamento
    platforms: [],           // Plataformas disponíveis
    developer: "",           // Desenvolvedor
    publisher: "",           // Publicador
    genres: [],              // Gêneros
    metascore: null,         // Pontuação Metacritic (0-100)
    userScore: null,         // Pontuação dos usuários (0-10)
    criticReviews: [],       // Críticas profissionais
    userReviews: [],         // Avaliações de usuários
    summary: "",             // Resumo do jogo
    description: "",         // Descrição detalhada
    esrbRating: "",          // Classificação etária
    screenshots: [],         // Screenshots
    trailers: [],            // Trailers
    tags: [],                // Tags
    stores: [],              // Lojas para compra
    similarGames: [],        // Jogos similares
    achievements: []         // Conquistas
  };

  return (
    <div className="metacritic-template">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb">
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/games">Games</a></li>
          <li aria-current="page">{gameData.title || "Game Title"}</li>
        </ol>
      </nav>

      {/* Game Header */}
      <header className="game-header">
        <div className="game-cover-container">
          <img 
            src={gameData.coverImage || "https://via.placeholder.com/250x330?text=Game+Cover"} 
            alt={`${gameData.title} cover`} 
            className="game-cover" 
          />
        </div>
        
        <div className="game-info">
          <h1 className="game-title">{gameData.title || "Game Title"}</h1>
          {gameData.originalTitle && (
            <h2 className="game-original-title">{gameData.originalTitle}</h2>
          )}
          
          <div className="game-platforms">
            {gameData.platforms.length > 0 ? (
              gameData.platforms.map((platform, index) => (
                <span key={index} className="platform-tag">
                  {platform}
                </span>
              ))
            ) : (
              <span className="platform-tag">Platform Name</span>
            )}
          </div>
          
          <div className="game-meta">
            <span className="developer">{gameData.developer || "Developer Name"}</span>
            <span className="separator">|</span>
            <span className="release-date">{gameData.releaseDate || "Release Date"}</span>
            {gameData.esrbRating && (
              <>
                <span className="separator">|</span>
                <span className="esrb-rating">{gameData.esrbRating}</span>
              </>
            )}
          </div>
        </div>
        
        <div className="game-scores">
          <div className="score-container">
            <h3>Metascore</h3>
            <div className="metascore">
              {gameData.metascore !== null ? gameData.metascore : "—"}
            </div>
            <div className="score-details">
              {gameData.criticReviews.length > 0 ? 
                `${gameData.criticReviews.length} critic reviews` : 
                "No critic reviews"}
            </div>
          </div>
          
          <div className="score-container">
            <h3>User Score</h3>
            <div className="user-score">
              {gameData.userScore !== null ? gameData.userScore.toFixed(1) : "—"}
            </div>
            <div className="score-details">
              {gameData.userReviews.length > 0 ? 
                `${gameData.userReviews.length} user ratings` : 
                "No user ratings"}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="game-content-container">
        <main className="game-main-content">
          {/* Summary Section */}
          <section className="summary-section">
            <h2 className="section-title">Summary</h2>
            <p className="game-summary">
              {gameData.summary || "Game summary will appear here once loaded from API."}
            </p>
          </section>
          
          {/* Description Section */}
          <section className="description-section">
            <h2 className="section-title">Description</h2>
            <p className="game-description">
              {gameData.description || "Detailed game description will appear here once loaded from API."}
            </p>
          </section>
          
          {/* Critic Reviews */}
          <section className="reviews-section">
            <h2 className="section-title">Critic Reviews</h2>
            <div className="reviews-grid">
              {gameData.criticReviews.length > 0 ? (
                gameData.criticReviews.map((review, index) => (
                  <div key={index} className="review-card">
                    <div className="review-header">
                      <div className="review-source">{review.source || "Review Source"}</div>
                      <div className="review-score">{review.score || "—"}</div>
                    </div>
                    <div className="review-excerpt">
                      "{review.excerpt || "Review excerpt will appear here."}"
                    </div>
                    <div className="review-meta">
                      <span className="review-author">— {review.author || "Author"}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No critic reviews available.</p>
              )}
            </div>
          </section>
          
          {/* User Reviews */}
          <section className="user-reviews-section">
            <h2 className="section-title">User Reviews</h2>
            <div className="user-reviews-grid">
              {gameData.userReviews.length > 0 ? (
                gameData.userReviews.map((review, index) => (
                  <div key={index} className="user-review-card">
                    <div className="user-review-header">
                      <div className="user-score-small">{review.score || "—"}</div>
                      <div className="user-name">{review.username || "User"}</div>
                      <div className="review-date">{review.date || "Date"}</div>
                    </div>
                    <div className="user-review-text">
                      "{review.text || "User review text will appear here."}"
                    </div>
                  </div>
                ))
              ) : (
                <p>No user reviews yet. Be the first to review!</p>
              )}
            </div>
          </section>
          
          {/* Media Section */}
          <section className="media-section">
            <h2 className="section-title">Media</h2>
            
            {/* Screenshots */}
            <div className="screenshots-container">
              <h3>Screenshots</h3>
              <div className="screenshots-grid">
                {gameData.screenshots.length > 0 ? (
                  gameData.screenshots.map((screenshot, index) => (
                    <div key={index} className="screenshot-item">
                      <img 
                        src={screenshot} 
                        alt={`${gameData.title} screenshot ${index + 1}`} 
                      />
                    </div>
                  ))
                ) : (
                  <p>No screenshots available.</p>
                )}
              </div>
            </div>
            
            {/* Trailers */}
            <div className="trailers-container">
              <h3>Trailers</h3>
              <div className="trailers-grid">
                {gameData.trailers.length > 0 ? (
                  gameData.trailers.map((trailer, index) => (
                    <div key={index} className="trailer-item">
                      <div className="trailer-thumbnail">
                        <img 
                          src={trailer.thumbnail} 
                          alt={`${trailer.title} thumbnail`} 
                        />
                        <div className="play-icon">▶</div>
                      </div>
                      <div className="trailer-title">{trailer.title || "Trailer"}</div>
                    </div>
                  ))
                ) : (
                  <p>No trailers available.</p>
                )}
              </div>
            </div>
          </section>
        </main>
        
        {/* Sidebar */}
        <aside className="game-sidebar">
          {/* Details Card */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">Details</h3>
            <ul className="details-list">
              <li>
                <span className="detail-label">Release Date:</span>
                <span className="detail-value">{gameData.releaseDate || "TBD"}</span>
              </li>
              <li>
                <span className="detail-label">Developer:</span>
                <span className="detail-value">{gameData.developer || "Unknown"}</span>
              </li>
              <li>
                <span className="detail-label">Publisher:</span>
                <span className="detail-value">{gameData.publisher || "Unknown"}</span>
              </li>
              <li>
                <span className="detail-label">Genres:</span>
                <span className="detail-value">
                  {gameData.genres.length > 0 ? gameData.genres.join(", ") : "N/A"}
                </span>
              </li>
              <li>
                <span className="detail-label">Rating:</span>
                <span className="detail-value">{gameData.esrbRating || "Rating Pending"}</span>
              </li>
            </ul>
          </div>
          
          {/* Tags Card */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">Tags</h3>
            <div className="tags-container">
              {gameData.tags.length > 0 ? (
                gameData.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))
              ) : (
                <span className="tag">Tag</span>
              )}
            </div>
          </div>
          
          {/* Where to Buy */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">Where to Buy</h3>
            <div className="stores-list">
              {gameData.stores.length > 0 ? (
                gameData.stores.map((store, index) => (
                  <a key={index} href={store.url || "#"} className="store-item">
                    <span className="store-name">{store.name || "Store"}</span>
                    <span className="store-price">{store.price || "$—"}</span>
                  </a>
                ))
              ) : (
                <a href="#" className="store-item">
                  <span className="store-name">Store Name</span>
                  <span className="store-price">$—</span>
                </a>
              )}
            </div>
          </div>
          
          {/* Similar Games */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">Similar Games</h3>
            <div className="similar-games-list">
              {gameData.similarGames.length > 0 ? (
                gameData.similarGames.map((game, index) => (
                  <a key={index} href="#" className="similar-game-item">
                    <img 
                      src={game.coverImage || "https://via.placeholder.com/50x70?text=Game"} 
                      alt={game.title} 
                      className="similar-game-cover" 
                    />
                    <div className="similar-game-info">
                      <div className="similar-game-title">{game.title || "Game Title"}</div>
                      <div className="similar-game-score">{game.score || "—"}</div>
                    </div>
                  </a>
                ))
              ) : (
                <a href="#" className="similar-game-item">
                  <img 
                    src="https://via.placeholder.com/50x70?text=Game" 
                    alt="Similar Game" 
                    className="similar-game-cover" 
                  />
                  <div className="similar-game-info">
                    <div className="similar-game-title">Similar Game</div>
                    <div className="similar-game-score">—</div>
                  </div>
                </a>
              )}
            </div>
          </div>
          
          {/* Achievements */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">Achievements</h3>
            <div className="achievements-list">
              {gameData.achievements.length > 0 ? (
                gameData.achievements.map((achievement, index) => (
                  <div key={index} className="achievement-item">
                    <span className="achievement-name">{achievement.name || "Achievement"}</span>
                    <span className="achievement-percent">{achievement.percent || "—"}%</span>
                  </div>
                ))
              ) : (
                <div className="achievement-item">
                  <span className="achievement-name">Achievement Name</span>
                  <span className="achievement-percent">—%</span>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MetacriticTemplate;
