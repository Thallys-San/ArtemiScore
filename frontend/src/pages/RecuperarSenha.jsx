// src/pages/RecuperarSenha.jsx
import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "../components/layout/css/Login.css";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../components/firebase";

const RecuperarSenha = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefilledEmail = location.state?.email || "";

  const [email, setEmail] = useState(prefilledEmail);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        `E-mail de recuperação enviado para ${email}. Verifique sua caixa de entrada.`
      );
    } catch (error) {
      let errorMessage = "Erro ao enviar e-mail de recuperação.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "Não há usuário cadastrado com este e-mail.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "E-mail inválido.";
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
