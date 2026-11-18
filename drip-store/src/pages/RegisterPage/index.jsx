
import { useState } from 'react';
import {
  Link,
  Navigate,
  useNavigate
} from 'react-router-dom';

import { useAuth } from '../../context/useAuth';
import '../AuthPages/style.css';

function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await register({
        name,
        email,
        password,
        confirmPassword
      });

      if (!result.success) {
        setError(result.message);
        return;
      }

      navigate('/', { replace: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-heading">
            <span className="auth-eyebrow">
              FAÇA PARTE DA DRIP STORE
            </span>

            <h1>Crie sua conta</h1>

            <p>
              Cadastre seu perfil demonstrativo
              e acompanhe seus pedidos e favoritos.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="register-name">
                Nome completo
              </label>

              <input
                id="register-name"
                type="text"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setError('');
                }}
                placeholder="Digite seu nome completo"
                autoComplete="name"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="register-email">
                E-mail
              </label>

              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError('');
                }}
                placeholder="seuemail@exemplo.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="register-password">
                Senha
              </label>

              <div className="auth-password-wrapper">
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError('');
                  }}
                  placeholder="Crie uma senha"
                  autoComplete="new-password"
                  required
                  minLength={8}
                />

                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>

              <p className="auth-password-hint">
                Mínimo de 8 caracteres, incluindo
                uma letra e um número.
              </p>
            </div>

            <div className="auth-field">
              <label htmlFor="register-confirm-password">
                Confirmar senha
              </label>

              <input
                id="register-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setError('');
                }}
                placeholder="Repita sua senha"
                autoComplete="new-password"
                required
              />
            </div>

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="auth-primary-button"
              disabled={loading}
            >
              {loading
                ? 'Criando conta...'
                : 'Criar conta'}
            </button>
          </form>

          <p className="auth-switch">
            Já possui uma conta?{' '}
            <Link to="/login">
              Entrar
            </Link>
          </p>

          <div className="auth-divider">
            <span>ou</span>
          </div>

          <Link
            to="/checkout"
            className="auth-secondary-button"
          >
            Continuar como visitante
          </Link>

          <p className="auth-notice">
            Cadastro exclusivamente demonstrativo.
            Não utilize senhas ou dados pessoais reais.
          </p>
        </div>

        <aside className="auth-promo">
          <span className="auth-promo-label">
            DRIP STORE
          </span>

          <h2>
            Comece com
            <br />
            mais estilo.
          </h2>

          <p>
            Crie seu perfil e explore os recursos
            de uma loja virtual desenvolvida
            com React.
          </p>

          <div className="auth-promo-highlight">
            <strong>PRIMEIRA10</strong>
            <span>
              Cupom demonstrativo de primeira
              compra para clientes cadastrados.
            </span>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default RegisterPage;
