import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import {
  IoClose,
  IoMenu,
  IoSearch,
  IoSettingsSharp,
} from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import "./Navbar.css";

const links = [
  { label: "Home", to: "/" },
  { label: "Competições", to: "/competitions" },
  { label: "Equipas", to: "/teams" },
  { label: "Notícias", to: "/news" },
];

function Search({ mobile = false, onSearch }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [value, setValue] = useState(query);

  useEffect(() => {
    setValue(query);
  }, [query]);

  const submitSearch = (event) => {
    event.preventDefault();
    const nextQuery = value.trim();

    navigate(nextQuery ? `/search?q=${encodeURIComponent(nextQuery)}` : "/teams");
    onSearch?.();
  };

  return (
    <form
      className={`fc-search ${mobile ? "fc-search-mobile" : "fc-search-desktop"}`}
      role="search"
      onSubmit={submitSearch}
    >
      <button
        type="submit"
        className="fc-search-submit"
        aria-label="Executar pesquisa"
      >
        <IoSearch aria-hidden="true" />
      </button>
      <input
        type="search"
        aria-label="Pesquisar"
        placeholder="Pesquisar equipa ou competição..."
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      {value && (
        <button
          type="button"
          className="fc-search-clear"
          aria-label="Limpar pesquisa"
          onClick={() => {
            setValue("");
            navigate("/teams");
            onSearch?.();
          }}
        >
          <IoClose />
        </button>
      )}
    </form>
  );
}

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const closeMenus = () => {
    setMenuOpen(false);
    setAccountOpen(false);
  };

  return (
    <nav className="fc-navbar" aria-label="Navegação principal">
      <div className="fc-navbar-inner">
        <Link className="fc-navbar-brand" to="/" onClick={closeMenus}>
          <img src={logo} alt="FootCentral" className="fc-navbar-logo" />
        </Link>

        <Search onSearch={closeMenus} />

        <button
          className="fc-menu-btn"
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <IoClose /> : <IoMenu />}
        </button>

        <div className={`fc-nav-content ${menuOpen ? "show" : ""}`}>
          <Search mobile onSearch={closeMenus} />

          <ul className="fc-nav-links">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={closeMenus}
                  className={({ isActive }) =>
                    `fc-nav-link ${isActive ? "active" : ""}`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="fc-account-menu">
            <button
              className="fc-profile-btn"
              type="button"
              aria-label="Abrir menu da conta"
              aria-expanded={accountOpen}
              onClick={() => setAccountOpen((current) => !current)}
            >
              <IoSettingsSharp size={21} />
            </button>

            {accountOpen && (
              <div className="fc-dropdown">
                {isAuthenticated ? (
                  <>
                    <span className="fc-dropdown-user">{user?.name}</span>
                    <Link to="/profile" onClick={closeMenus}>Perfil</Link>
                    <Link to="/favorites" onClick={closeMenus}>Favoritos</Link>
                    <Link to="/settings" onClick={closeMenus}>Definições</Link>
                    <button
                      type="button"
                      className="is-danger"
                      onClick={() => {
                        logout();
                        closeMenus();
                      }}
                    >
                      Terminar sessão
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={closeMenus}>Iniciar sessão</Link>
                    <Link to="/register" onClick={closeMenus}>Criar conta</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
