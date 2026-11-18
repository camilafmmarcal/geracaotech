
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/useCart';
import { useAuth } from '../../context/useAuth';
import { calculateShipping } from '../../services/shipping';
import {
  evaluateCoupon,
  hasPreviousOrder
} from '../../services/coupons';
import { saveOrder } from '../../services/orders';

import {
  createSimulatedPayment,
  PAYMENT_METHODS
} from '../../services/payment';

import './payment.css';

import './style.css';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  cep: '',
  address: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: ''
};

const personalFields = ['name', 'email', 'phone'];

const addressFields = [
  'cep',
  'address',
  'number',
  'complement',
  'neighborhood',
  'city',
  'state'
];

function formatPrice(value) {
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function onlyDigits(value) {
  return String(value ?? '').replace(/\D/g, '');
}

function formatPhone(value) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 2) return digits;

  const ddd = digits.slice(0, 2);
  const local = digits.slice(2);

  if (local.length <= 4) {
    return `(${ddd}) ${local}`;
  }

  const split = local.length <= 8 ? 4 : 5;

  return `(${ddd}) ${local.slice(0, split)}-${local.slice(split)}`;
}

function validateForm(form) {
  const errors = {};
  const parts = form.name.trim().split(/\s+/);

  if (
    parts.length < 2 ||
    parts.some((part) => part.length < 2)
  ) {
    errors.name = 'Informe seu nome completo.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Informe um e-mail válido.';
  }

  const phone = onlyDigits(form.phone);

  if (phone.length !== 10 && phone.length !== 11) {
    errors.phone = 'Informe um telefone com DDD.';
  }

  if (onlyDigits(form.cep).length !== 8) {
    errors.cep = 'Informe um CEP com 8 dígitos.';
  }

  if (!form.address.trim()) {
    errors.address = 'Informe o endereço.';
  }

  if (!form.number.trim()) {
    errors.number = 'Informe o número.';
  }

  if (!form.neighborhood.trim()) {
    errors.neighborhood = 'Informe o bairro.';
  }

  if (!form.city.trim()) {
    errors.city = 'Informe a cidade.';
  }

  if (!/^[A-Za-z]{2}$/.test(form.state.trim())) {
    errors.state = 'Informe a UF com 2 letras.';
  }

  return errors;
}

function pickErrors(allErrors, fields) {
  return Object.fromEntries(
    Object.entries(allErrors).filter(
      ([field]) => fields.includes(field)
    )
  );
}

function generateOrderNumber() {
  const date = new Date();

  const datePart = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('');

  const randomPart = Array.from(
    crypto.getRandomValues(new Uint32Array(2))
  )
    .map((number) => number.toString(36).toUpperCase())
    .join('')
    .slice(0, 12);

  return `DS-${datePart}-${randomPart}`;
}

