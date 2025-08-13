import React from 'react';
import './css/footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        {/* Coluna 1 - Brand */}
        <div className="footer-brand">
          <h1>ArtermiScore</h1>
          <p>
            A plataforma definitiva para avaliação completa e descoberta de jogos. <br />
            Explore recomendações baseadas no seu gosto e no feedback da comunidade. <br />
            Conecte-se com outros jogadores ao redor do mundo para trocar experiências, <br />
            compartilhar opiniões honestas e encontrar os melhores títulos para você.
          </p>
        </div>

        {/* Coluna 2 - Links Úteis */}
        <div className="footer-links">
          <h3 className="footer-title">LINKS ÚTEIS</h3>
          <div className="footer-links-table">
            <div className="footer-table-row">
              <a href="#" className="footer-link">FAQ</a>
            </div>
            <div className="footer-table-row">
              <a href="#" className="footer-link">Política de Privacidade</a>
            </div>
            <div className="footer-table-row">
              <a href="#" className="footer-link">Termos de Serviço</a>
            </div>
          </div>
        </div>

        {/* Coluna 3 - Contato */}
        <div className="footer-contact">
          <h3 className="footer-title">CONTATO</h3>
          <div className="contact-info">
            <p>Minas Gerais, MG, Brasil</p>
            <p>artemiscore67@gmail.com</p>
          </div>
        </div>
      </div>

      {/* Footer bottom - Copyright */}
      <div className="footer-bottom">
        <div className="footer-copyright">
          © {new Date().getFullYear()} Copyright: AtermiScore.com
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
