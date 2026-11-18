
import { useState } from 'react';

import {
  Link,
  Navigate,
  useParams
} from 'react-router-dom';

import { useAuth } from '../../context/useAuth';

import {
  getOrderByNumber,
  confirmSimulatedPayment
} from '../../services/orders';

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

function OrderDetailsPage() {
  const { orderNumber } = useParams();
  const { currentUser, isAuthenticated } = useAuth();

const [, setRevision] = useState(0);
const [paymentError, setPaymentError] = useState('');


  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  const order = getOrderByNumber(
    orderNumber,
    currentUser.id
  );

function handleConfirmPayment() {
  try {
    const confirmed = confirmSimulatedPayment(
      order.number,
      currentUser.id
    );

    if (!confirmed) {
      setPaymentError(
        'Não foi possível confirmar o pagamento fictício.'
      );
      return;
    }

    setPaymentError('');
    setRevision((previous) => previous + 1);
  } catch {
    setPaymentError(
      'Falha ao atualizar o pagamento demonstrativo.'
    );
  }
}

  if (!order) {
    return (
      <main className="order-details-page">
        <div className="order-details-container">
          <nav className="order-details-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/orders">Meus Pedidos</Link>
            <span>/</span>
            <strong>Pedido não encontrado</strong>
          </nav>

          <section className="order-details-not-found">
            <span className="order-details-not-found-icon">
              📦
            </span>

            <h1>Pedido não encontrado</h1>

            <p>
              Este pedido não existe ou não está
              associado à sua conta.
            </p>

            <Link
              to="/orders"
              className="order-details-primary-button"
            >
              Voltar aos meus pedidos
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const customer = order.customer || {};
  const items = Array.isArray(order.items)
    ? order.items
    : [];

  const shipping = order.shipping || {};
  const coupon = order.coupon;

  return (
    <main className="order-details-page">
      <div className="order-details-container">

        {/* NAVEGAÇÃO */}
        <nav className="order-details-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>

          <Link to="/orders">
            Meus Pedidos
          </Link>

          <span>/</span>
          <strong>Detalhes do Pedido</strong>
        </nav>

        {/* CABEÇALHO */}
        <header className="order-details-header">
          <div>
            <span className="order-details-eyebrow">
              MINHA CONTA / HISTÓRICO
            </span>

            <h1>Detalhes do Pedido</h1>

            <p>
              Consulte as informações da sua compra.
            </p>
          </div>

          <Link
            to="/orders"
            className="order-details-back"
          >
            ← Voltar aos pedidos
          </Link>
        </header>

        {/* IDENTIFICAÇÃO DO PEDIDO */}
        <section className="order-details-card order-details-order-header">
          <div>
            <span className="order-details-label">
              NÚMERO DO PEDIDO
            </span>

            <h2>{order.number}</h2>

            <p>
              Realizado em {formatDate(order.createdAt)}
            </p>
          </div>

          <span className="order-details-status">
            {order.status || 'Confirmado'}
          </span>
        </section>

        <div className="order-details-layout">

          {/* COLUNA PRINCIPAL */}
          <div className="order-details-main">

            {/* PRODUTOS */}
            <section className="order-details-card">
              <h2>Produtos comprados</h2>

              <div className="order-details-products">
                {items.map((item, index) => (
                  <div
                    key={item.cartKey || index}
                    className="order-details-product"
                  >
                    <img
                      src={item.image}
                      alt={item.name || 'Produto'}
                    />

                    <div className="order-details-product-info">
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

                      <span>
                        Valor unitário:{' '}
                        {formatPrice(item.price)}
                      </span>
                    </div>

                    <strong className="order-details-product-price">
                      {formatPrice(
                        item.price * item.quantity
                      )}
                    </strong>
                  </div>
                ))}
              </div>
            </section>

            {/* CLIENTE */}
            <section className="order-details-card">
              <h2>Dados do cliente</h2>

              <div className="order-details-info-list">
                <p>
                  <strong>Nome:</strong>{' '}
                  {customer.name || 'Não informado'}
                </p>

                <p>
                  <strong>E-mail:</strong>{' '}
                  {customer.email || 'Não informado'}
                </p>

                <p>
                  <strong>Telefone:</strong>{' '}
                  {customer.phone || 'Não informado'}
                </p>
              </div>
            </section>

            {/* ENDEREÇO */}
            <section className="order-details-card">
              <h2>Endereço de entrega</h2>

              <div className="order-details-info-list">
                <p>
                  {customer.address || 'Endereço não informado'}
                  {customer.number
                    ? `, ${customer.number}`
                    : ''}
                </p>

                {customer.complement && (
                  <p>{customer.complement}</p>
                )}

                <p>{customer.neighborhood}</p>

                <p>
                  {customer.city}
                  {customer.state
                    ? ` - ${customer.state}`
                    : ''}
                </p>

                <p>CEP: {customer.cep}</p>
              </div>
            </section>

            {/* ENTREGA */}
            <section className="order-details-card">
              <h2>Informações de entrega</h2>

              <div className="order-details-info-list">
                <p>
                  <strong>Modalidade:</strong>{' '}
                  {shipping.name || 'Não informada'}
                </p>

                <p>
                  <strong>Prazo ilustrativo:</strong>{' '}
                  {shipping.deliveryTime || 'Não informado'}
                </p>

                <p>
                  <strong>Frete:</strong>{' '}
                  {formatPrice(shipping.price)}
                </p>
              </div>
            </section>
          </div>

<section className="order-details-card">
  <h2>Informações de pagamento</h2>

  {order.payment ? (
    <div className="order-details-info-list">
      <p>
        <strong>Forma:</strong>{' '}
        {order.payment.label}
      </p>

      <p>
        <strong>Situação:</strong>{' '}
        {order.payment.status}
      </p>

      <p>
        <strong>Registrado em:</strong>{' '}
        {formatDate(order.payment.createdAt)}
      </p>

      {order.payment.paidAt && (
        <p>
          <strong>Aprovação fictícia:</strong>{' '}
          {formatDate(order.payment.paidAt)}
        </p>
      )}

      {order.payment.reference && (
        <p style={{ overflowWrap: 'anywhere' }}>
          <strong>Referência sem validade:</strong>{' '}
          {order.payment.reference}
        </p>
      )}

      {order.payment.status === 'Pendente (simulado)' &&
        ['pix', 'boleto'].includes(order.payment.method) && (
          <button
            type="button"
            className="order-details-primary-button"
            onClick={handleConfirmPayment}
          >
            Simular confirmação do pagamento
          </button>
        )}

      {paymentError && (
        <p role="alert">{paymentError}</p>
      )}
    </div>
  ) : (
    <p>
      Pedido anterior à implementação do pagamento
      simulado. Não há informações de pagamento
      registradas.
    </p>
  )}
</section>

          {/* RESUMO FINANCEIRO */}
          <aside className="order-details-sidebar">
            <section className="order-details-card order-details-summary">
              <h2>Resumo do pedido</h2>

              <div className="order-details-summary-row">
                <span>
                  Produtos ({order.itemCount || items.length})
                </span>

                <strong>
                  {formatPrice(order.subtotal)}
                </strong>
              </div>

              <div className="order-details-summary-row">
                <span>Frete</span>

                <strong>
                  {formatPrice(shipping.price)}
                </strong>
              </div>

              {coupon && (
                <div className="order-details-coupon">
                  <span>Cupom aplicado</span>
                  <strong>{coupon.code}</strong>
                </div>
              )}

              {Number(order.discount) > 0 && (
                <div className="order-details-summary-row order-details-discount">
                  <span>Desconto</span>

                  <strong>
                    - {formatPrice(order.discount)}
                  </strong>
                </div>
              )}

              <div className="order-details-total">
                <span>Total do pedido</span>

                <strong>
                  {formatPrice(order.total)}
                </strong>
              </div>

              <div className="order-details-payment-notice">
                <span aria-hidden="true">ⓘ</span>

                <p>
                  Compra demonstrativa.
                  Nenhum pagamento real foi realizado.
                </p>
              </div>
            </section>

            <Link
              to="/products"
              className="order-details-primary-button"
            >
              Continuar comprando
            </Link>
          </aside>
        </div>

        <p className="order-details-disclaimer">
          Este pedido é fictício e seus dados estão
          armazenados localmente neste navegador.
          Nenhuma entrega real será realizada.
        </p>
      </div>
    </main>
  );
}

export default OrderDetailsPage;