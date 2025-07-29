import React, { useState } from 'react';
import './Login.css'; // Certifique-se de ter um arquivo CSS para estilização
function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // sua lógica de login aqui
  };
  

  return (
    <section className="login-section">
      <div className="login-container">
        <div className="login-header">
          <h2>Bem-vindo de volta ao ArtemiScore!</h2>
          <p>Entre na sua conta para continuar sua jornada</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="seu.email@exemplo.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Digite sua senha"
                required
              />
              <i
                className={`ri-${showPassword ? 'eye-line' : 'eye-off-line'} toggle-password`}
                onClick={togglePasswordVisibility}
                style={{ cursor: 'pointer' }}
              ></i>
            </div>
          </div>

          <div className="remember-forgot">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Lembrar-me</label>
            </div>
            <a href="#" className="forgot-password">
              Esqueceu a senha?
            </a>
          </div>

          <button type="submit" className="login-button">
            Entrar
          </button>

          <div className="social-login">
            <p>Ou entre com o Google</p>
           <div className="social-buttons">
  <button type="button" className="social-btn google" onClick={handleGoogleLogin}>
    <i className="ri-google-fill"></i> Entrar com Google
  </button>
</div>

          </div>

          <div className="register-link">
            <p>
              Não tem uma conta? <a href="#">Crie agora</a>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Login;

