
import { Link } from 'react-router-dom';
import { useCart } from '../../context/useCart';

import './style.css';

function CartPage() {
  const {
    cartItems,
    cartCount,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  function formatPrice(value) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  function handleClearCart() {
    const confirmed = window.confirm(
      'Deseja realmente remover todos os produtos do carrinho?'
    );

    if (confirmed) {
      clearCart();
    }
  }

  return (
    <main className="cart-page">
      <div className="cart-container">

        <nav className="cart-breadcrumb">
          <Link to="/">Home</Link>
          <span> / </span>
          <span>Meu Carrinho</span>
        </nav>

        <h1>Meu Carrinho</h1>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <h2>Seu carrinho está vazio</h2>

            <p>
              Explore nossos produtos e encontre
              algo especial para você.
            </p>

            <Link
              to="/products"
              className="cart-continue-button"
            >
              Ver produtos
            </Link>
          </div>
        ) : (
          <div className="cart-layout">

            <section className="cart-items">

              <div className="cart-items-header">
                <h2>
                  Produtos no carrinho ({cartCount})
                </h2>

                <button
                  type="button"
                  className="cart-clear-button"
                  onClick={handleClearCart}
                >
                  Esvaziar carrinho
                </button>
              </div>

              {cartItems.map((item) => (
                <article
                  className="cart-item"
                  key={item.cartKey}
                >
                  <div className="cart-item-image">
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  </div>

                  <div className="cart-item-details">

                    <Link
                      to={`/products/${item.id}`}
                      className="cart-item-name"
                    >
                      {item.name}
                    </Link>

                    {item.size && (
                      <p>
                        <strong>Tamanho:</strong>{' '}
                        {item.size}
                      </p>
                    )}

                    {item.color && (
                      <p>
                        <strong>Cor:</strong>{' '}
                        {item.color}
                      </p>
                    )}

                    <p>
                      <strong>Preço unitário:</strong>{' '}
                      {formatPrice(item.price)}
                    </p>

                    <div className="cart-quantity-container">
                      <span>Quantidade:</span>

                      <div className="cart-quantity-control">
                        <button
                          type="button"
                          aria-label={`Diminuir quantidade de ${item.name}`}
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            updateQuantity(
                              item.cartKey,
                              item.quantity - 1
                            )
                          }
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          type="button"
                          aria-label={`Aumentar quantidade de ${item.name}`}
                          onClick={() =>
                            updateQuantity(
                              item.cartKey,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="cart-remove-button"
                      onClick={() =>
                        removeFromCart(item.cartKey)
                      }
                    >
                      Excluir produto
                    </button>
                  </div>

                  <div className="cart-item-total">
                    <span>Subtotal</span>

                    <strong>
                      {formatPrice(
                        item.price * item.quantity
                      )}
                    </strong>
                  </div>
                </article>
              ))}

              <Link
                to="/products"
                className="cart-back-link"
              >
                Continuar comprando
              </Link>
            </section>

            <aside className="cart-summary">

              <h2>Resumo da compra</h2>

              <div className="cart-summary-row">
                <span>
                  Produtos ({cartCount})
                </span>

                <span>
                  {formatPrice(cartTotal)}
                </span>
              </div>

              <div className="cart-summary-row">
                <span>Frete</span>
                <span>A calcular</span>
              </div>

              <div className="cart-summary-total">
                <strong>Total dos produtos</strong>

                <strong>
                  {formatPrice(cartTotal)}
                </strong>
              </div>

              <p className="cart-summary-note">
                O frete será calculado posteriormente.
              </p>

              <Link
                to="/checkout"
                className="cart-checkout-button"
              >
                Finalizar compra
              </Link>

            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

export default CartPage;
