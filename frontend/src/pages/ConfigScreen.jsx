import React, { useState, useEffect, useRef } from "react";
import "../components/layout/css/Config.css";
import { auth } from "../components/firebase";
import {
  getIdToken,
  onAuthStateChanged,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ProfilePicture from "../components/commom/ProfilePicture";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import Preferences from "../components/commom/Preferences";

const ConfigScreen = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  // Estados do usuário
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    bio: "",
    profilePicture: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    favoriteGenres: [],
    preferredPlatforms: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Carregar dados do usuário
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const idToken = await getIdToken(user);
        const response = await fetch(`http://localhost:8080/api/usuarios/me`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        if (!response.ok) throw new Error("Erro ao carregar dados do usuário");

        const data = await response.json();
        setUserData({
          username: data.nome || "",
          email: data.email || "",
          bio: data.bio || "",
          profilePicture: data.foto_perfil || "",
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
          favoriteGenres: data.preferencias_jogos || [],
          preferredPlatforms: data.plataformas_utilizadas || [],
        });
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error(error.message || "Erro ao carregar dados do usuário");
      }
      toast.dismiss();
    });

    return () => unsubscribe();
  }, [navigate]);

  // Manipuladores de eventos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });

    // Limpa erros ao modificar o campo
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Validações
  const validatePassword = (password) => {
    if (password.length < 8) return "A senha deve ter pelo menos 8 caracteres";
    if (!/[A-Z]/.test(password))
      return "A senha deve conter ao menos uma letra maiúscula";
    if (!/[0-9]/.test(password))
      return "A senha deve conter ao menos um número";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return "A senha deve conter ao menos um caractere especial";
    return "";
  };

  const validateAccountForm = () => {
    const newErrors = {};

    if (!userData.username.trim()) {
      newErrors.username = "Informe um nome de usuário";
    }

    if (userData.bio.length > 300) {
      newErrors.bio = "A bio deve ter no máximo 300 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!userData.currentPassword) {
      newErrors.currentPassword = "Digite sua senha atual";
    }

    const passwordError = validatePassword(userData.newPassword);
    if (passwordError) {
      newErrors.newPassword = passwordError;
    }

    if (userData.newPassword !== userData.confirmNewPassword) {
      newErrors.confirmNewPassword = "As senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Verificação de nome de usuário em tempo real
  const handleBlur = async (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };

    try {
      const user = auth.currentUser;
      if (!user || name !== "username") return;

      const idToken = await getIdToken(user);

      if (value.trim()) {
        const res = await fetch(
          `http://localhost:8080/api/usuarios/check-username?username=${encodeURIComponent(
            value
          )}&currentUserId=${user.uid}`,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.message || "Erro na verificação de username"
          );
        }

        const data = await res.json();

        if (data.exists) {
          newErrors.username = "Nome de usuário já está em uso";
        } else {
          delete newErrors.username;
        }
      }
    } catch (err) {
      console.error("Erro ao verificar:", err);
      toast.error(err.message || "Erro ao verificar disponibilidade");
    } finally {
      setErrors(newErrors);
    }
  };

  // Atualizar dados da conta
  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateAccountForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const idToken = await getIdToken(user);

      const updateData = {
        nome: userData.username,
        email: userData.email,
        bio: userData.bio,
        foto_perfil: userData.profilePicture,
        preferencias_jogos: userData.favoriteGenres,
        plataformas_utilizadas: userData.preferredPlatforms,
      };

      const response = await fetch(`http://localhost:8080/api/usuarios/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar dados");
      }

      toast.success("Dados atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      toast.error(error.message || "Erro ao atualizar dados");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Atualizar senha
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validatePasswordForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      // Reautenticar o usuário
      const credential = EmailAuthProvider.credential(
        user.email,
        userData.currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Atualizar a senha
      await updatePassword(user, userData.newPassword);

      // Atualizar no backend
      const idToken = await getIdToken(user);
      const response = await fetch(
        `http://localhost:8080/api/usuarios/update-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            newPassword: userData.newPassword,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar senha no servidor");
      }

      // Limpar campos de senha
      setUserData({
        ...userData,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      toast.success("Senha atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
      toast.error(
        error.message || "Erro ao atualizar senha. Verifique sua senha atual."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Desativar conta
  const handleDeactivate = async () => {
    if (
      !window.confirm(
        "Tem certeza que deseja desativar sua conta? Esta ação é irreversível."
      )
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      const user = auth.currentUser;
      const idToken = await getIdToken(user);

      const response = await fetch(`http://localhost:8080/api/usuarios/me`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao desativar conta");
      }

      // Deslogar e redirecionar
      await auth.signOut();
      navigate("/");
      toast.success("Conta desativada com sucesso!");
    } catch (error) {
      console.error("Erro ao desativar conta:", error);
      toast.error(error.message || "Erro ao desativar conta");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para determinar a classe do input baseado no estado de validação
  const getInputClass = (fieldName) => {
    if (errors[fieldName]) {
      return "input-error";
    }
    if (userData[fieldName] && !errors[fieldName]) {
      return "input-success";
    }
    return "";
  };

  return (
    <div className="config-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 9999 }}
        
      />
      <div className="form-container">
        <button
          onClick={() => navigate("/perfil")}
          className="square-back-button"
          aria-label="Voltar para o perfil"
        >
          <i className="ri-arrow-left-line"></i>
        </button>

        <h1 className="title">Configurações da Conta</h1>
        <p className="subtitle">
          Gerencie suas informações pessoais e preferências
        </p>

        {/* Seções combinadas */}
<div className="combined-sections">
  {/* Seção 1: Informações Pessoais */}
  <div className="settings-section">
    <h2 className="section-title">
      <i className="ri-user-settings-line"></i> Informações Pessoais
    </h2>

    <form onSubmit={handleAccountSubmit} className="form">
      <fieldset>
        <ProfilePicture
          initialAvatar={userData.profilePicture}
          onAvatarChange={(newAvatar) =>
            setUserData((prev) => ({
              ...prev,
              profilePicture: newAvatar,
            }))
          }
        />

        <div className="input-group">
          <label htmlFor="connected-as" className="connected-as-label">
            Conectado como:{" "}
            <span className="connected-email">{userData.email}</span>
          </label>
        </div>
        <div className="input-group">
          <label htmlFor="username">Nome de Usuário</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Seu nome de usuário"
            value={userData.username}
            onChange={handleInputChange}
            onBlur={handleBlur}
            required
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
          <label htmlFor="bio">
            Biografia{" "}
            <span className="char-count">
              ({userData.bio.length}/300)
            </span>
          </label>
          <textarea
            name="bio"
            id="bio"
            rows="4"
            placeholder="Conte um pouco sobre você..."
            value={userData.bio}
            onChange={handleInputChange}
            maxLength="300"
            className={getInputClass("bio")}
          ></textarea>
          {errors.bio && (
            <p className="error-message">
              <span className="error-icon">⚠</span>
              {errors.bio}
            </p>
          )}
        </div>
      </fieldset>
    </form>
  </div>

  {/* Seção 2: Preferências */}
  <div className="settings-section optional-section">
    <h2 className="section-title">
      <i className="ri-heart-line"></i> Preferências
    </h2>

    <Preferences
      favoriteGenres={userData.favoriteGenres}
      setFavoriteGenres={(genres) =>
        setUserData({ ...userData, favoriteGenres: genres })
      }
      preferredPlatforms={userData.preferredPlatforms}
      setPreferredPlatforms={(platforms) =>
        setUserData({ ...userData, preferredPlatforms: platforms })
      }
    />
  </div>

  {/* Botão de salvar para ambas as seções */}
  <div className="button-group combined-button">
    <button 
      type="button" 
      className="sign" 
      onClick={handleAccountSubmit} 
      disabled={isSubmitting}
    >
      {isSubmitting ? "Salvando..." : "Salvar Alterações"}
    </button>
  </div>
</div>

        {/* Seção 3: Segurança */}
        <div className="settings-section">
          <h2 className="section-title">
            <i className="ri-lock-line"></i> Segurança
          </h2>

          <form onSubmit={handlePasswordSubmit} className="form">
            <fieldset>
              <div className="input-group">
                <label htmlFor="currentPassword">Senha Atual</label>
                <div className="password-input-container">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    id="currentPassword"
                    placeholder="Sua senha atual"
                    value={userData.currentPassword}
                    onChange={handleInputChange}
                    className={getInputClass("currentPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="toggle-password"
                  >
                    <i
                      className={`ri-eye${
                        showCurrentPassword ? "" : "-off"
                      }-line`}
                    ></i>
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="error-message">
                    <span className="error-icon">⚠</span>
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="newPassword">Nova Senha</label>
                <div className="password-input-container">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    id="newPassword"
                    placeholder="Mínimo 8 caracteres"
                    value={userData.newPassword}
                    onChange={handleInputChange}
                    className={getInputClass("newPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="toggle-password"
                  >
                    <i
                      className={`ri-eye${showNewPassword ? "" : "-off"}-line`}
                    ></i>
                  </button>
                </div>
                <small className="form-text-hint">
                  Use 8 ou mais caracteres com letras maiúsculas, números e
                  caracteres especiais.
                </small>
                {errors.newPassword && (
                  <p className="error-message">
                    <span className="error-icon">⚠</span>
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="confirmNewPassword">Confirmar Nova Senha</label>
                <div className="password-input-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmNewPassword"
                    id="confirmNewPassword"
                    placeholder="Repita a nova senha"
                    value={userData.confirmNewPassword}
                    onChange={handleInputChange}
                    className={getInputClass("confirmNewPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="toggle-password"
                  >
                    <i
                      className={`ri-eye${
                        showConfirmPassword ? "" : "-off"
                      }-line`}
                    ></i>
                  </button>
                </div>
                {errors.confirmNewPassword && (
                  <p className="error-message">
                    <span className="error-icon">⚠</span>
                    {errors.confirmNewPassword}
                  </p>
                )}
              </div>

              <div className="button-group">
                <button type="submit" className="sign" disabled={isSubmitting}>
                  {isSubmitting ? "Atualizando..." : "Atualizar Senha"}
                </button>
              </div>
            </fieldset>
          </form>
        </div>

        {/* Seção 4: Desativar Conta */}
        <div className="settings-section danger-section">
          <h2 className="section-title">
            <i className="ri-delete-bin-line"></i> Desativar Conta
          </h2>

          <div className="danger-content">
            <p className="danger-text">
              Ao desativar sua conta, todos os seus dados serão permanentemente
              removidos. <strong>Esta ação não pode ser desfeita.</strong>
            </p>

            <button
              type="button"
              className="sign danger"
              onClick={handleDeactivate}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Desativando..." : "Desativar Minha Conta"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigScreen;
