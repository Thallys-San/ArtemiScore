import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../components/layout/css/Login.css";
import { sendPasswordResetEmail, fetchSignInMethodsForEmail } from "firebase/auth";
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
      // Verifica se o email está cadastrado (tem método de login)
      const methods = await fetchSignInMethodsForEmail(auth, cleanEmail);
      if (!methods || methods.length === 0) {
        setIsError(true);
        setMessage("Este e-mail não está cadastrado.");
        setIsLoading(false);
        return;
      }

      // Se email existe, envia email de recuperação
      await sendPasswordResetEmail(auth, cleanEmail);
      setMessage(`E-mail de recuperação enviado para ${cleanEmail}. Verifique sua caixa de entrada.`);
      setIsError(false);
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      let errorMessage = "Erro ao enviar e-mail de recuperação.";

      if (error.code === "auth/invalid-email") {
        errorMessage = "E-mail inválido.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Muitas tentativas. Tente novamente mais tarde.";
      } else {
        errorMessage = `Erro: ${error.message}`;
      }

      setIsError(true);
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="login-section">
      <div className="login-container">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="back-button"
          style={{
            background: "none",
            border: "none",
            color: "#5733ef",
            cursor: "pointer",
            fontWeight: "bold",
            marginBottom: "10px",
            fontSize: "1rem",
          }}
          aria-label="Voltar"
          title="Voltar"
        >
          ← Voltar
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
