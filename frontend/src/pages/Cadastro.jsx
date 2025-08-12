import React, { useState, useEffect } from "react";
import "../components/layout/css/cadastro.css";
import ProfilePicture from "../components/commom/ProfilePicture";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth } from "../components/firebase";
import {
  createUserWithEmailAndPassword,
  getIdToken,
  sendEmailVerification,
} from "firebase/auth";
import Preferences from "../components/commom/Preferences";
import { toast } from "react-toastify";

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



  const [errors, setErrors] = useState({});
  const [charCount, setCharCount] = useState(0);
  const [profilePic, setProfilePic] = useState(
    "https://raw.githubusercontent.com/Thallys-San/ArtemiScore/main/profile_pic.png"
  );
  const [genreWarning, setGenreWarning] = useState(false);
  const [platformWarning, setPlatformWarning] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "A senha deve ter pelo menos 8 caracteres";
    } else if (!/[A-Z]/.test(password)) {
      return "A senha deve conter ao menos uma letra maiúscula";
    } else if (!/[0-9]/.test(password)) {
      return "A senha deve conter ao menos um número";
    } else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
      return "A senha deve conter ao menos um caractere especial";
    }
    return ""; // válida
  };

  // Validação do formulário
  // Validação do formulário
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Informe um nome de usuário";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Informe um e-mail válido";
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = async (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };

    switch (name) {
      case "username":
        if (!value.trim()) {
          newErrors.username = "Informe um nome de usuário";
        } else {
          // Verifica duplicidade no backend
          try {
            const res = await fetch(
              `http://localhost:8080/api/usuarios/check-username?username=${value}`
            );
            const data = await res.json();
            if (data.exists) {
              newErrors.username = "Nome de usuário já está em uso";
            } else {
              delete newErrors.username;
            }
          } catch (err) {
            newErrors.username = "Erro ao verificar nome de usuário";
          }
        }
        break;

      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Informe um e-mail válido";
        } else {
          // Verifica duplicidade no backend
          try {
            const res = await fetch(
              `http://localhost:8080/api/usuarios/check-email?email=${value}`
            );
            const data = await res.json();
            if (data.exists) {
              newErrors.email = "E-mail já está em uso";
            } else {
              delete newErrors.email;
            }
          } catch (err) {
            newErrors.email = "Erro ao verificar e-mail";
          }
        }
        break;

      case "password":
        const passwordError = validatePassword(value);
        if (passwordError) {
          newErrors.password = passwordError;
        } else {
          delete newErrors.password;
        }
        break;

      case "confirmPassword":
        if (value !== formData.password) {
          newErrors.confirmPassword = "As senhas não coincidem";
        } else {
          delete newErrors.confirmPassword;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  // Submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Chama a validação
    const isValid = validateForm();
    if (!isValid) {
      toast.warning("Preencha todos os campos obrigatórios corretamente!");
      return; // Se não for válido, para a execução
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;
      await sendEmailVerification(user);
      const idToken = await user.getIdToken();

      const userData = {
        uid: user.uid, // <-- adicionado
        nome: formData.username,
        email: formData.email,
        bio: formData.bio,
        senha: formData.password, // veja observação para talvez remover
        foto_perfil: profilePic,
        preferencias_jogos: formData.favoriteGenres,
        plataformas_utilizadas: formData.preferredPlatforms,
      };

      const response = await fetch("http://localhost:8080/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          setGeneralError(errorData.message || "Usuário já existe");
        } else {
          setGeneralError("Erro ao cadastrar usuário");
        }
        return;
      }

      toast.success(
        "Cadastro realizado com sucesso! Verifique seu e-mail antes de fazer login."
      );
      navigate("/login");
    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert("Erro ao cadastrar usuário: " + error.message);
    }
  };

  const getInputClass = (fieldName) => {
    if (errors[fieldName]) {
      return "input-error";
    }
    if (formData[fieldName] && !errors[fieldName]) {
      return "input-success";
    }
    return "";
  };

  return (
    <div className="cadastro-container">
      <div className="form-container">
        <h1 className="title">Crie Sua Conta</h1>
        <p className="subtitle">
          Junte-se à comunidade ArtemiScore e comece a explorar o universo dos
          jogos!
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <fieldset>
            <div className="input-group profile-picture-container">
              <ProfilePicture onAvatarChange={setProfilePic}></ProfilePicture>
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
                onBlur={handleBlur}
                required
                autoComplete="username"
                className={getInputClass("username")}
              />
              {errors.username && (
                <p className="error-message">
                  <span className="error-icon">⚠</span>
                  {errors.username}
                </p>
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
                onBlur={handleBlur}
                required
                autoComplete="email"
                className={getInputClass("email")}
              />
              {errors.email && (
                <p className="error-message">
                  <span className="error-icon">⚠</span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Campo de Senha */}
            <div className="input-group">
              <label htmlFor="password">Senha</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Mínimo 8 caracteres"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  minLength="8"
                  autoComplete="new-password"
                  className={getInputClass("password")}
                />
                <button
                type="button"
                onClick={()=>setShowPassword(!showPassword)}
                aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                title={showPassword ? "Esconder senha" : "Mostrar senha"}
                className="toggle-password"
              >
                <i
                  className={`ri-${showPassword ? "eye-line" : "eye-off-line"}`}
                ></i>
              </button>
              </div>
              <small id="password-hint" className="form-text-hint">
                Use 8 ou mais caracteres, no mínimo uma letra maiúscula, um
                número e um caractere especial.
              </small>
              {errors.password && (
                <p className="error-message">
                  <span className="error-icon">⚠</span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Campo de Confirmação de Senha */}
            <div className="input-group">
              <label htmlFor="confirm-password">Confirmar Senha</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirm-password"
                  placeholder="Repita sua senha"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  minLength="8"
                  autoComplete="new-password"
                  className={getInputClass("confirmPassword")}
                />
                <button
                type="button"
                onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Esconder senha" : "Mostrar senha"}
                title={showConfirmPassword ? "Esconder senha" : "Mostrar senha"}
                className="toggle-password"
              >
                <i
                  className={`ri-${showConfirmPassword ? "eye-line" : "eye-off-line"}`}
                ></i>
              </button>
              </div>
              {errors.confirmPassword && (
                <p className="error-message">
                  <span className="error-icon">⚠</span>
                  {errors.confirmPassword}
                </p>
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

            {/* Campo de preferencias */}
            <Preferences
  favoriteGenres={formData.favoriteGenres}
  setFavoriteGenres={(newGenres) =>
    setFormData({ ...formData, favoriteGenres: newGenres })
  }
  preferredPlatforms={formData.preferredPlatforms}
  setPreferredPlatforms={(newPlatforms) =>
    setFormData({ ...formData, preferredPlatforms: newPlatforms })
  }
/>
            
            {generalError && (
              <div id="generalErrorMessage">
                <span className="error-icon">⚠</span>
                {generalError}
              </div>
            )}
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
          <Link to="/Login" className="">
            Faça Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Cadastro;
