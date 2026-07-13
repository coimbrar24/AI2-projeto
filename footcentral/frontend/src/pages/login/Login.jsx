import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import logo from "../../assets/logo.png";
import "../../styles/auth.css";

function Login() {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Preenche o email e a password.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.post("/auth/login", formData);

      const { token, user } = response.data;

      login({ token, user });

    } catch (loginError) {

      setError(
        loginError.response?.data?.message ||
          "Não foi possível iniciar sessão."
      );

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-vh-100 d-flex align-items-center justify-content-center">

      <section
        className="w-100 px-3"
        style={{ maxWidth: "430px" }}
      >

        <div className="text-center mb-4">

        <div className="text-center mb-4">
  <img
    src={logo}
    alt="FootCentral"
    className="auth-logo-img"
  />
</div>

          <h1 className="auth-title mb-2">
            FootCentral
          </h1>

          <p className="auth-subtitle">
            Inicia sessão para continuar.
          </p>

        </div>

        <form
          className="auth-card p-4"
          onSubmit={handleSubmit}
        >

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <div className="mb-3">

            <label className="form-label">
              Email
            </label>

            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="nome@email.com"
              value={formData.email}
              onChange={handleChange}
            />

          </div>

          <div className="mb-4">

            <label className="form-label">
              Password
            </label>

            <input
              className="form-control"
              type="password"
              name="password"
              placeholder="A tua password"
              value={formData.password}
              onChange={handleChange}
            />

          </div>

          <button
            type="submit"
            className="btn btn-football w-100"
            disabled={isLoading}
          >
            {isLoading ? "A entrar..." : "Entrar"}
          </button>

          <div className="text-center mt-4">

            <span className="text-secondary">
              Ainda não tens conta?
            </span>

            <br />

            <Link
              to="/register"
              className="auth-link"
            >
              Criar Conta
            </Link>

          </div>

        </form>

      </section>

    </main>
  );
}

export default Login;