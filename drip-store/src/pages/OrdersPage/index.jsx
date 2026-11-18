import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { getOrdersByAccount } from '../../services/orders';
import './style.css';

function formatPrice(value) {
  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Data indisponível';
  }

  return date.toLocaleString('pt-BR');
}

function OrdersPage() {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  const orders = getOrdersByAccount(currentUser.id);

  return (
    <main className="orders-page">
      <div className="orders-container">
        <nav className="orders-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <strong>Meus Pedidos</strong>
        </nav>

        <div className="orders-header">
          <div>
            <span className="orders-eyebrow">
              MINHA CONTA
            </span>

            <h1>Meus Pedidos</h1>

            <p>
              Consulte suas compras realizadas
              na Drip Store.
            </p>
          </div>

          <span className="orders-counter">
            {orders.length}
            {' '}
            {orders.length === 1
              ? 'pedido'
              : 'pedidos'}
          </span>
        </div>

        {orders.length === 0 ? (
          <section className="orders-empty">
            <div className="orders-empty-icon">
              📦
            </div>

            <h2>Nenhum pedido encontrado</h2>

            <p>
              Você ainda não possui compras
              registradas nesta conta.
            </p>

            <Link
              to="/products"
              className="orders-primary-button"
            >
              Explorar produtos
            </Link>
          </section>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <article
                key={order.number}
                className="orders-card"
              >
                <div className="orders-card-header">
                  <div>
                    <span className="orders-label">
                      NÚMERO DO PEDIDO
                    </span>

                    <h2>{order.number}</h2>

                    <p>
                      Realizado em{' '}
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <span className="orders-status">
                    {order.status || 'Confirmado'}
                  </span>
                </div>

                <div className="orders-products">
                  {(order.items || []).map(
                    (item, index) => (
                      <div
                        key={item.cartKey || index}
                        className="orders-product"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                        />

                        <div className="orders-product-info">
                          <strong>{item.name}</strong>

                          <span>
                            Quantidade: {item.quantity}
                          </span>

                          {item.size && (
                            <span>
                              Tamanho: {item.size}
                            </span>
                          )}

                          {item.color && (
                            <span>
                              Cor: {item.color}
                            </span>
                          )}
                        </div>

                        <strong className="orders-product-price">
                          {formatPrice(
                            item.price * item.quantity
                          )}
                        </strong>
                      </div>
                    )
                  )}
                </div>

                <div className="orders-card-footer">
                  <div>
                    <span>Total do pedido</span>
                    <strong>
                      {formatPrice(order.total)}
                    </strong>
                  </div>

                  <Link
                    to={`/orders/${encodeURIComponent(
                      order.number
                    )}`}
                    className="orders-details-button"
                  >
                    Ver detalhes
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        <p className="orders-disclaimer">
          Histórico demonstrativo armazenado
          neste navegador. Nenhum pagamento
          real foi realizado.
        </p>
      </div>
    </main>
  );
}

export default OrdersPage;