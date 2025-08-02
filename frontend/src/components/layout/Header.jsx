import React from 'react';
import './css/header.css';


const Header = () => (
  <header>
    <div className="container header-container">
      <div className="flex items-center">
        <a href="#" className="logo font-pacifico">AtermiScore</a>
        <nav className="main-nav">
          <a href="HomePage.jsx" className="nav-link active">Início</a>
          <a href="Jogos.jsx" className="nav-link">Jogos</a>
          <a href="rank.jsx" className="nav-link">Ranking</a>
          <a href="lancamentos.jsx" className="nav-link">Lançamentos</a>
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
            <a href="perfil.html" className="dropdown-item"><div className="dropdown-icon"><i className="ri-user-3-line"></i></div><span>Meu Perfil</span></a>
            <a href="MInhasavaliações.html" className="dropdown-item"><div className="dropdown-icon"><i className="ri-star-line"></i></div><span>Minhas Avaliações</span></a>
            <a href="Jogosfavoritos.html" className="dropdown-item"><div className="dropdown-icon"><i className="ri-heart-line"></i></div><span>Jogos Favoritos</span></a>
            <a href="configurações.html" className="dropdown-item"><div className="dropdown-icon"><i className="ri-settings-3-line"></i></div><span>Configurações</span></a>
            <div className="dropdown-divider"></div>
            <a href="#" className="dropdown-item"><div className="dropdown-icon"><i className="ri-logout-box-line"></i></div><span>Sair</span></a>
          </div>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
