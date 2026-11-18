
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { useAuth } from '../../context/useAuth';
import { useWishlist } from '../../context/useWishlist';

import './style.css';

function ProductCard({
  id,
  name,
  image,
  price,
  priceDiscount
}) {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  const {
    isFavorite,
    toggleFavorite
  } = useWishlist();

  const favorite = isFavorite(id);

  const hasDiscount =
    typeof priceDiscount === 'number' &&
    priceDiscount < price;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((price - priceDiscount) / price) * 100
      )
    : 0;

  const formatPrice = (value) =>
    value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

  function handleFavoriteClick() {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    toggleFavorite(id);
  }

  return (
    <article className="product-card">
      <div className="product-card-image">
        {hasDiscount && (
          <span className="product-card-badge">
            {discountPercentage}% OFF
          </span>
        )}

        <button
          type="button"
          className={`product-favorite-button ${
            favorite ? 'is-favorite' : ''
          }`}
          onClick={handleFavoriteClick}
          aria-label={
            favorite
              ? `Remover ${name} dos favoritos`
              : `Adicionar ${name} aos favoritos`
          }
          aria-pressed={favorite}
          title={
            favorite
              ? 'Remover dos favoritos'
              : 'Adicionar aos favoritos'
          }
        >
          <svg
            viewBox="0 0 24 24"
            width="23"
            height="23"
            fill={favorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
          </svg>
        </button>

        <Link
          to={`/products/${id}`}
          className="product-card-image-link"
          aria-label={`Ver detalhes de ${name}`}
        >
          <img
            src={image}
            alt={name}
            loading="lazy"
          />
        </Link>
      </div>

      <Link
        to={`/products/${id}`}
        className="product-card-link"
        aria-label={`Ver detalhes de ${name}`}
      >
        <div className="product-card-info">
          <span className="product-card-category">
            Produto
          </span>

          <p className="product-card-name">
            {name}
          </p>

          <div className="product-card-prices">
            {hasDiscount ? (
              <>
                <span className="product-old-price">
                  {formatPrice(price)}
                </span>

                <strong className="product-discount-price">
                  {formatPrice(priceDiscount)}
                </strong>
              </>
            ) : (
              <strong className="product-price">
                {formatPrice(price)}
              </strong>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;
