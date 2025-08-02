import React from 'react';
import './css/footer.css';

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

export default Footer;
