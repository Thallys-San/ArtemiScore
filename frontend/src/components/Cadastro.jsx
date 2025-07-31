import React, { useState, useEffect } from "react";
import "./cadastro.css";
import ProfilePicture from "./commom/ProfilePicture";

const Cadastro = () => {
  // Estados
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
    profilePicture: "",
    favoriteGenres: [],
    preferredPlatforms: [],
  });

  // Definindo os valores de gêneros e plataformas
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

  const [errors, setErrors] = useState({});
  const [charCount, setCharCount] = useState(0);
  const [profilePic, setProfilePic] = useState(
    "https://raw.githubusercontent.com/Thallys-San/ArtemiScore/main/profile_pic.png"
  );
  const [genreWarning, setGenreWarning] = useState(false);
  const [platformWarning, setPlatformWarning] = useState(false);
  const [generalError, setGeneralError] = useState("");

  // Atualiza contador de caracteres da biografia
  useEffect(() => {
    setCharCount(formData.bio.length);
  }, [formData.bio]);

  // Manipuladores de eventos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Limpa erros específicos ao modificar o campo
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file || !file.type.startsWith("image/")) {
      alert("Arquivo inválido.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Imagem maior que 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 128;
        canvas.width = maxSize;
        canvas.height = maxSize;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, maxSize, maxSize);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        setProfilePic(compressedBase64);
        setFormData((prevData) => ({
          ...prevData,
          profilePicture: compressedBase64,
        }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Validação do formulário
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Informe um nome de usuário";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Informe um e-mail válido";
    }

    if (formData.password.length < 8) {
      newErrors.password = "A senha deve ter pelo menos 8 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");

    if (!validateForm()) return;

    try {
      const userData = {
        nome: formData.username,
        email: formData.email,
        senha: formData.password,
        bio: formData.bio,
        foto_perfil: profilePic,
        preferencias_jogos: formData.favoriteGenres,
        plataformas_utilizadas: formData.preferredPlatforms,
      };

      const response = await fetch("http://localhost:8080/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao cadastrar usuário");
      }

      alert("Cadastro realizado com sucesso!");
      // Redirecionar para login ou página inicial
      // history.push('/login');
    } catch (error) {
      console.error("Erro no cadastro:", error);
      setGeneralError(error.message || "Erro ao conectar com o servidor");
    }
  };

  return (
    <div className="form-container">
      <h1 className="title">Crie Sua Conta</h1>
      <p className="subtitle">
        Junte-se à comunidade ArtemiScore e comece a explorar o universo dos
        jogos!
      </p>

      <form className="form" onSubmit={handleSubmit}>
        <fieldset>
          <div className="input-group profile-picture-container">
            <label>Foto de Perfil</label>
            <div className="avatar-upload">
              <div className="avatar-edit">
                <input
                  type="file"
                  id="avatarUpload"
                  accept=".png, .jpg, .jpeg"
                  onChange={handleImageUpload}
                />
                <label htmlFor="avatarUpload"></label>
              </div>
              <div className="avatar-preview">
                <div
                  id="avatarPreview"
                  style={{ backgroundImage: `url('${profilePic}')` }}
                ></div>
              </div>
            </div>
            <small className="form-text-hint">
              Formatos suportados: JPG, PNG, JPEG (Máx. 2MB)
            </small>
          </div>
          <div className="input-group">
            <label htmlFor="username">Nome de Usuário</label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Seu nome de usuário"
              value={formData.username}
              onChange={handleInputChange}
              required
              autoComplete="username"
            />
            {errors.username && (
              <p className="error-message">{errors.username}</p>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="seuemail@exemplo.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              autoComplete="email"
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Mínimo 8 caracteres"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength="8"
              autoComplete="new-password"
            />
            <small id="password-hint" className="form-text-hint">
              Use 8 ou mais caracteres, incluindo letras e números.
            </small>
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="confirm-password">Confirmar Senha</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirm-password"
              placeholder="Repita sua senha"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              minLength="8"
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword}</p>
            )}
          </div>
          {/* Campo de biografia com contador de caracteres */}
          <div className="input-group">
            <label htmlFor="bio">
              Biografia (opcional)
              <span className="char-count">({formData.bio.length}/300)</span>
            </label>
            <textarea
              name="bio"
              id="bio"
              rows="4"
              placeholder="Conte um pouco sobre você..."
              value={formData.bio}
              onChange={handleInputChange}
              maxLength="300"
            ></textarea>
          </div>

          {/* Campo de gêneros */}
          <fieldset className="checkbox-fieldset">
            <legend>
              Gêneros Favoritos (selecione até 5)
              <span className="select-selected-count">
                {formData.favoriteGenres.length}/5
              </span>
            </legend>

            <div className="checkbox-container">
              {genres.map((genre) => (
                <label className="checkbox-option" key={genre}>
                  <input
                    type="checkbox"
                    value={genre}
                    checked={formData.favoriteGenres.includes(genre)}
                    onChange={(e) => {
                      let newSelection = [...formData.favoriteGenres];
                      if (e.target.checked) {
                        if (newSelection.length < 5) {
                          newSelection.push(genre);
                          setGenreWarning(false);
                        } else {
                          setGenreWarning(true);
                        }
                      } else {
                        newSelection = newSelection.filter((g) => g !== genre);
                        setGenreWarning(false);
                      }
                      setFormData({
                        ...formData,
                        favoriteGenres: newSelection,
                      });
                    }}
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

          <br />

          {/* Campo de plataformas */}
          <fieldset className="checkbox-fieldset">
            <legend>Plataformas Preferidas (selecione até 3)</legend>
            <span className="select-selected-count">
              {formData.preferredPlatforms.length}/3
            </span>

            <div className="checkbox-container">
              {platforms.map((platform) => (
                <label className="checkbox-option" key={platform}>
                  <input
                    type="checkbox"
                    value={platform}
                    checked={formData.preferredPlatforms.includes(platform)}
                    onChange={(e) => {
                      let newSelection = [...formData.preferredPlatforms];
                      if (e.target.checked) {
                        if (newSelection.length < 3) {
                          newSelection.push(platform);
                          setPlatformWarning(false);
                        } else {
                          setPlatformWarning(true);
                        }
                      } else {
                        newSelection = newSelection.filter(
                          (p) => p !== platform
                        );
                        setPlatformWarning(false);
                      }
                      setFormData({
                        ...formData,
                        preferredPlatforms: newSelection,
                      });
                    }}
                  />
                  <span className="checkmark"></span>
                  {platform}
                </label>
              ))}
            </div>
            {platformWarning && (
              <small className="warning-message">
                Você pode selecionar no máximo 3 Plataformas.
              </small>
            )}
          </fieldset>
          <button className="sign" type="submit">
            Criar Conta
          </button>
          {generalError && (
            <p id="generalErrorMessage" className="error-message">
              {generalError}
            </p>
          )}
        </fieldset>
      </form>

      <br />
      <p className="login-link">
        Já tem uma conta?
        <a rel="noopener noreferrer" href="./login" className="">
          Faça Login
        </a>
      </p>
    </div>
  );
};

export default Cadastro;
