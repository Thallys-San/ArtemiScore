import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./css/header.css";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado de login

  const handleLogout = () => {
    // Aqui você pode limpar tokens ou chamar API, etc
    setIsLoggedIn(false);
  };

  return (
    <header>
      <div className="container header-container">
        <div className="flex items-center">
          <Link to="/" className="logo font-pacifico">
            AtermiScore
          </Link>
          <nav className="main-nav">
            <Link to="/home" className="nav-link active">
              Início
            </Link>
            <Link to="/jogos" className="nav-link">
              Jogos
            </Link>
            <Link to="/ranking" className="nav-link">
              Ranking
            </Link>
            <Link to="/Lancamentos" className="nav-link">
              Lançamentos
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar jogos..."
              className="search-input"
            />
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
                    <div className="dropdown-icon">
                      <i className="ri-user-3-line"></i>
                    </div>
                    <span>Meu Perfil</span>
                  </Link>
                  <Link to="/minhasavaliacoes" className="dropdown-item">
                    <div className="dropdown-icon">
                      <i className="ri-star-line"></i>
                    </div>
                    <span>Minhas Avaliações</span>
                  </Link>
                  <Link to="/jogosfavoritos" className="dropdown-item">
                    <div className="dropdown-icon">
                      <i className="ri-heart-line"></i>
                    </div>
                    <span>Jogos Favoritos</span>
                  </Link>
                  <Link to="/configuracoes" className="dropdown-item">
                    <div className="dropdown-icon">
                      <i className="ri-settings-3-line"></i>
                    </div>
                    <span>Configurações</span>
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item button-logout"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, font: "inherit", color: "inherit" }}
                  >
                    <div className="dropdown-icon">
                      <i className="ri-logout-box-line"></i>
                    </div>
                    <span>Sair</span>
                  </button>
                </>
              ) : (
                <Link to="/login" className="dropdown-item">
                  <div className="dropdown-icon">
                    <i className="ri-login-box-line"></i>
                  </div>
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

export default Header;
