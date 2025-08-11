import React, { useState, useEffect, useRef } from "react";
import "../components/layout/css/config.css";
import { auth } from "../components/firebase";
import {
  getIdToken,
  onAuthStateChanged,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateEmail, 
  sendEmailVerification,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ProfilePicture from "../components/commom/ProfilePicture";

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
  });

  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ message: "", type: "" });
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
          profilePicture: data.foto_perfil,
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setNotification({
          message: "Erro ao carregar dados do usuário",
          type: "error",
        });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

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

      // First reauthenticate the user
      const credential = EmailAuthProvider.credential(
        user.email,
        userData.currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Then update the password
      await updatePassword(user, userData.newPassword);

      // Also update in your backend
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

      // Clear password fields
      setUserData({
        ...userData,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      setNotification({
        message: "Senha atualizada com sucesso!",
        type: "success",
      });
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
      setNotification({
        message:
          error.message ||
          "Erro ao atualizar senha. Verifique sua senha atual.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

      // Sign out and redirect
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Erro ao desativar conta:", error);
      setNotification({
        message: error.message || "Erro ao desativar conta",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manipuladores de eventos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });

    // Limpa erros ao modificar o campo
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Validações melhoradas (adaptadas do cadastro)
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
  
  if (!userData.email.trim()) {
    newErrors.email = "Informe um e-mail";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    newErrors.email = "Informe um e-mail válido";
  }
  
  if (userData.bio.length > 300) {
    newErrors.bio = "A bio deve ter no máximo 300 caracteres";
  }
  
  // Mantém os erros de username/email em uso se existirem
  if (errors.username) newErrors.username = errors.username;
  if (errors.email) newErrors.email = errors.email;
  
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

  // Verificação de nome de usuário e email em tempo real
const handleBlur = async (e) => {
  const { name, value } = e.target;
  const newErrors = { ...errors };

  try {
    const user = auth.currentUser;
    if (!user) return;

    const idToken = await getIdToken(user);

    if (name === "username" && value.trim()) {
      const res = await fetch(
        `http://localhost:8080/api/usuarios/check-username?username=${encodeURIComponent(value)}&currentUserId=${user.uid}`,
        {
          headers: { 
            Authorization: `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erro na verificação de username");
      }
      
      const data = await res.json();
      
      if (!data.available) {
        newErrors.username = "Nome de usuário já está em uso";
      } else {
        delete newErrors.username;
      }
    }

    if (name === "email" && value.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors.email = "Informe um e-mail válido";
      } else {
        const res = await fetch(
          `http://localhost:8080/api/usuarios/check-email?email=${encodeURIComponent(value)}&currentUserId=${user.uid}`,
          {
            headers: { 
              Authorization: `Bearer ${idToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Erro na verificação de e-mail");
        }
        
        const data = await res.json();
        
        if (!data.available) {
          newErrors.email = "E-mail já está em uso";
        } else {
          delete newErrors.email;
        }
      }
    }
  } catch (err) {
    console.error("Erro ao verificar:", err);
    setNotification({
      message: err.message || "Erro ao verificar disponibilidade",
      type: "error"
    });
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

    const emailChanged = userData.email !== user.email;
    const idToken = await getIdToken(user);

    // 1. Primeiro atualiza os dados no SEU backend (exceto email se tiver mudado)
    const updateData = {
      nome: userData.username,
      bio: userData.bio,
      foto_perfil: userData.profilePicture
    };

    // Só envia o email se NÃO tiver mudado (evita inconsistências)
    if (!emailChanged) {
      updateData.email = userData.email;
    }

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

    // 2. Se o email foi alterado, inicia o processo especial
    if (emailChanged) {
      if (!user.emailVerified) {
        throw {
          code: 'auth/unverified-email',
          message: "Verifique seu e-mail atual antes de alterá-lo"
        };
      }

      // Reautentica o usuário
      const credential = EmailAuthProvider.credential(
        user.email,
        userData.currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Usa o endpoint do seu backend para solicitar mudança de email
      const changeEmailResponse = await fetch(`http://localhost:8080/api/usuarios/request-email-change`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          newEmail: userData.email
        }),
      });

      if (!changeEmailResponse.ok) {
        const errorData = await changeEmailResponse.json();
        throw new Error(errorData.message || "Erro ao solicitar alteração de e-mail");
      }

      setNotification({
        message: "Enviamos um link de confirmação para seu novo e-mail. Por favor, verifique sua caixa de entrada.",
        type: "success",
      });
    } else {
      setNotification({
        message: "Dados atualizados com sucesso!",
        type: "success",
      });
    }

    // Limpa o campo de senha
    setUserData(prev => ({...prev, currentPassword: ""}));

  } catch (error) {
    console.error("Erro ao atualizar:", error);
    
    let errorMessage = error.message;
    if (error.code === 'auth/operation-not-allowed') {
      errorMessage = "Complete a verificação do e-mail atual primeiro";
    } else if (error.code === 'auth/requires-recent-login') {
      errorMessage = "Sessão expirada. Por favor, faça login novamente";
    }

    setNotification({
      message: errorMessage || "Erro ao atualizar dados",
      type: "error",
    });
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
      <div className="form-container">
      {notification.message && (
  <div className={`notification ${notification.type}`}>
    {notification.message}
    {notification.type === 'success' && notification.message.includes('Enviamos um link') && (
      <button 
        onClick={() => window.location.reload()}
        className="notification-refresh"
      >
        Atualizar Página
      </button>
    )}
    <button onClick={() => setNotification({ message: '', type: '' })}>
      &times;
    </button>
  </div>
)}
        <h1 className="title">Configurações da Conta</h1>
        <p className="subtitle">
          Gerencie suas informações pessoais e preferências
        </p>

        {notification.message && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
            <button
              onClick={() => setNotification({ message: "", type: "" })}
              aria-label="Fechar notificação"
            >
              &times;
            </button>
          </div>
        )}

        {/* Seção de Informações da Conta */}
        <form onSubmit={handleAccountSubmit} className="form">
          <fieldset>
            <legend className="section-title">
              <i className="ri-user-settings-line"></i> Informações Pessoais
            </legend>

            <ProfilePicture
              initialAvatar={userData.profilePicture}
              onAvatarChange={(newAvatar) =>
                setUserData((prev) => ({
                  ...prev,
                  profilePicture: newAvatar,
                }))
              }
            />
            {errors.profilePicture && (
              <p className="error-message">
                <span className="error-icon">⚠</span>
                {errors.profilePicture}
              </p>
            )}

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
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="seuemail@exemplo.com"
                value={userData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                className={getInputClass("email")}
              />
              {errors.email && (
                <p className="error-message">
                  <span className="error-icon">⚠</span>
                  {errors.email}
                </p>
              )}
            </div>

            {userData.email !== auth.currentUser?.email && (
  <div className="input-group">
    <label htmlFor="currentPassword">Senha Atual (requerida para alterar e-mail)</label>
    <input
      type="password"
      name="currentPassword"
      value={userData.currentPassword}
      onChange={handleInputChange}
      required
    />
  </div>
)}

            <div className="input-group">
              <label htmlFor="bio">
                Biografia{" "}
                <span className="char-count">({userData.bio.length}/300)</span>
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

            <div className="button-group">
              <button
                type="button"
                className="sign secondary"
                onClick={() => navigate("/perfil")}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button type="submit" className="sign" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </fieldset>
        </form>

        {/* Seção de Segurança */}
        <form onSubmit={handlePasswordSubmit} className="form">
          <fieldset>
            <legend className="section-title">
              <i className="ri-lock-line"></i> Segurança
            </legend>

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
                  aria-label={
                    showCurrentPassword ? "Ocultar senha" : "Mostrar senha"
                  }
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
                  aria-label={
                    showNewPassword ? "Ocultar senha" : "Mostrar senha"
                  }
                >
                  <i
                    className={`ri-eye${showNewPassword ? "" : "-off"}-line`}
                  ></i>
                </button>
              </div>
              <small className="form-text-hint">
                Use 8 ou mais caracteres, no mínimo uma letra maiúscula, um
                número e um caractere especial.
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
                  aria-label={
                    showConfirmPassword ? "Ocultar senha" : "Mostrar senha"
                  }
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

        {/* Seção de Desativação de Conta */}
        <div className="form danger-section">
          <fieldset>
            <legend className="section-title">
              <i className="ri-delete-bin-line"></i> Desativar Conta
            </legend>

            <p className="danger-text">
              Ao desativar sua conta, todos os seus dados serão permanentemente
              removidos.
              <strong> Esta ação não pode ser desfeita.</strong>
            </p>

            <div className="button-group">
              <button
                type="button"
                className="sign danger"
                onClick={handleDeactivate}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Desativando..." : "Desativar Minha Conta"}
              </button>
            </div>
          </fieldset>
        </div>

        <div className="back-link">
          <Link to="/perfil" className="">
            <i className="ri-arrow-left-line"></i> Voltar para o perfil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConfigScreen;
