import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBack, IoCheckmarkCircleOutline } from "react-icons/io5";
import api from "../../services/api";
import logo from "../../assets/logo.png";
import "../../styles/auth.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Preenche todos os campos.");
      return;
    }

    if (formData.password.length < 6) {
      setError("A password deve ter pelo menos 6 caracteres.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As passwords não coincidem.");
      return;
    }

    try {
      setIsLoading(true);
      await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setSuccess("Conta criada com sucesso!");
      setTimeout(() => navigate("/"), 900);
    } catch (registerError) {
      setError(
        registerError.response?.data?.message ||
          "Não foi possível criar a conta."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <Link to="/" className="auth-back-link">
        <IoArrowBack /> Voltar à Home
      </Link>

      <section className="auth-shell">
        <div className="auth-brand-panel">
          <img src={logo} alt="FootCentral" className="auth-brand-logo" />
          <span className="auth-brand-kicker">A tua casa do futebol</span>
          <h1>Segue o jogo.<br />Vive o futebol.</h1>
          <p>Cria a tua conta para guardares equipas e jogos favoritos.</p>
          <ul>
            <li><IoCheckmarkCircleOutline /> Favoritos sincronizados</li>
            <li><IoCheckmarkCircleOutline /> Resultados e plantéis</li>
            <li><IoCheckmarkCircleOutline /> Tudo num só lugar</li>
          </ul>
        </div>

        <div className="auth-form-panel">
          <div className="auth-form-heading">
            <span>Criar conta</span>
            <h2>Bem-vindo ao FootCentral</h2>
            <p>Demora menos de um minuto.</p>
          </div>

          <form className="auth-card auth-register-card" onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            {success && <div className="alert alert-success py-2">{success}</div>}

            <div className="auth-field">
              <label htmlFor="register-name">Nome</label>
              <input
                id="register-name"
                className="form-control"
                type="text"
                name="name"
                placeholder="O teu nome"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="register-email">Email</label>
              <input
                id="register-email"
                className="form-control"
                type="email"
                name="email"
                placeholder="nome@email.com"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="auth-field-row">
              <div className="auth-field">
                <label htmlFor="register-password">Password</label>
                <input
                  id="register-password"
                  className="form-control"
                  type="password"
                  name="password"
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="auth-field">
                <label htmlFor="register-confirm">Confirmar</label>
                <input
                  id="register-confirm"
                  className="form-control"
                  type="password"
                  name="confirmPassword"
                  placeholder="Repete a password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button className="btn btn-football w-100" type="submit" disabled={isLoading}>
              {isLoading ? "A criar conta..." : "Criar conta"}
            </button>

            <p className="auth-switch">
              Já tens conta? <Link to="/login">Iniciar sessão</Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Register;
