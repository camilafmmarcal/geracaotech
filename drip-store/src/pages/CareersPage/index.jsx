
import { useState } from 'react';
import { Link } from 'react-router-dom';

const initialForm = {
  name: '',
  email: '',
  area: '',
  message: ''
};

function CareersPage() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));

    setSubmitted(false);
  }

  function handleSubmit(event) {
    event.preventDefault();

    setSubmitted(true);
  }

  function resetForm() {
    setForm(initialForm);
    setSubmitted(false);
  }

  return (
    <main className="institutional-page">
      <div className="institutional-container">
        <Link to="/" className="institutional-back">
          ← Voltar para Home
        </Link>

        <header className="institutional-heading">
          <span className="institutional-eyebrow">
            Oportunidades
          </span>

          <h1>Trabalhe conosco</h1>

          <p>
            Conheça o formulário demonstrativo de
            candidatura da Drip Store.
          </p>
        </header>

        <form
          className="institutional-form"
          onSubmit={handleSubmit}
        >
          <div className="institutional-field">
            <label htmlFor="career-name">
              Nome completo
            </label>
            <input
              id="career-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              minLength={3}
              autoComplete="name"
            />
          </div>

          <div className="institutional-field">
            <label htmlFor="career-email">
              E-mail
            </label>
            <input
              id="career-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="institutional-field">
            <label htmlFor="career-area">
              Área de interesse
            </label>
            <select
              id="career-area"
              name="area"
              value={form.area}
              onChange={handleChange}
              required
            >
              <option value="">
                Selecione uma área
              </option>
              <option value="Tecnologia">
                Tecnologia
              </option>
              <option value="Design">
                Design
              </option>
              <option value="Marketing">
                Marketing
              </option>
              <option value="Atendimento">
                Atendimento
              </option>
            </select>
          </div>

          <div className="institutional-field">
            <label htmlFor="career-message">
              Apresentação
            </label>
            <textarea
              id="career-message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Descreva seu interesse pela área..."
              required
              minLength={10}
              maxLength={1000}
            />
          </div>

          <button
            type="submit"
            className="institutional-button"
          >
            Validar candidatura
          </button>

          {submitted && (
            <div
              className="institutional-success"
              role="status"
            >
              Formulário validado com sucesso.
              Esta é uma demonstração: nenhuma
              candidatura foi enviada ou armazenada.
            </div>
          )}

          {submitted && (
            <button
              type="button"
              onClick={resetForm}
            >
              Preencher novamente
            </button>
          )}

          <p>
            Este formulário é exclusivamente
            demonstrativo. Não representa uma vaga
            de emprego aberta.
          </p>
        </form>
      </div>
    </main>
  );
}

export default CareersPage;
