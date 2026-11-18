
import { Link } from 'react-router-dom';


function SecurityPage() {
  return (
    <main className="institutional-page">
      <div className="institutional-container">
        <Link to="/" className="institutional-back">
          ← Voltar para Home
        </Link>

        <header className="institutional-heading">
          <span className="institutional-eyebrow">
            Transparência
          </span>

          <h1>Segurança e privacidade</h1>

          <p>
            Entenda como os recursos demonstrativos
            da Drip Store funcionam e quais são
            suas limitações.
          </p>
        </header>

        <div className="institutional-grid">
          <article className="institutional-card">
            <span className="institutional-icon">🔐</span>
            <h2>Contas de demonstração</h2>
            <p>
              O projeto utiliza autenticação demonstrativa.
              Os dados de contas e sessões podem ser
              armazenados localmente no navegador.
            </p>
          </article>

          <article className="institutional-card">
            <span className="institutional-icon">💳</span>
            <h2>Compras simuladas</h2>
            <p>
              Os pedidos realizados nesta aplicação
              são fictícios. Nenhum pagamento real
              é processado.
            </p>
          </article>

          <article className="institutional-card">
            <span className="institutional-icon">🗂️</span>
            <h2>Armazenamento local</h2>
            <p>
              Algumas informações podem permanecer
              salvas no navegador utilizado.
              Esses dados não equivalem a registros
              protegidos por um servidor.
            </p>
          </article>
        </div>

        <div className="institutional-notice">
          <strong>Importante:</strong> não utilize senhas
          pessoais, dados bancários verdadeiros ou
          informações sensíveis nesta aplicação.
          A Drip Store é um projeto educacional,
          não uma plataforma de pagamentos reais.
        </div>
      </div>
    </main>
  );
}

export default SecurityPage;
