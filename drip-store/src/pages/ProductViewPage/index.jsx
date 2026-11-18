
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import products from '../../data/products';
import ProductGallery from '../../components/ProductGallery';
import ProductOptions from '../../components/ProductOptions';
import { useCart } from '../../context/useCart';

import './style.css';

function ProductDetails({ product }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [purchaseMessage, setPurchaseMessage] = useState('');
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const { addToCart } = useCart();

  const finalPrice = product.priceDiscount ?? product.price;

  function formatPrice(value) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  function clearMessage() {
    setPurchaseMessage('');
    setPurchaseSuccess(false);
  }

  function handleBuy() {
    clearMessage();

    if (product.sizes?.length && !selectedSize) {
      setPurchaseMessage(
        'Selecione um tamanho para continuar.'
      );
      return;
    }

    if (product.unavailableSizes?.includes(selectedSize)) {
      setPurchaseMessage('Este tamanho está esgotado.');
      return;
    }

    if (product.colors?.length && !selectedColor) {
      setPurchaseMessage(
        'Selecione uma cor para continuar.'
      );
      return;
    }

    addToCart(product, selectedSize, selectedColor);

    setPurchaseSuccess(true);
    setPurchaseMessage(
      'Produto adicionado ao carrinho com sucesso!'
    );
  }

  return (
    <main className="product-view-page">
      <div className="product-view-container">

        <nav className="product-breadcrumb">
          <Link to="/">Home</Link>
          <span> / </span>
          <Link to="/products">Produtos</Link>
          <span> / </span>
          <span>{product.name}</span>
        </nav>

        <div className="product-view-content">

          <ProductGallery
            images={product.images ?? [product.image]}
            productName={product.name}
          />

          <div className="product-view-info">

            <span className="product-view-category">
              {product.category}
            </span>

            <h1>{product.name}</h1>

            <p className="product-view-brand">
              Marca: {product.brand}
            </p>

            <div className="product-view-prices">
              {product.priceDiscount != null &&
                product.priceDiscount < product.price && (
                  <span className="product-view-old-price">
                    {formatPrice(product.price)}
                  </span>
                )}

              <strong className="product-view-final-price">
                {formatPrice(finalPrice)}
              </strong>
            </div>

            <h2>Descrição do produto</h2>

            <p className="product-view-description">
              {product.description ??
                'Confira os detalhes deste produto e encontre a opção ideal para você.'}
            </p>

            <ProductOptions
              title="Tamanho"
              options={product.sizes ?? []}
              unavailableOptions={
                product.unavailableSizes ?? []
              }
              selected={selectedSize}
              onChange={(size) => {
                setSelectedSize(size);
                clearMessage();
              }}
            />

            <ProductOptions
              title="Cor"
              options={product.colors ?? []}
              selected={selectedColor}
              onChange={(color) => {
                setSelectedColor(color);
                clearMessage();
              }}
              shape="circle"
            />

            <div className="product-purchase-actions">

              <button
                type="button"
                className="product-buy-button"
                onClick={handleBuy}
              >
                COMPRAR
              </button>

              {purchaseMessage && (
                <div
                  className={
                    purchaseSuccess
                      ? 'purchase-feedback success'
                      : 'purchase-feedback error'
                  }
                  role={purchaseSuccess ? 'status' : 'alert'}
                >
                  <div className="purchase-feedback-message">
                    <span aria-hidden="true">
                      {purchaseSuccess ? '✓' : '!'}
                    </span>

                    <span>{purchaseMessage}</span>
                  </div>

                  {purchaseSuccess && (
                    <Link
                      to="/cart"
                      className="purchase-feedback-link"
                    >
                      Ver carrinho →
                    </Link>
                  )}
                </div>
              )}

              <Link
                to="/products"
                className="product-view-back"
              >
                ← Voltar aos produtos
              </Link>

            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

function ProductViewPage() {
  const { id } = useParams();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <main className="product-view-page">
        <div className="product-view-container">
          <h1>Produto não encontrado</h1>

          <Link
            to="/products"
            className="product-view-back"
          >
            Voltar aos produtos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <ProductDetails
      key={product.id}
      product={product}
    />
  );
}

export default ProductViewPage;
