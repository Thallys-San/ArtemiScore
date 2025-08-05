// src/pages/RecuperarSenha.jsx
import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase'; // Ajuste o caminho conforme necessário
import './RecuperarSenha.css';

const RecuperarSenha = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(`Um e-mail de recuperação foi enviado para ${email}. Verifique sua caixa de entrada.`);
      setIsSuccess(true);
    } catch (error) {
      let errorMessage = 'Erro ao enviar e-mail de recuperação.';
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Não há usuário cadastrado com este e-mail.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'E-mail inválido.';
          break;
        default:
          errorMessage = `Erro: ${error.message}`;
      }
      setMessage(errorMessage);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="login-section">
      <div className="login-container">
        <div className="login-header">
          <h2>Recuperar Senha</h2>
          <p>Insira seu e-mail para receber as instruções de recuperação</p>
        </div>

        {message ? (
          <div className={`message-container ${isSuccess ? 'success' : 'error'}`}>
            <p>{message}</p>
            {isSuccess && (
              <div className="back-to-login">
                <a href="/login">Voltar para o login</a>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar Instruções'}
            </button>
          </form>
        )}

        <div className="register-link">
          <p>Lembrou sua senha? <a href="/login">Fazer login</a></p>
        </div>
      </div>
    </section>
  );
};

export default RecuperarSenha;
