import { Link } from 'react-router-dom';
import './style.css';

function NotFoundPage() {
  return (
    <main className="not-found-page">
      <div className="not-found-content">
        <span className="not-found-code">404</span>

        <h1>Ops! Página não encontrada.</h1>

        <p>
          A página que você está procurando não existe
          ou foi movida para outro endereço.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="not-found-primary">
            Voltar para Home
          </Link>

          <Link
            to="/products"
            className="not-found-secondary"
          >
            Explorar produtos
          </Link>
        </div>
      </div>
    </main>
  );
}

export default NotFoundPage;