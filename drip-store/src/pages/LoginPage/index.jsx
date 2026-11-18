
import { useState } from 'react';
import {
  Link,
  Navigate,
  useNavigate
} from 'react-router-dom';

import { useAuth } from '../../context/useAuth';
import '../AuthPages/style.css';

function LoginPage() {
  const {
    login,
    migrateLegacyAccount,
    isAuthenticated
  } = useAuth();

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [migrationMode, setMigrationMode] = useState(false);
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
      const result = migrationMode
        ? await migrateLegacyAccount({
            email,
            password,
            confirmPassword
          })
        : await login(email, password);

      if (!result.success) {
        setError(result.message);

        if (result.requiresMigration) {
          setMigrationMode(true);
          setPassword('');
        }

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
              BEM-VINDO À DRIP STORE
            </span>

            <h1>
              {migrationMode
                ? 'Defina sua senha'
                : 'Acesse sua conta'}
            </h1>

            <p>
              {migrationMode
                ? 'Atualize sua conta demonstrativa antiga sem perder pedidos e favoritos.'
                : 'Entre com seu e-mail e senha para acessar seu perfil.'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="login-email">
                E-mail
              </label>

              <input
                id="login-email"
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
              <label htmlFor="login-password">
                {migrationMode
                  ? 'Nova senha'
                  : 'Senha'}
              </label>

              <div className="auth-password-wrapper">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError('');
                  }}
                  placeholder="Digite sua senha"
                  autoComplete={
                    migrationMode
                      ? 'new-password'
                      : 'current-password'
                  }
                  required
                />

                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  aria-label={
                    showPassword
                      ? 'Ocultar senha'
                      : 'Mostrar senha'
                  }
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>

            {migrationMode && (
              <>
                <div className="auth-field">
                  <label htmlFor="login-confirm-password">
                    Confirmar nova senha
                  </label>

                  <input
                    id="login-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      setError('');
                    }}
                    autoComplete="new-password"
                    required
                  />
                </div>

                <p className="auth-notice">
                  Migração local demonstrativa:
                  não há verificação de propriedade
                  do e-mail. Não utilize senhas reais.
                </p>
              </>
            )}

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
                ? 'Aguarde...'
                : migrationMode
                ? 'Salvar senha'
                : 'Entrar'}
            </button>
          </form>

          {migrationMode && (
            <button
              type="button"
              className="auth-text-button"
              onClick={() => {
                setMigrationMode(false);
                setPassword('');
                setConfirmPassword('');
                setError('');
              }}
            >
              Voltar ao login
            </button>
          )}

          <p className="auth-switch">
            Ainda não tem uma conta?{' '}
            <Link to="/register">
              Cadastre-se
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
            Autenticação demonstrativa armazenada
            neste navegador. Não utilize credenciais
            pessoais reais.
          </p>
        </div>

        <aside className="auth-promo">
          <span className="auth-promo-label">
            DRIP STORE
          </span>

          <h2>
            Seu estilo.
            <br />
            Sua escolha.
          </h2>

          <p>
            Descubra produtos, explore coleções
            e aproveite uma experiência de compra
            desenvolvida com React.
          </p>

          <div className="auth-promo-highlight">
            <strong>PRIMEIRA10</strong>
            <span>
              Cupom demonstrativo para a primeira
              compra, sujeito às regras da loja.
            </span>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default LoginPage;
