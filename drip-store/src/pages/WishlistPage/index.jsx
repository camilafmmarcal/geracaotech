
import { useMemo, useState } from 'react';
import {
  Link,
  Navigate
} from 'react-router-dom';

import ProductListing from '../../components/ProductListing';
import { useAuth } from '../../context/useAuth';
import { useWishlist } from '../../context/useWishlist';

import products from '../../data/products';

import './style.css';

function WishlistPage() {
  const [orderBy, setOrderBy] = useState('recentes');

  const { isAuthenticated } = useAuth();

  const {
    favoriteIds,
    favoriteCount,
    clearFavorites
  } = useWishlist();

  const favoriteProducts = useMemo(() => {
    const favorites = products.filter((product) =>
      favoriteIds.includes(String(product.id))
    );

    const sorted = [...favorites];

    if (orderBy === 'recentes') {
      sorted.sort(
        (a, b) =>
          favoriteIds.indexOf(String(b.id)) -
          favoriteIds.indexOf(String(a.id))
      );
    }

    if (orderBy === 'menor-preco') {
      sorted.sort(
        (a, b) =>
          (a.priceDiscount ?? a.price) -
          (b.priceDiscount ?? b.price)
      );
    }

    if (orderBy === 'maior-preco') {
      sorted.sort(
        (a, b) =>
          (b.priceDiscount ?? b.price) -
          (a.priceDiscount ?? a.price)
      );
    }

    if (orderBy === 'nome') {
      sorted.sort((a, b) =>
        a.name.localeCompare(b.name, 'pt-BR')
      );
    }

    return sorted;
  }, [favoriteIds, orderBy]);

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  function handleClearFavorites() {
    if (favoriteCount === 0) return;

    const confirmed = window.confirm(
      'Deseja remover todos os produtos da sua Wishlist?'
    );

    if (confirmed) {
      clearFavorites();
    }
  }

  return (
    <main className="wishlist-page">
      <div className="wishlist-container">
        <div className="wishlist-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <strong>Minha Wishlist</strong>
        </div>

        <section className="wishlist-hero">
          <div className="wishlist-hero-content">
            <span className="wishlist-eyebrow">
              SEUS FAVORITOS
            </span>

            <h1>
              Minha Wishlist
              <span className="wishlist-heart"> ♥</span>
            </h1>

            <p>
              Guarde seus produtos preferidos e
              encontre tudo o que deseja em um só lugar.
            </p>
          </div>

          <div
            className="wishlist-hero-icon"
            aria-hidden="true"
          >
            ♥
          </div>
        </section>

        <div className="wishlist-toolbar">
          <div className="wishlist-summary">
            <h2>Produtos salvos</h2>

            <p>
              <strong>{favoriteProducts.length}</strong>
              {' '}
              {favoriteProducts.length === 1
                ? 'produto favorito'
                : 'produtos favoritos'}
            </p>
          </div>

          {favoriteProducts.length > 0 && (
            <div className="wishlist-actions">
              <label htmlFor="wishlist-order">
                Ordenar por:
              </label>

              <select
                id="wishlist-order"
                value={orderBy}
                onChange={(event) =>
                  setOrderBy(event.target.value)
                }
              >
                <option value="recentes">
                  Adicionados recentemente
                </option>

                <option value="menor-preco">
                  Menor preço
                </option>

                <option value="maior-preco">
                  Maior preço
                </option>

                <option value="nome">
                  Nome (A–Z)
                </option>
              </select>

              <button
                type="button"
                className="wishlist-clear-button"
                onClick={handleClearFavorites}
              >
                Limpar Wishlist
              </button>
            </div>
          )}
        </div>

        {favoriteProducts.length > 0 ? (
          <>
            <div className="wishlist-products">
              <ProductListing
                products={favoriteProducts}
              />
            </div>

            <div className="wishlist-footer">
              <Link
                to="/products"
                className="wishlist-continue-button"
              >
                Continuar comprando
              </Link>
            </div>
          </>
        ) : (
          <section className="wishlist-empty">
            <div
              className="wishlist-empty-icon"
              aria-hidden="true"
            >
              ♡
            </div>

            <h2>Sua Wishlist está vazia</h2>

            <p>
              Você ainda não adicionou produtos
              à sua lista de desejos.
              Explore a loja e clique no coração
              dos produtos que mais gostar.
            </p>

            <Link
              to="/products"
              className="wishlist-explore-button"
            >
              Explorar produtos
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}

export default WishlistPage;
