import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../components/layout/css/Login.css";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  fetchSignInMethodsForEmail,
  sendEmailVerification,
} from "firebase/auth";
import { auth, provider } from "../components/firebase";
import { AuthContext } from "../components/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const navigate = useNavigate();
  const emailInputRef = useRef();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Countdown timer effect
  useEffect(() => {
    if (lockoutUntil && new Date() < new Date(lockoutUntil)) {
      const interval = setInterval(() => {
        const timeLeft = Math.max(0, Math.floor((new Date(lockoutUntil) - new Date()) / 1000));
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        setRemainingTime(`${minutes}m ${seconds}s`);
        
        if (timeLeft <= 0) {
          setLockoutUntil(null);
          setLoginError("");
          setRemainingTime(null);
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [lockoutUntil]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setLoginError("");
    setVerificationSent(false);
    setIsLoading(true);

    // Check if account is locked
    if (lockoutUntil && new Date() < new Date(lockoutUntil)) {
      setLoginError(`Muitas tentativas falhas. Tente novamente em ${remainingTime}.`);
      setIsLoading(false);
      return;
    }

    // Check if max attempts reached
    if (loginAttempts >= 5) {
      setLockoutUntil(new Date(Date.now() + 30 * 60 * 1000)); // Lockout for 30 minutes
      setLoginError(`Muitas tentativas falhas. Tente novamente em ${remainingTime || "30m 0s"}.`);
      setLoginAttempts(0); // Reset attempts after lockout
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Verificar se o e-mail foi confirmado
      if (!user.emailVerified) {
        // Se não foi verificado, enviar e-mail de verificação novamente
        await sendEmailVerification(user);
        setVerificationSent(true);
        setLoginError("Seu e-mail ainda não foi verificado. Enviamos um novo e-mail de verificação. Por favor, verifique sua caixa de entrada.");
        setIsLoading(false);
        return;
      }

      const token = await user.getIdToken();
      login(token, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });

      setLoginAttempts(0); // Reset attempts on successful login
      navigate("/home");
    } catch (error) {
      console.error("Erro no login:", error);
      setIsLoading(false);
      setLoginAttempts((prev) => prev + 1); // Increment attempts on failure

      let errorMessage = "Erro ao fazer login. Tente novamente.";
      
      switch (error.code) {
        case "auth/invalid-credential":
          errorMessage = `Credenciais inválidas. Verifique seu email e senha. Tentativas restantes: ${5 - loginAttempts - 1}`;
          break;
        case "auth/invalid-email":
          errorMessage = `Email inválido. Por favor, insira um email válido. Tentativas restantes: ${5 - loginAttempts - 1}`;
          break;
        case "auth/user-disabled":
          errorMessage = "Esta conta foi desativada. Entre em contato com o suporte.";
          break;
        case "auth/user-not-found":
          errorMessage = `Nenhuma conta encontrada com este email. Tentativas restantes: ${5 - loginAttempts - 1}`;
          navigate("/RecuperarSenha", { state: { email } });
          break;
        case "auth/wrong-password":
          errorMessage = `Senha incorreta. Tente novamente ou redefina sua senha. Tentativas restantes: ${5 - loginAttempts - 1}`;
          break;
        case "auth/too-many-requests":
          errorMessage = `Muitas tentativas falhas. Tente novamente em ${remainingTime || "30m 0s"}.`;
          setLockoutUntil(new Date(Date.now() + 30 * 60 * 1000)); // Lockout for 30 minutes
          setLoginAttempts(0); // Reset attempts
          break;
        case "auth/network-request-failed":
          errorMessage = `Problema de conexão. Verifique sua internet. Tentativas restantes: ${5 - loginAttempts - 1}`;
          break;
        default:
          errorMessage = error.message || "Erro desconhecido ao fazer login.";
      }

      setLoginError(errorMessage);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();
      login(token, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });

      alert(`Bem-vindo, ${user.displayName || user.email}!`);
      navigate("/home");
    } catch (error) {
      console.error("Erro no login com Google:", error);
      alert("Erro ao logar com Google.");
    }
  };

  const handlePasswordReset = async () => {
    const emailValue = emailInputRef.current?.value?.trim();

    if (!emailValue) {
      setEmailError("Por favor, digite seu email primeiro");
      return;
    }

    try {
      await fetchSignInMethodsForEmail(auth, emailValue);
    } catch (error) {
      console.error("Erro ao verificar email:", error);
    } finally {
      setEmailError("");
      navigate("/RecuperarSenha", { state: { email: emailValue } });
    }
  };

  return (
    <section className="login-section">
      <div className="login-container">
        <button
          onClick={() => navigate("/perfil")}
          className="square-back-button"
          aria-label="Voltar para o perfil"
        >
          <i className="ri-arrow-left-line"></i>
        </button>

        <div className="title-container">
          <h2>Bem-vindo de volta ao ArtemiScore!</h2>
          <p>Entre na sua conta para continuar sua jornada</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group email-group">
            <label htmlFor="email" className="form-label">
              E-mail
            </label>
            <input
              ref={emailInputRef}
              type="email"
              id="email"
              name="email"
              className="form-input email-input"
              placeholder="seu.email@exemplo.com"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
                setLoginError("");
                setVerificationSent(false);
              }}
              autoComplete="email"
              autoCorrect="off"
              spellCheck="false"
            />
            {emailError && (
              <p className="error-message" style={{ color: "red", marginTop: "5px" }}>
                {emailError}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Senha
            </label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="form-input"
                placeholder="Digite sua senha"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                title={showPassword ? "Esconder senha" : "Mostrar senha"}
                className="toggle-password"
              >
                <i className={`ri-${showPassword ? "eye-line" : "eye-off-line"}`}></i>
              </button>
            </div>
          </div>

          {loginError && (
            <div className="error-message" style={{ 
              color: verificationSent ? "green" : "red", 
              margin: "10px 0",
              display: "flex",
              flexDirection: "column",
              gap: "5px"
            }}>
              <p>{loginError}</p>
              {verificationSent && (
                <p style={{ color: "#5733ef", fontWeight: "bold" }}>
                  E-mail de verificação enviado com sucesso!
                </p>
              )}
            </div>
          )}

          <div className="remember-forgot">
            <div className="remember-me">
              <input type="checkbox" id="remember" name="remember" />
              <label htmlFor="remember">Lembrar-me</label>
            </div>

            <button
              type="button"
              onClick={handlePasswordReset}
              className="link-button"
              style={{
                background: "none",
                border: "none",
                color: "#5733ef",
                cursor: "pointer",
                textDecoration: "underline",
                padding: 0,
                fontSize: "1rem",
              }}
              aria-label="Redefinir senha"
              title="Redefinir senha"
            >
              Redefinir agora
            </button>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={!email || !password || isLoading}
          >
            {isLoading ? "Carregando..." : "Entrar"}
          </button>

          <div className="social-login">
            <p>Ou entre com</p>
            <button
              type="button"
              className="google-btn"
              onClick={handleGoogleLogin}
            >
              <img
                src="https://github.com/Thallys-San/ArtemiScore/blob/main/download.png?raw=true"
                alt="Google logo"
                className="google-logo"
              />
              Entrar com Google
            </button>
          </div>

          <div className="register-link">
            <p>
              Não tem uma conta? <Link to="/cadastro">Crie agora</Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
