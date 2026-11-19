import React from 'react';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';

const money = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export default function ProductCard({ product }) {
  const { title, price, image, category, description, isLocal } = product;
  const header = (
    <div className="product-image-wrap">
      <img className="product-image" src={image || '/placeholder.svg'} alt={title} loading="lazy" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/placeholder.svg'; }} />
      {isLocal && <Tag className="new-tag" value="Novo" severity="success" />}
    </div>
  );

  return (
    <Card className="product-card h-full" header={header}>
      <div className="product-info">
        <span className="product-category">{category || 'Outros'}</span>
        <h3 title={title}>{title}</h3>
        <p className="product-description" title={description}>{description || 'Produto disponível em nossa vitrine.'}</p>
        <div className="product-bottom">
          <strong className="product-price">{money(price)}</strong>
          <Button icon="pi pi-shopping-bag" rounded outlined aria-label={`Visualizar ${title}`} tooltip="Produto demonstrativo" tooltipOptions={{ position: 'top' }} />
        </div>
      </div>
    </Card>
  );
}
