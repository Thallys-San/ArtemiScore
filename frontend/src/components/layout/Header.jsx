import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./css/header.css";
import { AuthContext } from "../AuthContext"; // supondo que você tenha isso para autenticação

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");
  const { isAuthenticated, logout } = useContext(AuthContext);

  // Atualiza o link ativo com base no path
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    // Ajuste para corresponder aos nomes usados no nav links
    if (path.includes("/home") || path === "/") setActiveLink("home");
    else if (path.includes("/jogos")) setActiveLink("jogos");
    else if (path.includes("/ranking")) setActiveLink("ranking");
    else if (path.includes("/lancamentos")) setActiveLink("lancamentos");
    else setActiveLink("");
  }, [location]);

  const isActive = (linkName) => activeLink === linkName;

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (logout) logout(); // caso tenha logout no context
    navigate("/login");
  };

  return (
    <header>
      <div className="container header-container">
        <div className="flex items-center">
          <Link to="/" className="logo" aria-label="ArtemiScore">
            <img
              src="https://raw.githubusercontent.com/Thallys-San/ArtemiScore/main/ArtemiScoreLogo.png"
              alt="ArtemiScore Logo"
              className="logo-image"
              width="180"
              height="40"
            />
          </Link>
          <nav className="main-nav">
            <Link to="/home" className={`nav-link ${isActive("home") ? "active" : ""}`}>
              Início
            </Link>
            <Link to="/jogos" className={`nav-link ${isActive("jogos") ? "active" : ""}`}>
              Jogos
            </Link>
            <Link to="/ranking" className={`nav-link ${isActive("ranking") ? "active" : ""}`}>
              Ranking
            </Link>
            <Link
              to="/lancamentos"
              className={`nav-link ${isActive("lancamentos") ? "active" : ""}`}
            >
              Lançamentos
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <button onClick={handleLogout} className="dropdown-item button-logout">
              <div className="dropdown-icon">
                <i className="ri-logout-box-line"></i>
              </div>
              <span>Sair</span>
            </button>
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
    </header>
  );
};

export default Header;
