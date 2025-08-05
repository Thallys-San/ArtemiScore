import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../components/layout/css/Login.css';
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth, provider } from '../components/firebase';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetStatus, setResetStatus] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      alert(`Bem-vindo, ${user.email}!`);
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Email ou senha inválidos. Tente novamente.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      alert(`Bem-vindo, ${user.displayName || user.email}!`);
      navigate('/');
    } catch (error) {
      console.error('Erro no login com Google:', error);
      alert('Erro ao logar com Google.');
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      alert('Por favor, insira seu e-mail para receber o link de recuperação.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetStatus('E-mail para recuperação enviado! Verifique sua caixa de entrada.');
    } catch (error) {
      console.error('Erro ao enviar e-mail de recuperação:', error);
      setResetStatus('Erro ao enviar e-mail de recuperação. Verifique o e-mail e tente novamente.');
    }
  };

  return (
    <section className="login-section">
      <div className="login-container">
        <div className="title-container">
          <h2>Bem-vindo de volta ao ArtemisScore!</h2>
          <p>Entre na sua conta para continuar sua jornada</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group email-group">
            <label htmlFor="email" className="form-label">E-mail</label>
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
              autoCorrect="off"
              spellCheck="false"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Senha</label>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
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
                aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                title={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                className="toggle-password"
              >
                <i className={`ri-${showPassword ? 'eye-line' : 'eye-off-line'}`}></i>
              </button>
            </div>
          </div>

          <div className="remember-forgot">
            <div className="remember-me">
              <input type="checkbox" id="remember" name="remember" />
              <label htmlFor="remember">Lembrar-me</label>
            </div>

            <button
              type="button"
              onClick={handlePasswordReset}
              className="forgot-password"
            >
              Esqueceu a senha?
            </button>
          </div>

          {resetStatus && (
            <p className={`reset-status ${resetStatus.startsWith('Erro') ? 'error' : 'success'}`}>
              {resetStatus}
            </p>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={!email || !password}
          >
            Entrar
          </button>

          <div className="social-login">
            <p>Ou entre com</p>
            <button 
              type="button" 
              className="google-btn"
              onClick={handleGoogleLogin}
            >
              <img 
                src="data:image/png;base64,..."
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
