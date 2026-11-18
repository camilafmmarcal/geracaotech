import { useEffect, useMemo, useState } from 'react';
import { CartContext } from './cart-context';

// Identificador utilizado no armazenamento do navegador
const STORAGE_KEY = 'drip-store-cart';

// Recupera os produtos salvos anteriormente
function loadCart() {
  try {
    const savedCart = localStorage.getItem(STORAGE_KEY);

    if (!savedCart) {
      return [];
    }

    const parsedCart = JSON.parse(savedCart);

    return Array.isArray(parsedCart)
      ? parsedCart
      : [];
  } catch (error) {
    console.error(
      'Erro ao recuperar o carrinho:',
      error
    );

    return [];
  }
}

export function CartProvider({ children }) {
  // Recupera o carrinho salvo na inicialização
  const [cartItems, setCartItems] = useState(loadCart);

  // Salva automaticamente sempre que o carrinho mudar
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error(
        'Erro ao salvar o carrinho:',
        error
      );
    }
  }, [cartItems]);

  // Adiciona um produto ao carrinho
  function addToCart(product, size = '', color = '') {
    const cartKey = `${product.id}-${size}-${color}`;

    setCartItems((previousItems) => {
      const existingItem = previousItems.find(
        (item) => item.cartKey === cartKey
      );

      if (existingItem) {
        return previousItems.map((item) =>
          item.cartKey === cartKey
            ? {
                ...item,
                quantity: item.quantity + 1
              }
            : item
        );
      }

      const newItem = {
        cartKey,
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.priceDiscount ?? product.price,
        size,
        color,
        quantity: 1
      };

      return [...previousItems, newItem];
    });
  }

  // Remove um produto específico
  function removeFromCart(cartKey) {
    setCartItems((previousItems) =>
      previousItems.filter(
        (item) => item.cartKey !== cartKey
      )
    );
  }

  // Atualiza a quantidade de um produto
  function updateQuantity(cartKey, quantity) {
    const newQuantity = Number(quantity);

    if (
      !Number.isInteger(newQuantity) ||
      newQuantity < 1
    ) {
      return;
    }

    setCartItems((previousItems) =>
      previousItems.map((item) =>
        item.cartKey === cartKey
          ? {
              ...item,
              quantity: newQuantity
            }
          : item
      )
    );
  }

  // Esvazia completamente o carrinho
  function clearCart() {
    setCartItems([]);
  }

  // Quantidade total de unidades
  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }, [cartItems]);

  // Valor total dos produtos
  const cartTotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
