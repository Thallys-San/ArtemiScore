import React, { useEffect, useState } from 'react';
import './css/GameFilter.css';


const GameFilter = ({ filters, onChange, onApply, onReset }) => {
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);

  useEffect(() => {
    async function fetchGenres() {
      try {
        const res = await fetch('http://localhost:8080/api/games/generos');
        if (!res.ok) throw new Error('Erro ao buscar gêneros');
        const data = await res.json();
        setGenres(data);
      } catch (error) {
        console.error(error);
      }
    }

    async function fetchPlatforms() {
      try {
        const res = await fetch('http://localhost:8080/api/games/plataformas');
        if (!res.ok) throw new Error('Erro ao buscar plataformas');
        const data = await res.json();
        setPlatforms(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchGenres();
    fetchPlatforms();
  }, []);

  return (
    <section>
      <div className="container">
      <div className="filters-container">
        <div className="filters">

          {/* Gêneros */}
          <div className="filter-group">
            <label htmlFor="genre-filter" className="filter-label">
              <i className="ri-price-tag-3-line"></i> Gênero
            </label>
            <select
              id="genre-filter"
              className="filter-select"
              value={filters.genre || ''}
              onChange={e => onChange('genre', e.target.value)}
            >
              <option value="">Todos os Gêneros</option>
              {genres.map(genre => (
                <option key={genre.id} value={genre.slug || genre.name}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          {/* Plataformas */}
          <div className="filter-group">
            <label htmlFor="platform-filter" className="filter-label">
              <i className="ri-computer-line"></i> Plataforma
            </label>
            <select
              id="platform-filter"
              className="filter-select"
              value={filters.platform || ''}
              onChange={e => onChange('platform', e.target.value)}
            >
              <option value="">Todas as Plataformas</option>
              {platforms.map(platform => (
                <option key={platform.id} value={platform.slug || platform.name}>
                  {platform.name}
                </option>
              ))}
            </select>
          </div>

          {/* Ordenação */}
          <div className="filter-group">
            <label htmlFor="sort-by" className="filter-label">
              <i className="ri-sort-desc"></i> Ordenar por
            </label>
            <select
              id="sort-by"
              className="filter-select"
              value={filters.sort || 'relevance'}
              onChange={e => onChange('sort', e.target.value)}
            >
              <option value="relevance">Relevância</option>
              <option value="rating">Melhor Avaliados</option>
              <option value="newest">Mais Recentes</option>
              <option value="oldest">Mais Antigos</option>
            </select>
          </div>

          <button className="btn btn-primary filter-button" onClick={onApply}>
            <i className="ri-filter-line"></i> Aplicar Filtros
          </button>

          <button className="btn btn-secondary filter-button" onClick={onReset}>
            <i className="ri-close-line"></i> Limpar
          </button>
        </div>
      </div>
      </div>
    </section>
  );
};

export default GameFilter;
