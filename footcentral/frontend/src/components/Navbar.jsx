import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IoSettingsSharp } from "react-icons/io5";
import logo from "../assets/logo.png";
import "./Navbar.css";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg fc-navbar">
      <div className="container-xxl">

        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img
            src={logo}
            alt="FootCentral"
            className="fc-navbar-logo"
          />
        </Link>

        {/* Pesquisa */}
        <div className="fc-search d-none d-lg-block">
          <input
            className="form-control"
            type="text"
            placeholder="Pesquisar equipa, jogador ou competição..."
          />
        </div>

        {/* Menu Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Conteúdo */}
        <div
          className="collapse navbar-collapse"
          id="navbarMenu"
        >
          <ul className="navbar-nav mx-auto">

            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/competitions">
                Competições
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/teams">
                Equipas
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/news">
                Notícias
              </Link>
            </li>

          </ul>

          {/* Menu da Conta */}

          <div className="dropdown">

            <button
              className="btn fc-profile-btn"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <IoSettingsSharp size={22} />
            </button>

            <ul className="dropdown-menu dropdown-menu-end fc-dropdown">

              {isAuthenticated ? (
                <>
                  <li>
                    <h6 className="dropdown-header">
                      {user?.name}
                    </h6>
                  </li>

                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <Link
                      className="dropdown-item"
                      to="/profile"
                    >
                      Perfil
                    </Link>
                  </li>

                  <li>
                    <Link
                      className="dropdown-item"
                      to="/favorites"
                    >
                      Favoritos
                    </Link>
                  </li>

                  <li>
                    <Link
                      className="dropdown-item"
                      to="/settings"
                    >
                      Definições
                    </Link>
                  </li>

                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <button
                      type="button"
                      className="dropdown-item text-danger"
                      onClick={logout}
                    >
                      Terminar sessão
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/login"
                    >
                      Iniciar sessão
                    </Link>
                  </li>

                  <li>
                    <Link
                      className="dropdown-item"
                      to="/register"
                    >
                      Criar conta
                    </Link>
                  </li>
                </>
              )}

            </ul>

          </div>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;