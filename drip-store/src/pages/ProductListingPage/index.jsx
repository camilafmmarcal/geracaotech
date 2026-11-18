import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import ProductListing from '../../components/ProductListing';
import FilterGroup from '../../components/FilterGroup';
import products from '../../data/products';

import './style.css';

// Marcas disponíveis na loja
const brandOptions = [
  ...new Set([
    'Adidas',
    'JBL',
    'Nike',
    'Outra',
    ...products
      .map((product) => product.brand)
      .filter(Boolean)
  ])
];

// Categorias disponíveis
const categoryOptions = [
  ...new Set(
    products
      .map((product) => product.category)
      .filter(Boolean)
  )
];

// Normaliza textos para facilitar a pesquisa
function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim();
}

function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [orderBy, setOrderBy] = useState('');

  // Pesquisa controlada pela URL
  const search = searchParams.get('filter') ?? '';

  // Coleção selecionada
  const collection = searchParams.get('collection');

  // Promoção selecionada
  const promotion = searchParams.get('promotion');

  const isBlackFriday =
    promotion === 'black-friday';

  const isOtherBrands =
    collection === 'outras-marcas';

  // Categorias selecionadas pela URL
  const categories = (
    searchParams.get('category') ?? ''
  )
    .split(',')
    .map((category) => category.trim())
    .filter((category) =>
      categoryOptions.includes(category)
    );

  // Marcas selecionadas pela URL
  const brands = (
    searchParams.get('brand') ?? ''
  )
    .split(',')
    .filter((brand) =>
      brandOptions.includes(brand)
    );

  // Atualiza somente a pesquisa,
  // preservando os demais parâmetros
  function handleSearchChange(event) {
    const value = event.target.value;

    const newParams = new URLSearchParams(
      searchParams
    );

    if (value) {
      newParams.set('filter', value);
    } else {
      newParams.delete('filter');
    }

    setSearchParams(newParams, {
      replace: true
    });
  }

  // Alterna categorias selecionadas
  function toggleCategory(value) {
    const updatedCategories = categories.includes(value)
      ? categories.filter(
          (category) => category !== value
        )
      : [...categories, value];

    const newParams = new URLSearchParams(
      searchParams
    );

    if (updatedCategories.length > 0) {
      newParams.set(
        'category',
        updatedCategories.join(',')
      );
    } else {
      newParams.delete('category');
    }

    setSearchParams(newParams);
  }

  // Alterna marcas selecionadas
  function toggleBrand(value) {
    const updatedBrands = brands.includes(value)
      ? brands.filter(
          (brand) => brand !== value
        )
      : [...brands, value];

    const newParams = new URLSearchParams(
      searchParams
    );

    // Selecionar uma marca manualmente
    // encerra a coleção especial
    newParams.delete('collection');

    if (updatedBrands.length > 0) {
      newParams.set(
        'brand',
        updatedBrands.join(',')
      );
    } else {
      newParams.delete('brand');
    }

    setSearchParams(newParams);
  }

  // Aplica todos os filtros
  const filteredProducts = products.filter(
    (product) => {
      const normalizedSearch =
        normalizeText(search);

      const matchesSearch =
        normalizeText(product.name)
          .includes(normalizedSearch);

      const matchesCategory =
        categories.length === 0 ||
        categories.includes(
          product.category
        );

      const matchesBrand =
        brands.length === 0 ||
        brands.includes(
          product.brand
        );

      // Exclui Nike e Adidas
      // na coleção "outras marcas"
      const matchesCollection =
        !isOtherBrands ||
        !['Nike', 'Adidas'].includes(
          product.brand
        );

      // Produtos com desconto válido
      const matchesPromotion =
        !isBlackFriday ||
        (
          typeof product.priceDiscount === 'number' &&
          product.priceDiscount < product.price
        );

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBrand &&
        matchesCollection &&
        matchesPromotion
      );
    }
  );

  // Ordenação
  const sortedProducts = [
    ...filteredProducts
  ];

  if (orderBy === 'menor-preco') {
    sortedProducts.sort(
      (a, b) =>
        (a.priceDiscount ?? a.price) -
        (b.priceDiscount ?? b.price)
    );
  }

  if (orderBy === 'maior-preco') {
    sortedProducts.sort(
      (a, b) =>
        (b.priceDiscount ?? b.price) -
        (a.priceDiscount ?? a.price)
    );
  }

  // Limpa todos os filtros
  function clearFilters() {
    setOrderBy('');
    setSearchParams({});
  }

  // Define o título da página
  function getPageTitle() {
    if (isBlackFriday) {
      return 'Black Friday Drip Store';
    }

    if (isOtherBrands) {
      return 'Explore outras marcas';
    }

    if (search.trim()) {
      return 'Resultados da pesquisa';
    }

    if (categories.length === 1) {
      return `Categoria: ${categories[0]}`;
    }

    if (categories.length > 1) {
      return 'Categorias selecionadas';
    }

    return 'Todos os produtos';
  }

  return (
    <main className="products-page">
      <div className="products-page-container">

        <div className="products-page-header">
          <div>
            <h1>{getPageTitle()}</h1>

            <p>
              <strong>
                {sortedProducts.length}
                {' '}
                {sortedProducts.length === 1
                  ? 'produto'
                  : 'produtos'}
              </strong>
              {' '}encontrados
            </p>
          </div>

          <div className="products-order">
            <label htmlFor="orderBy">
              Ordenar por:
            </label>

            <select
              id="orderBy"
              value={orderBy}
              onChange={(event) =>
                setOrderBy(
                  event.target.value
                )
              }
            >
              <option value="">
                Selecione
              </option>

              <option value="menor-preco">
                Menor preço
              </option>

              <option value="maior-preco">
                Maior preço
              </option>
            </select>
          </div>
        </div>

        <div className="products-search">
          <input
            type="search"
            placeholder="Buscar produtos..."
            aria-label="Buscar produtos pelo nome"
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <div className="products-content">

          <aside className="products-sidebar">
            <h2>Filtrar por</h2>

            <hr />

            <FilterGroup
              title="Categoria"
              options={categoryOptions}
              selectedValues={categories}
              onChange={toggleCategory}
            />

            <FilterGroup
              title="Marca"
              options={brandOptions}
              selectedValues={brands}
              onChange={toggleBrand}
            />

            <button
              type="button"
              className="clear-filters"
              onClick={clearFilters}
            >
              Limpar filtros
            </button>
          </aside>

          <div className="products-results">
            {sortedProducts.length > 0 ? (
              <ProductListing
                products={sortedProducts}
              />
            ) : (
              <p className="products-empty">
                Nenhum produto encontrado
                para os critérios selecionados.
              </p>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}

export default ProductListingPage;