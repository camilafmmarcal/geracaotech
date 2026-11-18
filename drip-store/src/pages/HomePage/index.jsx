
import { Link } from 'react-router-dom';

import Gallery from '../../components/Gallery';
import Section from '../../components/Section';
import ProductListing from '../../components/ProductListing';

import products from '../../data/products';

import './style.css';

// ==========================================
// CAMPANHAS ESPECIAIS
// ==========================================

const collections = [
  {
    id: 1,
    title: 'Black Friday Drip Store',
    discount: 'OFERTAS',
    description:
      'Descontos especiais em produtos selecionados.',
    image: '/campanhas/black-friday.png',
    link: '/products?promotion=black-friday',
    buttonText: 'Ver ofertas',
    theme: 'black-friday'
  },
  {
    id: 2,
    title: 'Wishlist de Natal',
    discount: 'ESPECIAL',
    description:
      'Salve seus produtos favoritos para presentear.',
    image: '/campanhas/wishlist-natal.png',
    link: '/wishlist',
    buttonText: 'Minha Wishlist',
    theme: 'christmas'
  },
  {
    id: 3,
    title: 'Cupons exclusivos',
    discount: 'ECONOMIZE',
    description:
      'Aproveite benefícios especiais na sua compra.',
    image: '/campanhas/cupons.png',
    link: '/coupons',
    buttonText: 'Ver cupons',
    theme: 'coupons'
  }
];

// ==========================================
// PRODUTOS EM ALTA
// ==========================================

// Seleciona os primeiros oito produtos
// diretamente do catálogo principal.
//
// Isso evita duplicação de informações e
// mantém preços, nomes e IDs consistentes.

const featuredProducts = products.slice(0, 8);

// ==========================================
// COMPONENTE HOME
// ==========================================

function HomePage() {
  return (
    <>
      {/* BANNER PRINCIPAL */}
      <Gallery />

      {/* CAMPANHAS ESPECIAIS */}
      <Section title="Campanhas especiais">
        <div className="collections-grid">
          {collections.map((collection) => (
            <article
              key={collection.id}
              className={`collection-card collection-${collection.theme}`}
            >
              <div className="collection-card-content">
                <span className="collection-discount">
                  {collection.discount}
                </span>

                <h3>{collection.title}</h3>

                <p className="collection-description">
                  {collection.description}
                </p>
              </div>

              <div className="collection-image-wrapper">
                <img
                  src={collection.image}
                  alt={`Campanha ${collection.title}`}
                  className="collection-image"
                  loading="lazy"
                />
              </div>

              <Link
                to={collection.link}
                className="collection-button"
              >
                {collection.buttonText}

                <span aria-hidden="true">
                  →
                </span>
              </Link>
            </article>
          ))}
        </div>
      </Section>

      {/* PRODUTOS EM ALTA */}
      <Section title="Produtos em alta">
        <ProductListing
          products={featuredProducts}
        />
      </Section>
    </>
  );
}

export default HomePage;
