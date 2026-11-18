
export const PAYMENT_METHODS = {
  pix: 'Pix',
  credit: 'Cartão de crédito',
  boleto: 'Boleto bancário'
};

export function createSimulatedPayment(method, card = {}) {
  if (!PAYMENT_METHODS[method]) {
    throw new Error('Selecione uma forma de pagamento.');
  }

  if (method === 'credit') {
    const name = String(card.name || '').trim();
    const number = String(card.number || '').replace(/\D/g, '');
    const expiry = String(card.expiry || '').trim();
    const cvv = String(card.cvv || '').replace(/\D/g, '');

    if (
      name.length < 3 ||
      !/^\d{16}$/.test(number) ||
      !/^\d{2}\/\d{2}$/.test(expiry) ||
      !/^\d{3,4}$/.test(cvv)
    ) {
      throw new Error(
        'Preencha os dados fictícios do cartão corretamente.'
      );
    }

    const [month, year] = expiry.split('/').map(Number);
    const now = new Date();

    if (
      month < 1 ||
      month > 12 ||
      2000 + year < now.getFullYear() ||
      (2000 + year === now.getFullYear() &&
        month < now.getMonth() + 1)
    ) {
      throw new Error(
        'Informe uma validade futura para o cartão fictício.'
      );
    }
  }

  const now = new Date().toISOString();

  return {
    method,
    label: PAYMENT_METHODS[method],
    status:
      method === 'credit'
        ? 'Aprovado (simulado)'
        : 'Pendente (simulado)',
    createdAt: now,
    paidAt: method === 'credit' ? now : null,
    reference:
      method === 'pix'
        ? `PIX-DEMO-${crypto.randomUUID()}`
        : method === 'boleto'
          ? `BOLETO-DEMO-${crypto.randomUUID()}`
          : null
  };
}
