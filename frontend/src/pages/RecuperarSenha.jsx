// src/pages/RecuperarSenha.jsx
import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../components/firebase';  // ajuste o caminho do seu firebase

const RecuperarSenha = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
    } catch (error) {
      setMessage(`Erro: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Recuperar Senha</h2>
      <form onSubmit={handleReset}>
        <input
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button type="submit">Enviar e-mail de recuperação</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RecuperarSenha;
