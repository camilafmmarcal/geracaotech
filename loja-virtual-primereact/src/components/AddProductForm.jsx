import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';

const categories = [
  { label: 'Eletrônicos', value: 'electronics' },
  { label: 'Joias', value: 'jewelery' },
  { label: 'Moda masculina', value: "men's clothing" },
  { label: 'Moda feminina', value: "women's clothing" },
  { label: 'Outros', value: 'others' }
];
const emptyForm = { title: '', price: null, category: null, image: '', description: '' };

export default function AddProductForm({ visible, onHide, onAdd }) {
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const update = (field, value) => setForm((previous) => ({ ...previous, [field]: value }));
  const valid = form.title.trim().length >= 3 && Number.isFinite(form.price) && form.price > 0 && Boolean(form.category);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (!valid) return;
    onAdd({ ...form, title: form.title.trim(), description: form.description.trim(), image: form.image.trim() || '/placeholder.svg', id: Date.now(), isLocal: true });
    setForm(emptyForm);
    setSubmitted(false);
    onHide();
  };

  return (
    <Dialog header="Cadastrar novo produto" visible={visible} onHide={onHide} modal draggable={false} className="product-dialog" style={{ width: 'min(92vw, 520px)' }}>
      <p className="form-intro">Preencha os campos abaixo para adicionar um item à vitrine.</p>
      <form onSubmit={handleSubmit} className="product-form" noValidate>
        <label htmlFor="title">Nome do produto *</label>
        <InputText id="title" value={form.title} onChange={(event) => update('title', event.target.value)} placeholder="Ex.: Fone de ouvido sem fio" className={submitted && form.title.trim().length < 3 ? 'p-invalid' : ''} maxLength={100} />
        {submitted && form.title.trim().length < 3 && <small className="field-error">Informe pelo menos 3 caracteres.</small>}
        <div className="grid">
          <div className="col-12 sm:col-6 form-column"><label htmlFor="price">Preço (R$) *</label><InputNumber inputId="price" value={form.price} onValueChange={(event) => update('price', event.value)} mode="currency" currency="BRL" locale="pt-BR" min={0} placeholder="R$ 0,00" className={submitted && !(form.price > 0) ? 'p-invalid' : ''} />{submitted && !(form.price > 0) && <small className="field-error">Informe um preço maior que zero.</small>}</div>
          <div className="col-12 sm:col-6 form-column"><label htmlFor="category">Categoria *</label><Dropdown inputId="category" value={form.category} onChange={(event) => update('category', event.value)} options={categories} placeholder="Selecione" className={submitted && !form.category ? 'p-invalid' : ''} />{submitted && !form.category && <small className="field-error">Selecione uma categoria.</small>}</div>
        </div>
        <label htmlFor="image">URL da imagem (opcional)</label>
        <InputText id="image" type="url" value={form.image} onChange={(event) => update('image', event.target.value)} placeholder="https://exemplo.com/imagem.jpg" />
        <label htmlFor="description">Descrição (opcional)</label>
        <InputTextarea id="description" value={form.description} onChange={(event) => update('description', event.target.value)} rows={3} autoResize maxLength={350} placeholder="Descreva brevemente o produto" />
        <div className="form-actions"><Button label="Cancelar" type="button" text severity="secondary" onClick={onHide} /><Button label="Adicionar produto" type="submit" icon="pi pi-check" /></div>
      </form>
    </Dialog>
  );
}
