
import { useState } from 'react';
import { Link } from 'react-router-dom';

const articles = [
  {
    id: 1,
    category: 'Moda',
    title: 'Como escolher o tênis ideal?',
    description:
      'Conforto, estilo e finalidade são critérios importantes na escolha.',
    content:
      'Antes de escolher um tênis, considere onde ele será utilizado. Modelos casuais atendem diferentes combinações do dia a dia, enquanto modelos esportivos podem oferecer características específicas para determinadas atividades. Verifique também o tamanho e o conforto.'
  },
  {
    id: 2,
    category: 'Tecnologia',
    title: 'O que observar em um fone Bluetooth?',
    description:
      'Conheça características importantes antes de escolher um acessório.',
    content:
      'Ao comparar fones Bluetooth, observe autonomia da bateria, conforto, conectividade e qualidade de áudio. O modelo mais adequado depende da forma de utilização, como estudos, deslocamentos ou atividades físicas.'
  },
  {
    id: 3,
    category: 'Estilo',
    title: 'Como combinar tênis no dia a dia?',
    description:
      'Sugestões simples para criar combinações versáteis.',
    content:
      'Tênis de cores neutras costumam combinar com diferentes peças. Modelos coloridos podem se tornar o destaque da composição. O mais importante é equilibrar conforto, preferência pessoal e ocasião.'
  }
];

function BlogPage() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <main className="institutional-page">
      <div className="institutional-container">
        <Link to="/" className="institutional-back">
          ← Voltar para Home
        </Link>

        <header className="institutional-heading">
          <span className="institutional-eyebrow">
            Conteúdo e inspiração
          </span>
          <h1>Blog Drip Store</h1>
          <p>
            Explore conteúdos demonstrativos sobre
            estilo, produtos e tecnologia.
          </p>
        </header>

        <div className="institutional-grid">
          {articles.map((article) => (
            <article
              className="institutional-card"
              key={article.id}
            >
              <span className="institutional-eyebrow">
                {article.category}
              </span>

              <h2 style={{ marginTop: '12px' }}>
                {article.title}
              </h2>

              <p>{article.description}</p>

              <button
                type="button"
                className="institutional-button"
                aria-expanded={
                  selectedArticle === article.id
                }
                onClick={() =>
                  setSelectedArticle(
                    selectedArticle === article.id
                      ? null
                      : article.id
                  )
                }
              >
                {selectedArticle === article.id
                  ? 'Fechar artigo'
                  : 'Ler artigo'}
              </button>
            </article>
          ))}
        </div>

        {selectedArticle !== null && (
          <section
            className="institutional-section"
            aria-live="polite"
          >
            {articles
              .filter(
                (article) =>
                  article.id === selectedArticle
              )
              .map((article) => (
                <article
                  className="institutional-card"
                  key={article.id}
                >
                  <h2>{article.title}</h2>
                  <p>{article.content}</p>

                  <button
                    type="button"
                    className="institutional-button"
                    onClick={() =>
                      setSelectedArticle(null)
                    }
                  >
                    Fechar leitura
                  </button>
                </article>
              ))}
          </section>
        )}
      </div>
    </main>
  );
}

export default BlogPage;
