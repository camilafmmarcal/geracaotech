
import { Link } from 'react-router-dom';


function AboutPage() {
  return (
    <main className="institutional-page">
      <div className="institutional-container">
        <Link to="/" className="institutional-back">
          ← Voltar para Home
        </Link>

        <header className="institutional-heading">
          <span className="institutional-eyebrow">
            Conheça nossa loja
          </span>

          <h1>Sobre a Drip Store</h1>

          <p>
            A Drip Store é uma loja virtual demonstrativa,
            desenvolvida para proporcionar uma experiência
            moderna e intuitiva de comércio eletrônico.
          </p>
        </header>

        <div className="institutional-grid">
          <article className="institutional-card">
            <span className="institutional-icon">🎯</span>
            <h2>Nossa proposta</h2>
            <p>
              Reunir produtos, categorias e recursos
              de compra em uma interface simples,
              organizada e acessível.
            </p>
          </article>

          <article className="institutional-card">
            <span className="institutional-icon">✨</span>
            <h2>Experiência</h2>
            <p>
              Oferecer navegação prática, pesquisa,
              filtros, favoritos e acompanhamento
              demonstrativo de pedidos.
            </p>
          </article>

          <article className="institutional-card">
            <span className="institutional-icon">💻</span>
            <h2>Tecnologia</h2>
            <p>
              Projeto desenvolvido com React,
              componentes reutilizáveis e recursos
              de armazenamento local.
            </p>
          </article>
        </div>

        <section className="institutional-section">
          <div className="institutional-card">
            <h2>Explore a Drip Store</h2>
            <p>
              Conheça os produtos disponíveis e experimente
              as funcionalidades da nossa aplicação.
            </p>

            <Link
              to="/products"
              className="institutional-button"
            >
              Explorar produtos
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AboutPage;
