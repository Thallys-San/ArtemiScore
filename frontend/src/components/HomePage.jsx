import React, { useEffect } from 'react';

export default function HomePage() {
      useEffect(() => {
    document.title = "AtermiScore - Início";
  }, []);

  return (
    <>
      <header>
        <div className="container header-container">
          <div className="flex items-center">
            <a href="/" className="logo font-pacifico">AtermiScore</a>
            <nav className="main-nav">
              <a href="/" className="nav-link active">Início</a>
              <a href="/Jogos" className="nav-link">Jogos</a>
              <a href="/rank" className="nav-link">Ranking</a>
              <a href="/lancamentos" className="nav-link">Lançamentos</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="search-bar">
              <input type="text" placeholder="Buscar jogos..." className="search-input" />
              <div className="search-icon">
                <i className="ri-search-line"></i>
              </div>
            </div>
            <div className="relative" id="userMenuContainer">
              <div className="user-menu-button" id="userMenuButton">
                <i className="ri-user-line user-icon"></i>
              </div>
              <div className="user-dropdown" id="userDropdownMenu">
                <a href="/perfil" className="dropdown-item">
                  <div className="dropdown-icon"><i className="ri-user-3-line"></i></div>
                  <span>Meu Perfil</span>
                </a>
                <a href="/minhas-avaliacoes" className="dropdown-item">
                  <div className="dropdown-icon"><i className="ri-star-line"></i></div>
                  <span>Minhas Avaliações</span>
                </a>
                <a href="/jogos-favoritos" className="dropdown-item">
                  <div className="dropdown-icon"><i className="ri-heart-line"></i></div>
                  <span>Jogos Favoritos</span>
                </a>
                <a href="/configuracoes" className="dropdown-item">
                  <div className="dropdown-icon"><i className="ri-settings-3-line"></i></div>
                  <span>Configurações</span>
                </a>
                <div className="dropdown-divider"></div>
                <a href="/logout" className="dropdown-item">
                  <div className="dropdown-icon"><i className="ri-logout-box-line"></i></div>
                  <span>Sair</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main>
        <section className="hero-banner">
          <div className="hero-slide active">
            <div className="hero-background">
              <img
                src="https://cdn1.epicgames.com/b30b6d1b4dfd4dcc93b5490be5e094e5/offer/RDR2476298253_Epic_Games_Wishlist_RDR2_2560x1440_V01-2560x1440-2a9ebe1f7ee202102555be202d5632ec.jpg"
                alt="Destaque"
                className="hero-image"
              />
              <div className="hero-overlay"></div>
            </div>
            <div className="hero-container">
              <div className="hero-content">
                <span className="hero-tag">DESTAQUE DA SEMANA</span>
                <h1 className="hero-title">Red Dead Redemption 2</h1>
                <div className="hero-rating">
                  <div className="star-rating">
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                  </div>
                  <span className="rating-text">5 (692,459 Avaliações)</span>
                </div>
                <p className="hero-description">
                  Aqui estaria a descrição completa do jogo de destaque da semana com detalhes impressionantes sobre a jogabilidade e inovações.
                </p>
                <div className="hero-buttons">
                  <button className="hero-button primary-button">
                    <i className="ri-information-line"></i> Ver Detalhes
                  </button>
                  <button className="hero-button secondary-button">
                    <i className="ri-star-line"></i> Avaliar Agora
                  </button>
                </div>
              </div>
            </div>
            <div className="hero-indicators">
              <button className="indicator active"></button>
              <button className="indicator"></button>
              <button className="indicator"></button>
              <button className="indicator"></button>
            </div>
          </div>
        </section>
        <section className="popular-games">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Jogos Populares</h2>
              <a href="/jogos-populares" className="view-all">
                Ver todos<i className="ri-arrow-right-line view-all-icon"></i>
              </a>
            </div>
            <div id="game-container" className="games-grid">
              {/* Cards carregados via JavaScript */}
            </div>
          </div>
        </section>
        <section className="upcoming-releases">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Próximos Lançamentos</h2>
              <a href="/lancamentos" className="view-all">
                Ver todos<i className="ri-arrow-right-line view-all-icon"></i>
              </a>
            </div>
            <div id="releases-container" className="releases-slider">
              {/* Cards futuros via JS */}
            </div>
          </div>
        </section>
        <section className="top-rated">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Melhores Avaliados</h2>
              <a href="/melhores-avaliados" className="view-all">
                Ver todos<i className="ri-arrow-right-line view-all-icon"></i>
              </a>
            </div>
            <div className="top-rated-grid">{/* Conteúdo aqui */}</div>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-column">
              <h3 className="footer-title">AtermiScore</h3>
              <p className="footer-about">
                A plataforma definitiva para avaliação e descoberta de jogos. Conecte-se com outros jogadores e compartilhe suas opiniões.
              </p>
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
                <li><a href="/" className="footer-link">Início</a></li>
                <li><a href="/jogos" className="footer-link">Jogos</a></li>
                <li><a href="/ranking" className="footer-link">Ranking</a></li>
                <li><a href="/lancamentos" className="footer-link">Lançamentos</a></li>
                <li><a href="/comunidade" className="footer-link">Comunidade</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3 className="footer-title">Informações</h3>
              <ul className="footer-links">
                <li><a href="/sobre" className="footer-link">Sobre Nós</a></li>
                <li><a href="/termos" className="footer-link">Termos de Serviço</a></li>
                <li><a href="/privacidade" className="footer-link">Política de Privacidade</a></li>
                <li><a href="/faq" className="footer-link">FAQ</a></li>
                <li><a href="/contato" className="footer-link">Contato</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3 className="footer-title">Newsletter</h3>
              <p className="footer-newsletter-text">Inscreva-se para receber as últimas novidades e atualizações.</p>
              <form className="newsletter-form">
                <input type="email" placeholder="Seu e-mail" className="newsletter-input" />
                <button type="submit" className="newsletter-button">
                  <i className="ri-send-plane-fill"></i>
                </button>
              </form>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copyright">
              &copy; 2023 AtermiScore. Todos os direitos reservados.
            </div>
            <div className="footer-legal">
              <a href="/termos" className="legal-link">Termos de Uso</a>
              <a href="/privacidade" className="legal-link">Política de Privacidade</a>
              <a href="/cookies" className="legal-link">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
