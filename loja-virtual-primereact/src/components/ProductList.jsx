import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import ProductCard from './ProductCard';

const API_URL = 'https://fakestoreapi.com/products';

export default function ProductList({ addedProducts, search, category }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchProducts() {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(API_URL, { signal: controller.signal, timeout: 12000 });
        if (!Array.isArray(response.data)) throw new Error('Resposta inválida da API');
        setProducts(response.data);
      } catch (err) {
        if (err.code !== 'ERR_CANCELED') setError('Não foi possível carregar os produtos da API. Verifique sua conexão e tente novamente.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    fetchProducts();
    return () => controller.abort();
  }, [retry]);

  const allProducts = [...addedProducts, ...products];
  const filtered = allProducts.filter((product) => {
    const matchesText = `${product.title} ${product.description || ''}`.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'));
    return matchesText && (category === 'all' || product.category === category);
  });

  return (
    <section id="produtos" className="catalog-section" aria-label="Catálogo de produtos">
      <div className="section-heading">
        <div><span className="eyebrow">SELEÇÃO ESPECIAL</span><h2>Explore nossos produtos</h2><p>Uma vitrine de produtos para você descobrir.</p></div>
        <span className="result-count">{filtered.length} {filtered.length === 1 ? 'produto' : 'produtos'}</span>
      </div>
      {loading && <div className="state-box" role="status"><ProgressSpinner style={{ width: '44px', height: '44px' }} /><p>Carregando produtos...</p></div>}
      {error && <div className="error-box" role="alert"><i className="pi pi-exclamation-circle" /><span>{error}</span><Button label="Tentar novamente" outlined size="small" onClick={() => setRetry((value) => value + 1)} /></div>}
      {!loading && filtered.length === 0 && <div className="state-box"><i className="pi pi-search empty-icon" /><h3>Nenhum produto encontrado</h3><p>Tente outro termo ou categoria.</p></div>}
      <div className="grid product-grid">
        {filtered.map((product) => <div className="col-12 sm:col-6 lg:col-4 xl:col-3" key={`${product.isLocal ? 'local' : 'api'}-${product.id}`}><ProductCard product={product} /></div>)}
      </div>
    </section>
  );
}
