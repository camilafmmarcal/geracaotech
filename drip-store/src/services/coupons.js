
/*
 * DRIP STORE
 * Serviço centralizado de cupons promocionais
 *
 * Implementação acadêmica com persistência local.
 */

const HISTORY_KEY =
  'drip-store-demo-order-history-v1';

// ==========================================
// CATÁLOGO DE CUPONS
// ==========================================

export const coupons = [
  {
    id: 1,
    code: 'PRIMEIRA10',
    value: '10%',
    suffix: 'OFF',
    title: 'Sua primeira compra merece desconto',
    description: '10% de desconto nos produtos.',
    condition:
      'Exclusivo para a primeira compra de clientes cadastrados.',
    icon: '✦',
    theme: 'pink',
    type: 'percentage',
    percentage: 10,
    minimumSubtotal: 0,
    requiresAccount: true,
    firstOrderOnly: true
  },
  {
    id: 2,
    code: 'BEMVINDO20',
    value: 'R$ 20',
    suffix: 'OFF',
    title: 'Economize mais no seu pedido',
    description:
      'R$ 20 de desconto no valor dos produtos.',
    condition:
      'Válido em compras a partir de R$ 150,00.',
    icon: '★',
    theme: 'purple',
    type: 'fixed',
    amount: 20,
    minimumSubtotal: 150,
    requiresAccount: false,
    firstOrderOnly: false
  },
  {
    id: 3,
    code: 'FRETEGRATIS',
    value: 'FRETE',
    suffix: 'GRÁTIS',
    title: 'A entrega é por nossa conta',
    description:
      'Desconto equivalente ao valor do frete.',
    condition:
      'Válido em compras a partir de R$ 300,00.',
    icon: '➜',
    theme: 'blue',
    type: 'shipping',
    minimumSubtotal: 300,
    requiresAccount: false,
    firstOrderOnly: false
  }
];

// ==========================================
// HISTÓRICO DE PEDIDOS
// ==========================================

function readHistory() {
  const raw = localStorage.getItem(HISTORY_KEY);

  if (!raw) {
    return [];
  }

  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error('Histórico local inválido.');
  }

  return parsed;
}

export function hasPreviousOrder(accountId) {
  if (!accountId) {
    return false;
  }

  try {
    return readHistory().some(
      (order) => order.accountId === accountId
    );
  } catch {
    // Em caso de falha, não concedemos
    // o benefício de primeira compra.
    return true;
  }
}

export function recordDemoOrder(
  orderNumber,
  accountId
) {
  const history = readHistory();

  if (
    history.some(
      (order) => order.number === orderNumber
    )
  ) {
    return;
  }

  history.push({
    number: orderNumber,
    accountId: accountId || null
  });

  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(history)
  );
}

// ==========================================
// VALIDAÇÃO DE CUPONS
// ==========================================

export function evaluateCoupon(value, context = {}) {
  const code = String(value || '')
    .trim()
    .toUpperCase();

  const subtotal = Math.max(
    0,
    Number(context.subtotal) || 0
  );

  const shipping = Math.max(
    0,
    Number(context.shippingPrice) || 0
  );

  const invalid = (message) => ({
    valid: false,
    code,
    discount: 0,
    message
  });

  if (!code) {
    return invalid('Digite um cupom.');
  }

  const coupon = coupons.find(
    (item) => item.code === code
  );

  if (!coupon) {
    return invalid(
      'Cupom inexistente ou indisponível.'
    );
  }

  // Verifica necessidade de conta cadastrada.
  if (
    coupon.requiresAccount &&
    !context.accountId
  ) {
    return invalid(
      `Entre em uma conta cadastrada para utilizar ${code}.`
    );
  }

  // Verifica se é a primeira compra.
  if (
    coupon.firstOrderOnly &&
    context.previousOrder
  ) {
    return invalid(
      `${code} é exclusivo para a primeira compra.`
    );
  }

  // Verifica valor mínimo da compra.
  if (subtotal < coupon.minimumSubtotal) {
    const minimum =
      coupon.minimumSubtotal.toLocaleString(
        'pt-BR',
        {
          style: 'currency',
          currency: 'BRL'
        }
      );

    return invalid(
      `${code} exige subtotal de pelo menos ${minimum}.`
    );
  }

  // Calcula o desconto.
let discount;

  switch (coupon.type) {
    case 'percentage':
      discount =
        Math.round(
          subtotal * coupon.percentage
        ) / 100;
      break;

    case 'fixed':
      discount = Math.min(
        coupon.amount,
        subtotal
      );
      break;

    case 'shipping':
      discount = shipping;
      break;

    default:
      return invalid(
        'Tipo de cupom não reconhecido.'
      );
  }

  return {
    valid: true,
    code,
    discount
  };
}
