
const ORDERS_KEY = 'drip-store-demo-orders-v1';

const LEGACY_HISTORY_KEY =
  'drip-store-demo-order-history-v1';

function readArray(key) {
  const raw = localStorage.getItem(key);

  if (!raw) return [];

  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error(`Dados inválidos em ${key}.`);
  }

  return parsed;
}

export function getOrders() {
  try {
    return readArray(ORDERS_KEY);
  } catch (error) {
    console.error('Erro ao consultar pedidos:', error);
    return [];
  }
}

export function getOrdersByAccount(accountId) {
  if (!accountId) return [];

  return getOrders()
    .filter((order) => order.accountId === accountId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
}

export function getOrderByNumber(orderNumber, accountId) {
  if (!orderNumber || !accountId) return null;

  return (
    getOrders().find(
      (order) =>
        order.number === orderNumber &&
        order.accountId === accountId
    ) || null
  );
}

export function hasPreviousOrder(accountId) {
  if (!accountId) return false;

  try {
    const orders = readArray(ORDERS_KEY);
    const legacyHistory = readArray(LEGACY_HISTORY_KEY);

    return [...orders, ...legacyHistory].some(
      (order) => order.accountId === accountId
    );
  } catch {
    return true;
  }
}

export function saveOrder(order) {
  if (!order?.number) {
    throw new Error('Pedido sem número.');
  }

  const orders = readArray(ORDERS_KEY);
  const legacyHistory = readArray(LEGACY_HISTORY_KEY);

  if (
    orders.some(
      (savedOrder) => savedOrder.number === order.number
    )
  ) {
    return false;
  }

  const completeOrder = {
    ...order,
    status: order.payment?.status === 'Aprovado (simulado)'
      ? 'Confirmado (simulado)'
      : 'Aguardando pagamento (simulado)'
  };

  const updatedOrders = [...orders, completeOrder];

  const updatedHistory = legacyHistory.some(
    (item) => item.number === order.number
  )
    ? legacyHistory
    : [
        ...legacyHistory,
        {
          number: order.number,
          accountId: order.accountId || null
        }
      ];

  localStorage.setItem(
    ORDERS_KEY,
    JSON.stringify(updatedOrders)
  );

  try {
    localStorage.setItem(
      LEGACY_HISTORY_KEY,
      JSON.stringify(updatedHistory)
    );
  } catch (error) {
    try {
      localStorage.setItem(
        ORDERS_KEY,
        JSON.stringify(orders)
      );
    } catch (rollbackError) {
      console.error(
        'Falha ao restaurar pedidos:',
        rollbackError
      );
    }

    throw error;
  }

  return true;
}

export function confirmSimulatedPayment(
  orderNumber,
  accountId
) {
  if (!orderNumber || !accountId) return false;

  const orders = readArray(ORDERS_KEY);

  const index = orders.findIndex(
    (order) =>
      order.number === orderNumber &&
      order.accountId === accountId &&
      ['pix', 'boleto'].includes(order.payment?.method) &&
      order.payment.status === 'Pendente (simulado)'
  );

  if (index === -1) return false;

  const now = new Date().toISOString();

  orders[index] = {
    ...orders[index],
    status: 'Confirmado (simulado)',
    payment: {
      ...orders[index].payment,
      status: 'Aprovado (simulado)',
      paidAt: now
    }
  };

  localStorage.setItem(
    ORDERS_KEY,
    JSON.stringify(orders)
  );

  return true;
}
