import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header>
    <div className="container header-container">
      <div className="flex items-center">
        <Link to="/" className="logo font-pacifico">AtermiScore</Link>
        <nav className="main-nav">
          <Link to="/HomePage" className="nav-link active">Início</Link>
          <Link to="/jogos" className="nav-link">Jogos</Link>
          <Link to="/ranking" className="nav-link">Ranking</Link>
          <Link to="/lancamentos" className="nav-link">Lançamentos</Link>
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
            <a href="#" className="dropdown-item">
              <div className="dropdown-icon"><i className="ri-logout-box-line"></i></div>
              <span>Sair</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
