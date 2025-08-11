import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../components/layout/css/GameDetails.css';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const MetacriticTemplate = ({ gameData }) => {
  return (
    <div className="metacritic-template">
      <Header />
      
      <div className="game-content-wrapper">
        {/* Game Hero Section */}
        <div className="game-hero">
          <div className="game-hero-container">
            <div className="game-cover">
              <img src={gameData?.background_image} alt={gameData?.name} />
            </div>
            <div className="game-info">
              <h1 className="game-title">{gameData?.name}</h1>
              {gameData?.name_original && <h2 className="game-original-title">{gameData.name_original}</h2>}

              <div className="game-title">
                <span className="game-title">{gameData?.metacriticScore || ""}</span>
                <span className="game-title">Metacritic</span>
              </div>

              <div className="game-description">
                <p className="game-description-text">{gameData?.description_raw || 'No description available.'}</p>
              </div>

              <div className="userscore-box">
                <div className="userscore-header">SCORE</div>
                <div className="userscore-value">{gameData?.userScore || '—'}</div>
                <div className="review-count">Reviews: {gameData?.totalAvaliacoes || '—'}</div>
              </div>

              <div className="game-platforms">
                {gameData?.platforms?.map((platform, index) => (
                  <span key={index} className="platform-tag">{platform.platform.name}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="game-content-container">
          <main className="game-main-content">
            {/* Summary Section */}
            {gameData?.description && (
              <section className="summary-section">
                <h2 className="section-title">Summary</h2>
                <p className="game-summary">{gameData.description}</p>
              </section>
            )}
            
            {/* Description Section */}
            {gameData?.description_raw && (
              <section className="description-section">
                <h2 className="section-title">Description</h2>
                <p className="game-description">{gameData.description_raw}</p>
              </section>
            )}

            {/* User Reviews Section */}
            <section className="user-reviews-section">
              <div className="section-header">
                <h2 className="section-title">Reviews</h2>
                {gameData?.avaliacoes?.length > 0 && (
                  <div className="section-summary">
                    <span className="review-count">{gameData.avaliacoes.length} Reviews</span>
                  </div>
                )}
              </div>

              {gameData?.avaliacoes?.length > 0 ? (
                <div className="user-reviews-grid">
                  {gameData.avaliacoes.map((review, index) => (
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
                <p>No reviews yet. Be the first to review!</p>
              )}
            </section>

            {/* Media Section */}
            {(gameData?.screenshots?.length > 0 || gameData?.clip) && (
              <section className="media-section">
                <h2 className="section-title">Media</h2>
                
                {/* Screenshots */}
                {gameData?.screenshots && (
                  <div className="screenshots-container">
                    <h3>Screenshots</h3>
                    <div className="screenshots-grid">
                      {gameData.screenshots.map((screenshot, index) => (
                        <div key={index} className="screenshot-item">
                          <img 
                            src={screenshot} 
                            alt={`${gameData.name} screenshot ${index + 1}`} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Trailers */}
                {gameData?.clip && (
                  <div className="trailers-container">
                    <h3>Trailers</h3>
                    <div className="trailers-grid">
                      <div className="trailer-item">
                        <div className="trailer-thumbnail">
                          <img 
                            src={gameData.clip.thumbnail} 
                            alt={`${gameData.name} trailer`} 
                          />
                          <div className="play-icon">▶</div>
                        </div>
                        <div className="trailer-title">{gameData.clip.title}</div>
                      </div>
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
                  <span className="label">Release Date:</span>
                  <span className="detail-value">{gameData?.released || 'TBD'}</span>
                </li>
                <li>
                  <span className="label">Developer:</span>
                  <span className="detail-value">{gameData?.developers?.map(dev => dev.name).join(", ") || 'Unknown'}</span>
                </li>
                <li>
                  <span className="label">Publisher:</span>
                  <span className="detail-value">{gameData?.publishers?.map(pub => pub.name).join(", ") || 'Unknown'}</span>
                </li>
                <li>
                  <span className="label">Genres:</span>
                  <span className="detail-value">
                    {gameData?.genres?.map(genre => genre.name).join(", ") || 'N/A'}
                  </span>
                </li>
                {gameData?.esrb_rating && (
                  <li>
                    <span className="label">Rating:</span>
                    <span className="detail-value">{gameData.esrb_rating}</span>
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
                    <span key={index} className="tag">{tag.name}</span>
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
                      <span className="store-name">{store.store.name}</span>
                      <span className="store-price">{store.price || 'Check price'}</span>
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
