import { useEffect, useRef, useState } from 'react';
import {
  NavLink,
  Link,
  useNavigate
} from 'react-router-dom';

import Logo from '../Logo';
import { useCart } from '../../context/useCart';
import { useAuth } from '../../context/useAuth';
import { useWishlist } from '../../context/useWishlist';

import './style.css';

function Header() {
  const [search, setSearch] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const navigate = useNavigate();

  const { cartCount } = useCart();
  const { favoriteCount } = useWishlist();

  const {
    currentUser,
    isAuthenticated,
    logout
  } = useAuth();

  const firstName =
    currentUser?.name?.trim().split(/\s+/)[0] ||
    'Cliente';

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener(
      'pointerdown',
      handleOutsideClick
    );

    document.addEventListener(
      'keydown',
      handleEscape
    );

    return () => {
      document.removeEventListener(
        'pointerdown',
        handleOutsideClick
      );

      document.removeEventListener(
        'keydown',
        handleEscape
      );
    };
  }, []);

  function handleSearch(event) {
    event.preventDefault();

    const term = search.trim();

    if (term) {
      navigate(
        `/products?filter=${encodeURIComponent(term)}`
      );
    }
  }

  function handleLogout() {
    setUserMenuOpen(false);
    logout();
    navigate('/');
  }

  function closeUserMenu() {
    setUserMenuOpen(false);
  }

  return (
    <header className="header">
      <div className="header-top">
        <Logo />

        <form
          className="search-form"
          onSubmit={handleSearch}
        >
          <input
            type="search"
            placeholder="Pesquisar produto..."
            aria-label="Pesquisar produto"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          <button
            type="submit"
            aria-label="Pesquisar"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>
          </button>
        </form>

        <div className="header-actions">
          {isAuthenticated ? (
            <div
              className="header-user"
              ref={menuRef}
            >
              <button
                type="button"
                className={`header-user-trigger ${
                  userMenuOpen ? 'is-open' : ''
                }`}
                onClick={() =>
                  setUserMenuOpen((previous) => !previous)
                }
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                aria-controls="header-user-menu"
                title={currentUser?.name || firstName}
              >
                <span className="header-user-avatar">
                  {firstName.charAt(0).toUpperCase()}
                </span>

                <span className="header-user-name">
                  Olá, {firstName}
                </span>

                <svg
                  className="header-user-chevron"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {userMenuOpen && (
                <div
                  id="header-user-menu"
                  className="header-user-dropdown"
                >
                  <div className="header-dropdown-heading">
                    <strong>
                      {currentUser?.name || firstName}
                    </strong>

                    <span>Minha conta Drip Store</span>
                  </div>

                  {/* MEUS PEDIDOS */}
                  <Link
                    to="/orders"
                    className="header-dropdown-link"
                    onClick={closeUserMenu}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M3 7 12 3l9 4v10l-9 4-9-4V7Z" />
                      <path d="m3 7 9 4 9-4" />
                      <path d="M12 11v10" />
                    </svg>

                    <span>Meus Pedidos</span>

                    <svg
                      className="header-dropdown-arrow"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Link>

                  {/* WISHLIST */}
                  <Link
                    to="/wishlist"
                    className="header-dropdown-link"
                    onClick={closeUserMenu}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden="true"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
                    </svg>

                    <span>Minha Wishlist</span>

                    <span className="header-favorites-count">
                      {favoriteCount > 99
                        ? '99+'
                        : favoriteCount}
                    </span>
                  </Link>

                  {/* PRODUTOS */}
                  <Link
                    to="/products"
                    className="header-dropdown-link"
                    onClick={closeUserMenu}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden="true"
                    >
                      <path d="M3 7h18v14H3z" />
                      <path d="M8 7V5a4 4 0 0 1 8 0v2" />
                    </svg>

                    <span>Explorar produtos</span>
                  </Link>

                  <div className="header-dropdown-divider" />

                  {/* SAIR */}
                  <button
                    type="button"
                    className="header-dropdown-logout"
                    onClick={handleLogout}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden="true"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <path d="m16 17 5-5-5-5" />
                      <path d="M21 12H9" />
                    </svg>

                    Sair da conta
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/register"
                className="register-link"
              >
                Cadastre-se
              </Link>

              <Link
                to="/login"
                className="login-button"
              >
                Entrar
              </Link>
            </>
          )}

          <Link
            to="/cart"
            className="cart-icon"
            aria-label={`Carrinho de compras com ${cartCount} itens`}
            title="Meu carrinho"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>

            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <nav
        className="main-navigation"
        aria-label="Navegação principal"
      >
        <NavLink to="/" end>
          Home
        </NavLink>

        <NavLink to="/products">
          Produtos
        </NavLink>

        <NavLink to="/categories">
          Categorias
        </NavLink>

        <NavLink to="/orders">
          Meus Pedidos
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;