
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './style.css';

function Footer() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }, [location.pathname, location.search]);

  const informationLinks = [
    { label: 'Sobre Drip Store', to: '/about' },
    { label: 'Segurança', to: '/security' },
    { label: 'Wishlist', to: '/wishlist' },
    { label: 'Blog', to: '/blog' },
    { label: 'Trabalhe conosco', to: '/careers' }
  ];

  const categoryLinks = [
    { label: 'Tênis', category: 'Tênis' },
    { label: 'Acessórios', category: 'Acessórios' }
  ];

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-brand">
          <Link
            to="/"
            className="footer-logo"
            onClick={scrollToTop}
          >
            Drip Store
          </Link>

          <p>
            Sua loja de estilo e atitude.
            Encontre produtos que combinam
            com você.
          </p>

          <div className="footer-social">
  <a
    href="https://www.instagram.com/geekdeboa_"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram da Drip Store"
  >
    Instagram
  </a>
</div>
  </div>

        <div className="footer-column">
          <h3>Informação</h3>

          {informationLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={scrollToTop}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="footer-column">
          <h3>Categorias</h3>

          {categoryLinks.map((link) => (
            <Link
              key={link.category}
              to={`/products?category=${encodeURIComponent(
                link.category
              )}`}
              onClick={scrollToTop}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="footer-column">
          <h3>Contato</h3>

          <p>
            Entre em contato com nossa equipe
            pelos canais oficiais da loja.
          </p>

          <Link
            to="/contact"
            className="footer-contact-link"
            onClick={scrollToTop}
          >
            Fale conosco
          </Link>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Drip Store.
          Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
