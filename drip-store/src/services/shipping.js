
const shippingRegions = {
  Nordeste: {
    states: ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'],
    economy: 14.90,
    express: 29.90
  },
  Sudeste: {
    states: ['ES', 'MG', 'RJ', 'SP'],
    economy: 19.90,
    express: 34.90
  },
  Sul: {
    states: ['PR', 'RS', 'SC'],
    economy: 24.90,
    express: 39.90
  },
  'Centro-Oeste': {
    states: ['DF', 'GO', 'MT', 'MS'],
    economy: 22.90,
    express: 37.90
  },
  Norte: {
    states: ['AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO'],
    economy: 29.90,
    express: 44.90
  }
};

export function calculateShipping(state) {
  const uf = String(state ?? '').trim().toUpperCase();

  const regionEntry = Object.entries(shippingRegions)
    .find(([, config]) => config.states.includes(uf));

  if (!regionEntry) {
    return [];
  }

  const [region, config] = regionEntry;

  return [
    {
      id: 'economy',
      name: 'Entrega econômica',
      price: config.economy,
      deliveryTime: '7 a 10 dias úteis',
      region
    },
    {
      id: 'express',
      name: 'Entrega expressa',
      price: config.express,
      deliveryTime: '2 a 4 dias úteis',
      region
    }
  ];
}
