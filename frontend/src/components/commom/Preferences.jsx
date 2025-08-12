import React, { useState } from "react";
import "../layout/css/preferences.css"

const Preferences = ({
  favoriteGenres = [],
  setFavoriteGenres,
  preferredPlatforms = [],
  setPreferredPlatforms,
}) => {
  const genres = [
    "Ação",
    "FPS",
    "Battle royale",
    "PVP",
    "Super-herói",
    "Aventura",
    "RPG",
    "Estratégia",
    "Simulação",
    "Indie",
    "Esporte",
    "Corrida",
    "Luta",
    "Terror",
    "Puzzle",
  ];

  const platforms = ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"];

  const [genreWarning, setGenreWarning] = useState(false);
  const [platformWarning, setPlatformWarning] = useState(false);

  const toggleGenre = (genre) => {
    let newSelection = [...favoriteGenres];
    if (newSelection.includes(genre)) {
      newSelection = newSelection.filter((g) => g !== genre);
      setGenreWarning(false);
    } else {
      if (newSelection.length < 5) {
        newSelection.push(genre);
        setGenreWarning(false);
      } else {
        setGenreWarning(true);
      }
    }
    setFavoriteGenres(newSelection);
  };

  const togglePlatform = (platform) => {
    let newSelection = [...preferredPlatforms];
    if (newSelection.includes(platform)) {
      newSelection = newSelection.filter((p) => p !== platform);
      setPlatformWarning(false);
    } else {
      if (newSelection.length < 3) {
        newSelection.push(platform);
        setPlatformWarning(false);
      } else {
        setPlatformWarning(true);
      }
    }
    setPreferredPlatforms(newSelection);
  };

  return (
    <div>
      <fieldset className="checkbox-fieldset">
        <legend>
          Gêneros Favoritos (selecione até 5){" "}
          <span className="select-selected-count">
            {favoriteGenres.length}/5
          </span>
        </legend>
        <div className="checkbox-container">
          {genres.map((genre) => (
            <label className="checkbox-option" key={genre}>
              <input
                type="checkbox"
                value={genre}
                checked={favoriteGenres.includes(genre)}
                onChange={() => toggleGenre(genre)}
              />
              <span className="checkmark"></span>
              {genre}
            </label>
          ))}
        </div>
        {genreWarning && (
          <small className="warning-message">
            Você pode selecionar no máximo 5 gêneros.
          </small>
        )}
      </fieldset>

      <fieldset className="checkbox-fieldset" style={{ marginTop: "1.5rem" }}>
        <legend>
          Plataformas Preferidas (selecione até 3){" "}
          <span className="select-selected-count">
            {preferredPlatforms.length}/3
          </span>
        </legend>
        <div className="checkbox-container">
          {platforms.map((platform) => (
            <label className="checkbox-option" key={platform}>
              <input
                type="checkbox"
                value={platform}
                checked={preferredPlatforms.includes(platform)}
                onChange={() => togglePlatform(platform)}
              />
              <span className="checkmark"></span>
              {platform}
            </label>
          ))}
        </div>
        {platformWarning && (
          <small className="warning-message">
            Você pode selecionar no máximo 3 plataformas.
          </small>
        )}
      </fieldset>
    </div>
  );
};

export default Preferences;
