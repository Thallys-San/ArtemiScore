import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../layout/css/header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("token");
  const [activeLink, setActiveLink] = useState("");

  // Função para verificar se um link está ativo
  const isActive = (linkName) => {
    return activeLink === linkName;
  };

  // Atualiza o link ativo quando a rota muda
  useEffect(() => {
    const path = location.pathname;
    
    if (path === "/home" || path === "/") {
      setActiveLink("home");
    } else if (path === "/jogos") {
      setActiveLink("jogos");
    } else if (path === "/ranking") {
      setActiveLink("ranking");
    } else if (path === "/Lancamentos") {
      setActiveLink("Lancamentos");
    } else {
      setActiveLink("");
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header>
      <div className="container header-container">
        <div className="flex items-center">
          <Link to="/" className="logo font-pacifico">AtermiScore</Link>
          <nav className="main-nav">
            <Link 
              to="/home" 
              className={`nav-link ${isActive("home") ? "active" : ""}`}
            >
              Início
            </Link>
            <Link 
              to="/jogos" 
              className={`nav-link ${isActive("jogos") ? "active" : ""}`}
            >
              Jogos
            </Link>
            <Link 
              to="/ranking" 
              className={`nav-link ${isActive("ranking") ? "active" : ""}`}
            >
              Ranking
            </Link>
            <Link 
              to="/Lancamentos" 
              className={`nav-link ${isActive("Lancamentos") ? "active" : ""}`}
            >
              Lançamentos
            </Link>
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

export default Header;
