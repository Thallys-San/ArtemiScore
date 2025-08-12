import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../components/layout/css/Login.css";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../components/firebase";

const RecuperarSenha = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    if (!validateEmail(cleanEmail)) {
      setIsError(true);
      setMessage("Formato de e-mail inválido.");
      setIsLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      setMessage(`Se existir uma conta para ${cleanEmail}, enviamos um e-mail de recuperação. Verifique sua caixa de entrada.`);
      setIsError(false);
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);

      // Se o erro for de e-mail inexistente, mostra como se fosse sucesso
      if (error.code === "auth/user-not-found") {
        setMessage(`Se existir uma conta para ${cleanEmail}, enviamos um e-mail de recuperação. Verifique sua caixa de entrada.`);
        setIsError(false);
      } else if (error.code === "auth/invalid-email") {
        setIsError(true);
        setMessage("E-mail inválido.");
      } else if (error.code === "auth/too-many-requests") {
        setIsError(true);
        setMessage("Muitas tentativas. Tente novamente mais tarde.");
      } else {
        setIsError(true);
        setMessage(`Erro: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
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
          <h2>Recuperar Senha</h2>
          <p>Insira seu e-mail para receber as instruções de recuperação</p>
        </div>

        {message ? (
          <div className={`message-box ${isError ? "error-message" : "success-message"}`}>
            <p>{message}</p>
            {!isError && (
              <div className="back-to-login" style={{ marginTop: "10px" }}>
                <Link to="/login">Voltar para o login</Link>
              </div>
            )}
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group email-group">
              <label htmlFor="email" className="form-label">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input email-input"
                placeholder="seu.email@exemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={isLoading}
                autoCorrect="off"
                spellCheck="false"
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={!email || isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar Instruções"}
            </button>
          </form>
        )}

        <div className="register-link" style={{ marginTop: "15px" }}>
          <p>
            Lembrou sua senha? <Link to="/login">Fazer login</Link>
          </p>
          <p>
            Não tem uma conta? <Link to="/cadastro">Crie agora</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RecuperarSenha;
