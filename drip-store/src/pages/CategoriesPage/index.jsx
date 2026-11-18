import { Link } from 'react-router-dom';
import products from '../../data/products';
import './style.css';

const categoryConfig = [
  {
    name: 'Tênis',
    description:
      'Modelos para acompanhar seu estilo e sua rotina.',
    icon: '👟',
    keywords: ['tênis', 'tenis']
  },
  {
    name: 'Acessórios',
    description:
      'Itens para complementar sua experiência.',
    icon: '🎧',
    keywords: ['acessórios', 'acessorios', 'fone']
  }
];

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function getCategoryCount(category) {
  return products.filter((product) => {
    const categoryName = normalizeText(product.category);

    return category.keywords.some((keyword) =>
      categoryName.includes(normalizeText(keyword))
    );
  }).length;
}

function CategoriesPage() {
  return (
    <main className="categories-page">
      <div className="categories-container">
        <nav className="categories-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <strong>Categorias</strong>
        </nav>

        <header className="categories-header">
          <span className="categories-eyebrow">
            ENCONTRE SEU ESTILO
          </span>

          <h1>Explore nossas categorias</h1>

          <p>
            Encontre os produtos que combinam com você.
          </p>
        </header>

        <div className="categories-grid">
          {categoryConfig.map((category) => {
            const count = getCategoryCount(category);

            return (
              <Link
                key={category.name}
                to={`/products?category=${encodeURIComponent(
                  category.name
                )}`}
                className="category-card"
              >
                <div className="category-card-icon">
                  <span aria-hidden="true">
                    {category.icon}
                  </span>
                </div>

                <div className="category-card-content">
                  <span className="category-card-count">
                    {count}{' '}
                    {count === 1
                      ? 'produto'
                      : 'produtos'}
                  </span>

                  <h2>{category.name}</h2>

                  <p>{category.description}</p>

                  <span className="category-card-action">
                    Ver produtos
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="categories-footer">
          <p>Prefere explorar todo o catálogo?</p>

          <Link to="/products">
            Ver todos os produtos
          </Link>
        </div>
      </div>
    </main>
  );
}

export default CategoriesPage;