function CheckoutPage() {
  const {
    cartItems,
    cartCount,
    cartTotal,
    clearCart
  } = useCart();

  const { currentUser, isAuthenticated } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [confirmedUf, setConfirmedUf] = useState('');
  const [selectedShipping, setSelectedShipping] = useState('');

  const [draft, setDraft] = useState(() => ({
  ...initialForm,
  name: isAuthenticated && currentUser
    ? currentUser.name ?? ''
    : '',
  email: isAuthenticated && currentUser
    ? currentUser.email ?? ''
    : ''
}));
  const [draftUf, setDraftUf] = useState('');
  const [draftShipping, setDraftShipping] = useState('');

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState('form');
  const [editingCard, setEditingCard] = useState(null);

  const [cepStatus, setCepStatus] = useState('idle');
  const [cepMessage, setCepMessage] = useState('');

  const [completedOrder, setCompletedOrder] = useState(null);

const [paymentMethod, setPaymentMethod] = useState('');

const [cardData, setCardData] = useState({
  name: '',
  number: '',
  expiry: '',
  cvv: ''
});

const [paymentError, setPaymentError] = useState('');

  const confirmationLock = useRef(false);

  const [cepToLookup, setCepToLookup] = useState('');

  // Estados dos cupons.
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [couponError, setCouponError] = useState('');

  const shippingOptions = confirmedUf
    ? calculateShipping(confirmedUf)
    : [];

  const draftShippingOptions = draftUf
    ? calculateShipping(draftUf)
    : [];

  const shipping = shippingOptions.find(
    (option) => option.id === selectedShipping
  );

  const draftShippingOption = draftShippingOptions.find(
    (option) => option.id === draftShipping
  );

  const shippingPrice = shipping?.price ?? 0;

  const couponContext = {
    subtotal: cartTotal,
    shippingPrice,
    accountId: currentUser?.id ?? null,
    previousOrder: currentUser
      ? hasPreviousOrder(currentUser.id)
      : false
  };

  const couponResult = appliedCoupon
    ? evaluateCoupon(appliedCoupon, couponContext)
    : { valid: false, discount: 0 };

  const activeDiscount = couponResult.valid
    ? couponResult.discount
    : 0;

  const orderTotal = Math.max(
    0,
    cartTotal + shippingPrice - activeDiscount
  );

  const draftCouponResult = appliedCoupon
    ? evaluateCoupon(appliedCoupon, {
        ...couponContext,
        shippingPrice: draftShippingOption?.price ?? 0
      })
    : { valid: false, discount: 0 };

  function applyCoupon(event) {
    event.preventDefault();

    const result = evaluateCoupon(
      couponInput,
      couponContext
    );

    if (!result.valid) {
      setAppliedCoupon('');
      setCouponError(result.message);
      setCouponMessage('');
      return;
    }

    setAppliedCoupon(result.code);
    setCouponInput(result.code);
    setCouponError('');
    setCouponMessage(
      `Cupom ${result.code} aplicado.`
    );
  }

  function removeCoupon() {
    setAppliedCoupon('');
    setCouponInput('');
    setCouponError('');
    setCouponMessage('');
  }

  function renderCoupon() {
    return (
      <section
        className="checkout-coupon"
        aria-label="Cupom de desconto"
      >
        <h3>Cupom de desconto</h3>

        <form
          className="checkout-coupon-form"
          onSubmit={applyCoupon}
        >
          <input
            type="text"
            value={couponInput}
            onChange={(event) => {
              setCouponInput(
                event.target.value.toUpperCase()
              );
              setCouponError('');
              setCouponMessage('');
            }}
            placeholder="Digite seu cupom"
            aria-label="Código do cupom"
          />

          <button
            type="submit"
            className="checkout-coupon-apply"
          >
            Aplicar
          </button>
        </form>

        {couponError && (
          <p
            className="checkout-coupon-error"
            role="alert"
          >
            {couponError}
          </p>
        )}

        {couponMessage && (
          <p
            className="checkout-coupon-success"
            role="status"
          >
            {couponMessage}
          </p>
        )}

        {appliedCoupon && !couponResult.valid && (
          <p
            className="checkout-coupon-error"
            role="alert"
          >
            O cupom aplicado deixou de ser válido.
            {' '}
            {couponResult.message}
          </p>
        )}

        {appliedCoupon && (
          <button
            type="button"
            className="checkout-coupon-remove"
            onClick={removeCoupon}
          >
            Remover cupom
          </button>
        )}

        <p className="checkout-coupon-hint">
          Utilize PRIMEIRA10, BEMVINDO20 ou FRETEGRATIS,
          conforme as condições de cada promoção.
        </p>
      </section>
    );
  }

  // Consulta automática do CEP.
  useEffect(() => {
    if (cepToLookup.length !== 8) return;

    const controller = new AbortController();

    async function fetchAddress() {
      setCepStatus('loading');
      setCepMessage('Consultando CEP...');

      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cepToLookup}/json/`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error('Falha na consulta.');
        }

        const data = await response.json();

        if (controller.signal.aborted) return;

        if (data.erro) {
          setCepStatus('error');
          setCepMessage(
            'CEP não encontrado. Confira os números.'
          );
          return;
        }

        const uf = String(
          data.uf ?? ''
        ).toUpperCase();

        setDraft((previous) => ({
          ...previous,
          address: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: uf
        }));

        setDraftUf(uf);
        setCepStatus('success');
        setCepMessage(
          'Endereço localizado. Confira os dados.'
        );

        setErrors((previous) => ({
          ...previous,
          cep: '',
          address: '',
          neighborhood: '',
          city: '',
          state: ''
        }));
      } catch (error) {
        if (error.name === 'AbortError') return;

        setCepStatus('error');
        setCepMessage(
          'Não foi possível consultar o CEP. Tente novamente.'
        );
      }
    }

    const timer = setTimeout(fetchAddress, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [cepToLookup]);

  function handleDraftChange(event) {
    const { name, value } = event.target;
    let newValue = value;

    if (name === 'cep') {
      const digits = onlyDigits(value).slice(0, 8);

      newValue = digits.replace(
        /^(\d{5})(\d)/,
        '$1-$2'
      );

      setDraft((previous) => ({
        ...previous,
        cep: newValue,
        address: '',
        neighborhood: '',
        city: '',
        state: ''
      }));

      setDraftUf('');
      setDraftShipping('');
      setCepStatus('idle');
      setCepMessage('');

      setCepToLookup(digits);
    } else {
      if (name === 'phone') {
        newValue = formatPhone(value);
      }

      if (name === 'state') {
        newValue = value
          .replace(/[^a-zA-Z]/g, '')
          .slice(0, 2)
          .toUpperCase();
      }

      setDraft((previous) => ({
        ...previous,
        [name]: newValue
      }));
    }

    setErrors((previous) => ({
      ...previous,
      [name]: ''
    }));
  }

  function handleDraftShippingChange(event) {
    setDraftShipping(event.target.value);

    setErrors((previous) => ({
      ...previous,
      shipping: ''
    }));
  }

  function validateAddress(data, uf, status) {
    const validationErrors = pickErrors(
      validateForm(data),
      addressFields
    );

    if (
      status !== 'success' ||
      !uf ||
      data.state !== uf
    ) {
      validationErrors.cep =
        'Consulte um CEP válido e mantenha a UF correspondente.';
    }

    return validationErrors;
  }

  function handleInitialSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm(draft);

    Object.assign(
      validationErrors,
      validateAddress(
        draft,
        draftUf,
        cepStatus
      )
    );

    if (!draftShippingOption) {
      validationErrors.shipping =
        'Selecione uma modalidade de entrega.';
    }

    setErrors(validationErrors);

    if (
      Object.keys(validationErrors).length > 0
    ) {
      return;
    }

    setForm({ ...draft });
    setConfirmedUf(draftUf);
    setSelectedShipping(draftShipping);
    setEditingCard(null);
    setStep('review');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  function startEditing(card) {
    setDraft({ ...form });
    setDraftUf(confirmedUf);
    setDraftShipping(selectedShipping);
    setErrors({});
    setCepToLookup('');
    setCepStatus('success');
    setCepMessage('');
    setEditingCard(card);
  }

  function cancelEditing() {
    setDraft({ ...form });
    setDraftUf(confirmedUf);
    setDraftShipping(selectedShipping);
    setErrors({});
    setCepToLookup('');
    setCepStatus('idle');
    setCepMessage('');
    setEditingCard(null);
  }

  function savePersonal() {
    const validationErrors = pickErrors(
      validateForm(draft),
      personalFields
    );

    setErrors(validationErrors);

    if (
      Object.keys(validationErrors).length > 0
    ) {
      return;
    }

    setForm((previous) => ({
      ...previous,
      name: draft.name,
      email: draft.email,
      phone: draft.phone
    }));

    setEditingCard(null);
  }

  function saveAddress() {
    const validationErrors = validateAddress(
      draft,
      draftUf,
      cepStatus
    );

    setErrors(validationErrors);

    if (
      Object.keys(validationErrors).length > 0
    ) {
      return;
    }

    const changedCep = draft.cep !== form.cep;
    const changedUf = draft.state !== form.state;

    setForm((previous) => ({
      ...previous,
      ...Object.fromEntries(
        addressFields.map(
          (field) => [field, draft[field]]
        )
      )
    }));

    setConfirmedUf(draftUf);

    if (changedCep || changedUf) {
      setSelectedShipping('');
    }

    setCepToLookup('');
    setEditingCard(null);
  }

  function saveShipping() {
    if (!draftShippingOption) {
      setErrors({
        shipping:
          'Selecione uma modalidade de entrega.'
      });
      return;
    }

    setSelectedShipping(
      draftShippingOption.id
    );

    setEditingCard(null);
    setErrors({});
  }

  function handleConfirmOrder() {
    if (confirmationLock.current || completedOrder) return;

    const validationErrors = validateForm(form);

    if (
      !confirmedUf ||
      form.state !== confirmedUf ||
      onlyDigits(form.cep).length !== 8
    ) {
      validationErrors.cep = 'Endereço inválido.';
    }

    if (!shipping) {
      validationErrors.shipping = 'Selecione uma entrega.';
    }

    if (editingCard || Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (cartItems.length === 0 || cartTotal <= 0) return;

    // Revalida o cupom antes de confirmar a compra.
    const finalCoupon = appliedCoupon
      ? evaluateCoupon(appliedCoupon, {
          subtotal: cartTotal,
          shippingPrice: shipping.price,
          accountId: currentUser?.id ?? null,
          previousOrder: currentUser
            ? hasPreviousOrder(currentUser.id)
            : false
        })
      : null;

    if (appliedCoupon && !finalCoupon?.valid) {
      setCouponError(
        finalCoupon?.message ||
          'O cupom não está mais disponível.'
      );
      return;
    }

    const discount = finalCoupon?.discount ?? 0;

    const finalTotal = Math.max(
      0,
      cartTotal + shipping.price - discount
    );

let payment;

try {
  payment = createSimulatedPayment(
    paymentMethod,
    cardData
  );

  setPaymentError('');
} catch (error) {
  setPaymentError(error.message);
  return;
}

    confirmationLock.current = true;

    try {
      const order = {
        number: generateOrderNumber(),
        createdAt: new Date().toISOString(),

        accountId: currentUser?.id ?? null,

        customer: { ...form },

        items: cartItems.map((item) => ({
          ...item
        })),

        itemCount: cartCount,
        subtotal: cartTotal,

        shipping: {
          ...shipping
        },

        coupon: finalCoupon?.valid
          ? {
              code: finalCoupon.code,
              discount
            }
          : null,


discount,
total: finalTotal,
payment,
status:
  payment.status === 'Aprovado (simulado)'
    ? 'Confirmado (simulado)'
    : 'Aguardando pagamento (simulado)'

      };

      // Registra a compra demonstrativa no navegador.
      // O registro permite simular a regra de primeira compra.

const saved = saveOrder(order);

if (!saved) {
  throw new Error('Número de pedido duplicado.');
}


      setCompletedOrder(order);
      setStep('success');
      clearCart();

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } catch (error) {
      confirmationLock.current = false;

      console.error(
        'Erro ao confirmar pedido simulado:',
        error
      );

      setErrors({
        confirmation:
          'Não foi possível registrar o pedido. Tente novamente.'
      });
    }
  }

function renderPaymentOptions() {
  return (
    <section className="checkout-card checkout-payment">
      <h2>Forma de pagamento</h2>

      <p>
        Escolha uma modalidade demonstrativa.
        Nenhuma cobrança será realizada.
      </p>

      <div className="checkout-payment-options">
        {Object.entries(PAYMENT_METHODS).map(
          ([method, label]) => (
            <label
              key={method}
              className="checkout-payment-option"
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method}
                checked={paymentMethod === method}
                onChange={() => {
                  setPaymentMethod(method);
                  setPaymentError('');
                }}
              />

              <span>{label}</span>
            </label>
          )
        )}
      </div>

      {paymentMethod === 'credit' && (
        <div className="checkout-payment-fields">
          <p>
            Utilize exclusivamente dados inventados.
          </p>

          <label>
            Nome fictício no cartão
            <input
              value={cardData.name}
              autoComplete="off"
              onChange={(event) =>
                setCardData((previous) => ({
                  ...previous,
                  name: event.target.value
                }))
              }
            />
          </label>

          <label>
            Número fictício (16 dígitos)
            <input
              value={cardData.number}
              inputMode="numeric"
              maxLength={16}
              autoComplete="off"
              onChange={(event) =>
                setCardData((previous) => ({
                  ...previous,
                  number: event.target.value
                    .replace(/\D/g, '')
                    .slice(0, 16)
                }))
              }
            />
          </label>


<label>
  Validade fictícia (MM/AA)
  <input
    type="text"
    inputMode="numeric"
    value={cardData.expiry}
    placeholder="MM/AA"
    maxLength={5}
    autoComplete="off"
    onChange={(event) => {
      const digits = event.target.value
        .replace(/\D/g, '')
        .slice(0, 4);

      const formatted =
        digits.length > 2
          ? `${digits.slice(0, 2)}/${digits.slice(2)}`
          : digits;

      setCardData((previous) => ({
        ...previous,
        expiry: formatted
      }));

      setPaymentError('');
    }}
  />
</label>


          <label>
            CVV fictício
            <input
              value={cardData.cvv}
              inputMode="numeric"
              maxLength={4}
              autoComplete="off"
              onChange={(event) =>
                setCardData((previous) => ({
                  ...previous,
                  cvv: event.target.value
                    .replace(/\D/g, '')
                    .slice(0, 4)
                }))
              }
            />
          </label>
        </div>
      )}

      {paymentMethod === 'pix' && (
        <p>
          Um identificador Pix fictício será criado
          após a confirmação.
        </p>
      )}

      {paymentMethod === 'boleto' && (
        <p>
          Uma referência de boleto fictícia será
          criada após a confirmação.
        </p>
      )}

      {paymentError && (
        <p className="checkout-error" role="alert">
          {paymentError}
        </p>
      )}
    </section>
  );
}

  function renderField(label, name, options = {}) {
    const {
      type = 'text',
      placeholder = '',
      required = true,
      maxLength
    } = options;

    return (
      <div className="checkout-field">
        <label htmlFor={`checkout-${name}`}>
          {label}
          {required && <span> *</span>}
        </label>

        <input
          id={`checkout-${name}`}
          name={name}
          type={type}
          value={draft[name]}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          onChange={handleDraftChange}
          aria-invalid={Boolean(errors[name])}
        />

        {errors[name] && (
          <small
            className="checkout-error"
            role="alert"
          >
            {errors[name]}
          </small>
        )}

        {name === 'cep' && cepMessage && (
          <small
            className={`checkout-cep-message ${cepStatus}`}
            role="status"
          >
            {cepStatus === 'loading' && (
              <span
                className="checkout-cep-spinner"
                aria-hidden="true"
              />
            )}

            {cepMessage}
          </small>
        )}
      </div>
    );
  }

  function renderPersonalFields() {
    return (
      <div className="checkout-fields">
        {renderField('Nome completo', 'name', {
          placeholder: 'Digite seu nome completo'
        })}

        {renderField('E-mail', 'email', {
          type: 'email',
          placeholder: 'exemplo@email.com'
        })}

        {renderField('Telefone', 'phone', {
          type: 'tel',
          placeholder: '(85) 99999-9999'
        })}
      </div>
    );
  }

  function renderAddressFields() {
    return (
      <div className="checkout-fields checkout-fields-grid">
        {renderField('CEP', 'cep', {
          placeholder: '00000-000',
          maxLength: 9
        })}

        {renderField('Endereço', 'address', {
          placeholder: 'Rua ou avenida'
        })}

        {renderField('Número', 'number', {
          placeholder: '123'
        })}

        {renderField('Complemento', 'complement', {
          placeholder: 'Apartamento, bloco...',
          required: false
        })}

        {renderField('Bairro', 'neighborhood', {
          placeholder: 'Seu bairro'
        })}

        {renderField('Cidade', 'city', {
          placeholder: 'Sua cidade'
        })}

        {renderField('Estado (UF)', 'state', {
          placeholder: 'CE',
          maxLength: 2
        })}
      </div>
    );
  }

  function renderShippingOptions() {
    if (
      !draftUf ||
      cepStatus !== 'success' ||
      draft.state !== draftUf
    ) {
      return (
        <p className="shipping-placeholder">
          Consulte um CEP válido para escolher a entrega.
        </p>
      );
    }

    if (draftShippingOptions.length === 0) {
      return (
        <p className="shipping-placeholder">
          Não há modalidades disponíveis para este destino.
        </p>
      );
    }

    return (
      <>
        <p className="shipping-region">
          Região de entrega:{' '}
          <strong>
            {draftShippingOptions[0].region}
          </strong>
        </p>

        <div className="shipping-options">
          {draftShippingOptions.map((option) => (
            <label
              key={option.id}
              className={`shipping-option ${
                draftShipping === option.id
                  ? 'selected'
                  : ''
              }`}
            >
              <input
                type="radio"
                name="shipping"
                value={option.id}
                checked={draftShipping === option.id}
                onChange={handleDraftShippingChange}
              />

              <span className="shipping-option-info">
                <strong>{option.name}</strong>
                <small>{option.deliveryTime}</small>
              </span>

              <strong className="shipping-option-price">
                {formatPrice(option.price)}
              </strong>
            </label>
          ))}
        </div>
      </>
    );
  }

  function renderShippingError() {
    return errors.shipping ? (
      <small
        className="checkout-error"
        role="alert"
      >
        {errors.shipping}
      </small>
    ) : null;
  }

  function renderProducts(items = cartItems) {
    return items.map((item) => (
      <div
        className="checkout-item"
        key={item.cartKey}
      >
        <img
          src={item.image}
          alt={item.name}
        />

        <div>
          <strong>{item.name}</strong>

          <p>
            Quantidade: {item.quantity}
          </p>

          {item.size && (
            <p>Tamanho: {item.size}</p>
          )}

          {item.color && (
            <p>Cor: {item.color}</p>
          )}

          <strong className="checkout-item-price">
            {formatPrice(
              item.price * item.quantity
            )}
          </strong>
        </div>
      </div>
    ));
  }

  function renderTotals(
    subtotal = cartTotal,
    freight = shipping,
    total = orderTotal,
    count = cartCount,
    discount = activeDiscount,
    couponCode = couponResult.valid
      ? couponResult.code
      : ''
  ) {
    return (
      <>
        <div className="checkout-summary-values">
          <div className="checkout-summary-row">
            <span>Produtos ({count})</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <div className="checkout-summary-row">
            <span>Frete</span>

            <span>
              {freight
                ? formatPrice(freight.price)
                : 'Selecione a entrega'}
            </span>
          </div>

          {discount > 0 && (
            <div className="checkout-summary-row checkout-discount-row">
              <span>
                Desconto
                {couponCode
                  ? ` (${couponCode})`
                  : ''}
              </span>

              <strong>
                - {formatPrice(discount)}
              </strong>
            </div>
          )}
        </div>

        <div className="checkout-total">
          <span>
            {freight
              ? 'Total do pedido'
              : 'Subtotal dos produtos'}
          </span>

          <strong>
            {formatPrice(total)}
          </strong>
        </div>
      </>
    );
  }

  function renderEditActions(onSave) {
    return (
      <div className="checkout-inline-actions">
        <button
          type="button"
          className="checkout-edit-button"
          onClick={cancelEditing}
        >
          Cancelar
        </button>

        <button
          type="button"
          className="checkout-submit-button"
          disabled={cepStatus === 'loading'}
          onClick={onSave}
        >
          Salvar alterações
        </button>
      </div>
    );
  }

  function renderEditButton(card) {
    if (editingCard) return null;

    return (
      <button
        type="button"
        className="checkout-edit-button"
        onClick={() => startEditing(card)}
      >
        Editar
      </button>
    );
  }

  // A tela de sucesso deve ser verificada
  // antes de verificar se o carrinho está vazio.
  if (step === 'success' && completedOrder) {
    const order = completedOrder;
    const customer = order.customer;

    return (
      <main className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-success">
            <div
              className="checkout-success-icon"
              aria-hidden="true"
            >
              ✓
            </div>

            <h1>Pedido simulado confirmado!</h1>

            <p className="checkout-success-description">
              Sua compra de demonstração foi registrada
              nesta sessão. Nenhum pagamento foi realizado.
            </p>

            <div className="checkout-success-number">
              <span>Número do pedido</span>
              <strong>{order.number}</strong>
            </div>

            <p className="checkout-success-date">
              Data:{' '}
              {new Date(order.createdAt).toLocaleString(
                'pt-BR'
              )}
            </p>
          </div>

          <div className="checkout-review-layout checkout-success-details">
            <section className="checkout-card checkout-review-card">
              <h2>Cliente</h2>

              <p>
                <strong>Nome:</strong> {customer.name}
              </p>

              <p>
                <strong>E-mail:</strong> {customer.email}
              </p>

              <p>
                <strong>Telefone:</strong> {customer.phone}
              </p>
            </section>

            <section className="checkout-card checkout-review-card">
              <h2>Endereço de entrega</h2>

              <p>
                {customer.address}, {customer.number}
                {customer.complement
                  ? ` — ${customer.complement}`
                  : ''}
              </p>

              <p>{customer.neighborhood}</p>
              <p>{customer.city} - {customer.state}</p>
              <p>CEP: {customer.cep}</p>
            </section>

            <section className="checkout-card checkout-review-card">
              <h2>Entrega</h2>

              <p>
                <strong>{order.shipping.name}</strong>
              </p>

              <p>
                Prazo ilustrativo:{' '}
                {order.shipping.deliveryTime}
              </p>

              <p>
                Frete:{' '}
                {formatPrice(order.shipping.price)}
              </p>
            </section>

<section className="checkout-card checkout-review-card">
  <h2>Pagamento simulado</h2>

  <p>
    <strong>Método:</strong>{' '}
    {order.payment.label}
  </p>

  <p>
    <strong>Status:</strong>{' '}
    {order.payment.status}
  </p>

  {order.payment.reference && (
    <p style={{ overflowWrap: 'anywhere' }}>
      <strong>Referência fictícia:</strong>{' '}
      {order.payment.reference}
    </p>
  )}

  <p>
    Para Pix e boleto, a confirmação fictícia
    poderá ser realizada nos detalhes do pedido,
    quando estiver vinculado a uma conta.
  </p>
</section>

            <section className="checkout-card checkout-review-card">
              <h2>Resumo do pedido</h2>

              {renderProducts(order.items)}

              {renderTotals(
                order.subtotal,
                order.shipping,
                order.total,
                order.itemCount,
                order.discount,
                order.coupon?.code ?? ''
              )}
            </section>
          </div>

          <div className="checkout-success-actions">
            <Link
              to="/products"
              className="checkout-submit-button checkout-success-link"
            >
              Continuar comprando
            </Link>

            <Link
              to="/"
              className="checkout-back"
            >
              Voltar à página inicial
            </Link>
          </div>

          <p className="checkout-success-disclaimer">
            Este pedido é fictício e não foi enviado
            a uma loja ou transportadora. Os dados não
            foram gravados em um servidor.
          </p>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-container">
          <h1>Finalizar compra</h1>

          <div className="checkout-card">
            <h2>Seu carrinho está vazio</h2>

            <p>
              Adicione produtos antes de finalizar a compra.
            </p>

            <Link
              to="/products"
              className="checkout-back"
            >
              Ver produtos
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-container">
        <nav className="checkout-breadcrumb">
          <Link to="/">Home</Link>
          <span> / </span>
          <Link to="/cart">Meu Carrinho</Link>
          <span> / </span>

          <span>
            {step === 'review'
              ? 'Revisar Pedido'
              : 'Finalizar Compra'}
          </span>
        </nav>

        <h1>
          {step === 'review'
            ? 'Revise seu pedido'
            : 'Finalizar compra'}
        </h1>

        <div className="checkout-progress">
          <span className="checkout-progress-done">
            1. Dados e entrega
          </span>

          <span
            className={
              step === 'review'
                ? 'checkout-progress-active'
                : ''
            }
          >
            2. Revisão
          </span>

          <span>3. Confirmação</span>
        </div>

        {step === 'form' ? (
          <div className="checkout-layout">
            <form
              className="checkout-form"
              onSubmit={handleInitialSubmit}
              noValidate
            >
              <section className="checkout-card">
                <h2>Informações pessoais</h2>

                {isAuthenticated && currentUser && (
                  <p className="checkout-account-info">
                    Compra vinculada ao perfil de{' '}
                    <strong>{currentUser.name}</strong>.
                    Você pode corrigir os dados de
                    entrega sem alterar seu cadastro.
                  </p>
                )}

                {renderPersonalFields()}
              </section>

              <section className="checkout-card">
                <h2>Endereço de entrega</h2>
                {renderAddressFields()}
              </section>

              <section className="checkout-card">
                <h2>Opções de entrega</h2>

                {renderShippingOptions()}
                {renderShippingError()}

                <p className="shipping-disclaimer">
                  Valores e prazos simulados para fins
                  acadêmicos.
                </p>
              </section>

              <div className="checkout-form-actions">
                <Link
                  to="/cart"
                  className="checkout-back"
                >
                  ← Voltar ao carrinho
                </Link>

                <button
                  type="submit"
                  className="checkout-submit-button"
                  disabled={cepStatus === 'loading'}
                >
                  Revisar pedido
                </button>
              </div>
            </form>

            <aside className="checkout-card checkout-summary">
              <h2>Resumo do pedido</h2>

              {renderProducts()}

              {renderCoupon()}

              {renderTotals(
                cartTotal,
                draftShippingOption,
                Math.max(
                  0,
                  cartTotal +
                    (draftShippingOption?.price ?? 0) -
                    (draftCouponResult.valid
                      ? draftCouponResult.discount
                      : 0)
                ),
                cartCount,
                draftCouponResult.valid
                  ? draftCouponResult.discount
                  : 0,
                draftCouponResult.valid
                  ? draftCouponResult.code
                  : ''
              )}

              <p className="checkout-note">
                Nenhum pagamento será realizado.
              </p>
            </aside>
          </div>
        ) : (
          <div className="checkout-review-layout">
            <section className="checkout-card checkout-review-card">
              <div className="checkout-review-heading">
                <h2>Dados pessoais</h2>
                {renderEditButton('personal')}
              </div>

              {editingCard === 'personal' ? (
                <>
                  {renderPersonalFields()}
                  {renderEditActions(savePersonal)}
                </>
              ) : (
                <>
                  <p>
                    <strong>Nome:</strong> {form.name}
                  </p>

                  <p>
                    <strong>E-mail:</strong> {form.email}
                  </p>

                  <p>
                    <strong>Telefone:</strong> {form.phone}
                  </p>
                </>
              )}
            </section>

            <section className="checkout-card checkout-review-card">
              <div className="checkout-review-heading">
                <h2>Endereço de entrega</h2>
                {renderEditButton('address')}
              </div>

              {editingCard === 'address' ? (
                <>
                  {renderAddressFields()}
                  {renderEditActions(saveAddress)}
                </>
              ) : (
                <>
                  <p>
                    {form.address}, {form.number}
                    {form.complement
                      ? ` — ${form.complement}`
                      : ''}
                  </p>

                  <p>{form.neighborhood}</p>
                  <p>{form.city} - {form.state}</p>
                  <p>CEP: {form.cep}</p>
                </>
              )}
            </section>

            <section className="checkout-card checkout-review-card">
              <div className="checkout-review-heading">
                <h2>Entrega selecionada</h2>
                {renderEditButton('shipping')}
              </div>

              {editingCard === 'shipping' ? (
                <>
                  {renderShippingOptions()}
                  {renderShippingError()}
                  {renderEditActions(saveShipping)}
                </>
              ) : shipping ? (
                <>
                  <p>
                    <strong>{shipping.name}</strong>
                  </p>

                  <p>
                    Prazo estimado: {shipping.deliveryTime}
                  </p>

                  <p>
                    Frete: {formatPrice(shipping.price)}
                  </p>
                </>
              ) : (
                <div className="checkout-shipping-required">
                  <p>
                    Selecione novamente uma modalidade
                    de entrega antes de confirmar.
                  </p>

                  {!editingCard && (
                    <button
                      type="button"
                      className="checkout-edit-button"
                      onClick={() =>
                        startEditing('shipping')
                      }
                    >
                      Escolher entrega
                    </button>
                  )}
                </div>
              )}

              <p className="shipping-disclaimer">
                Valores e prazos simulados.
              </p>
            </section>

            <section className="checkout-card checkout-review-card">
              <div className="checkout-review-heading">
                <h2>Produtos do pedido</h2>

                <Link
                  to="/cart"
                  className="checkout-edit-button"
                >
                  Alterar produtos
                </Link>
              </div>

              {renderProducts()}

              {renderCoupon()}

              {renderTotals()}
            </section>

{renderPaymentOptions()}

            <div className="checkout-review-actions">
              <div className="checkout-confirm-info">
                <strong>
                  {shipping
                    ? `Total: ${formatPrice(orderTotal)}`
                    : 'Selecione a entrega'}
                </strong>

                <p>
                  Confirmação demonstrativa, sem
                  pagamento real.
                </p>

                {errors.confirmation && (
                  <p
                    className="checkout-confirm-error"
                    role="alert"
                  >
                    {errors.confirmation}
                  </p>
                )}

                {Object.keys(errors).length > 0 &&
                  !editingCard &&
                  !errors.confirmation && (
                    <p
                      className="checkout-confirm-error"
                      role="alert"
                    >
                      Existem informações pendentes.
                      Corrija os dados antes de confirmar.
                    </p>
                  )}
              </div>

              <button
                type="button"
                className="checkout-submit-button checkout-confirm-button"

disabled={
  Boolean(editingCard) ||
  !shipping ||
  !paymentMethod ||
  cartItems.length === 0
}

                onClick={handleConfirmOrder}
              >
                Confirmar pedido simulado
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default CheckoutPage;
