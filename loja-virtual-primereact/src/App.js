import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import ProductList from './components/ProductList';
import AddProductForm from './components/AddProductForm';

const categoryOptions = [
  { label: 'Todas as categorias', value: 'all' },
  { label: 'Eletrônicos', value: 'electronics' },
  { label: 'Joias', value: 'jewelery' },
  { label: 'Moda masculina', value: "men's clothing" },
  { label: 'Moda feminina', value: "women's clothing" },
  { label: 'Outros', value: 'others' }
];

export default function App() {
  const [addedProducts, setAddedProducts] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const toast = useRef(null);

  function addProduct(product) {
    setAddedProducts((previous) => [product, ...previous]);
    setSearch('');
    setCategory('all');
    toast.current?.show({ severity: 'success', summary: 'Produto cadastrado!', detail: 'O novo item já está disponível na vitrine.', life: 3500 });
  }

  return (
    <div className="app-shell">
      <Toast ref={toast} />
      <header className="site-header"><div className="container header-inner"><a className="brand" href="#inicio"><span className="brand-icon"><i className="pi pi-shopping-bag" /></span><span>nova<span className="brand-accent">store</span><small>SEU ESTILO, SUAS ESCOLHAS</small></span></a><nav aria-label="Navegação principal"><a href="#inicio">Início</a><a href="#produtos">Produtos</a></nav><Button label="Novo produto" icon="pi pi-plus" className="header-add" onClick={() => setDialogVisible(true)} /></div></header>
      <main id="inicio">
        <section className="hero"><div className="container hero-content"><div className="hero-copy"><span className="hero-pill"><i className="pi pi-sparkles" /> SUA NOVA EXPERIÊNCIA DE COMPRA</span><h1>Descubra produtos.<br /><span>Encontre seu estilo.</span></h1><p>Explore nossa seleção de produtos e encontre o que combina com você. Simples, rápido e do seu jeito.</p><div className="hero-actions"><a className="hero-link" href="#produtos">Explorar produtos <i className="pi pi-arrow-right" /></a><span><i className="pi pi-check-circle" /> Variedade em um só lugar</span></div></div><div className="hero-art" aria-hidden="true"><div className="art-circle circle-one" /><div className="art-circle circle-two" /><div className="art-card"><i className="pi pi-shopping-bag" /><span>Seu próximo favorito<br />está aqui.</span><i className="pi pi-arrow-up-right" /></div><div className="art-star star-one">✦</div><div className="art-star star-two">✳</div></div></div></section>
        <div className="container"><div className="toolbar"><div className="search-box"><i className="pi pi-search" /><InputText aria-label="Buscar produtos" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar produtos..." /></div><Dropdown aria-label="Filtrar categoria" value={category} options={categoryOptions} onChange={(event) => setCategory(event.value)} className="category-dropdown" /><Button label="Adicionar produto" icon="pi pi-plus" onClick={() => setDialogVisible(true)} className="toolbar-add" /></div><ProductList addedProducts={addedProducts} search={search} category={category} /></div>
      </main>
      <footer className="site-footer"><div className="container footer-inner"><span><strong>novastore</strong> — Projeto acadêmico de loja virtual</span><span>React • PrimeReact • PrimeFlex • Axios • Fake Store API</span></div></footer>
      <AddProductForm visible={dialogVisible} onHide={() => setDialogVisible(false)} onAdd={addProduct} />
    </div>
  );
}
