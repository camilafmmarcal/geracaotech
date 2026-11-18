
import { useState } from 'react';
import { Link } from 'react-router-dom';


const initialForm = {
  name: '',
  email: '',
  subject: '',
  message: ''
};

function ContactPage() {
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
            Atendimento
          </span>

          <h1>Entre em contato</h1>

          <p>
            Utilize nosso formulário demonstrativo
            para conhecer o funcionamento de uma
            página de atendimento.
          </p>
        </header>

        <form
          className="institutional-form"
          onSubmit={handleSubmit}
        >
          <div className="institutional-field">
            <label htmlFor="contact-name">
              Nome completo
            </label>
            <input
              id="contact-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              minLength={3}
              autoComplete="name"
            />
          </div>

          <div className="institutional-field">
            <label htmlFor="contact-email">
              E-mail
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="institutional-field">
            <label htmlFor="contact-subject">
              Assunto
            </label>
            <select
              id="contact-subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
            >
              <option value="">
                Selecione o assunto
              </option>
              <option value="Produtos">
                Produtos
              </option>
              <option value="Pedidos">
                Pedidos
              </option>
              <option value="Conta">
                Minha conta
              </option>
              <option value="Outros">
                Outros assuntos
              </option>
            </select>
          </div>

          <div className="institutional-field">
            <label htmlFor="contact-message">
              Mensagem
            </label>
            <textarea
              id="contact-message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Escreva sua mensagem..."
              required
              minLength={10}
              maxLength={1000}
            />
          </div>

          <button
            type="submit"
            className="institutional-button"
          >
            Validar mensagem
          </button>

          {submitted && (
            <div
              className="institutional-success"
              role="status"
            >
              Mensagem validada com sucesso.
              Nenhuma mensagem foi enviada:
              este formulário é demonstrativo.
            </div>
          )}

          {submitted && (
            <button
              type="button"
              onClick={resetForm}
            >
              Nova mensagem
            </button>
          )}
        </form>
      </div>
    </main>
  );
}

export default ContactPage;
