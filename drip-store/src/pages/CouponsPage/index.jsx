
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { coupons } from '../../services/coupons';

import './style.css';

function CouponsPage() {
  const [copiedCoupon, setCopiedCoupon] =
    useState('');

  const [copyError, setCopyError] =
    useState('');

  async function handleCopyCoupon(code) {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error(
          'Área de transferência indisponível.'
        );
      }

      await navigator.clipboard.writeText(code);

      setCopiedCoupon(code);
      setCopyError('');
    } catch {
      setCopiedCoupon('');

      setCopyError(
        `Não foi possível copiar automaticamente. Selecione o código ${code} para copiá-lo.`
      );
    }
  }

  return (
    <main className="coupons-page">
      <div className="coupons-page-container">

        {/* NAVEGAÇÃO */}
        <nav
          className="coupons-breadcrumb"
          aria-label="Navegação"
        >
          <Link to="/">Home</Link>
          <span>/</span>
          <strong>Cupons exclusivos</strong>
        </nav>

        {/* CABEÇALHO */}
        <div className="coupons-page-header">
          <div>
            <span className="coupons-page-eyebrow">
              BENEFÍCIOS EXCLUSIVOS
            </span>

            <h1>
              Cupons para aproveitar mais!
            </h1>

            <p>
              Escolha seu desconto, copie o código
              e utilize na finalização da compra.
            </p>
          </div>

          <span
            className="coupons-page-header-icon"
            aria-hidden="true"
          >
            %
          </span>
        </div>

        {/* LISTAGEM DE CUPONS */}
        <div className="coupons-page-grid">
          {coupons.map((coupon) => {
            const isCopied =
              copiedCoupon === coupon.code;

            return (
              <article
                key={coupon.id}
                className={`coupon-page-card coupon-page-${coupon.theme}`}
              >
                <div className="coupon-page-card-top">
                  <span className="coupon-page-tag">
                    CUPOM ESPECIAL
                  </span>

                  <span
                    className="coupon-page-icon"
                    aria-hidden="true"
                  >
                    {coupon.icon}
                  </span>
                </div>

                <div className="coupon-page-value">
                  <strong>
                    {coupon.value}
                  </strong>

                  <span>
                    {coupon.suffix}
                  </span>
                </div>

                <h2>
                  {coupon.title}
                </h2>

                <p className="coupon-page-description">
                  {coupon.description}
                </p>

                <div className="coupon-page-condition">
                  <span aria-hidden="true">
                    ⓘ
                  </span>

                  <p>
                    {coupon.condition}
                  </p>
                </div>

                <div className="coupon-page-code-box">
                  <span className="coupon-page-code-label">
                    SEU CÓDIGO
                  </span>

                  <strong>
                    {coupon.code}
                  </strong>
                </div>

                <button
                  type="button"
                  className={`coupon-page-copy-button ${
                    isCopied ? 'copied' : ''
                  }`}
                  onClick={() =>
                    handleCopyCoupon(coupon.code)
                  }
                >
                  {isCopied
                    ? '✓ Código copiado!'
                    : 'Copiar cupom'}
                </button>
              </article>
            );
          })}
        </div>

        {/* ERROS DE CÓPIA */}
        {copyError && (
          <p
            className="coupons-page-error"
            role="alert"
          >
            {copyError}
          </p>
        )}

        {/* RODAPÉ */}
        <div className="coupons-page-footer">
          <p>
            Os cupons não são cumulativos.
            A elegibilidade e o desconto são
            verificados no checkout.
          </p>

          <Link
            to="/products"
            className="coupons-page-shop-link"
          >
            Aproveitar ofertas
            <span aria-hidden="true">
              →
            </span>
          </Link>
        </div>

      </div>
    </main>
  );
}

export default CouponsPage;
