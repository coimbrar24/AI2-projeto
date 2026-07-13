import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

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

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Preenche todos os campos.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As passwords não coincidem.");
      return;
    }

    try {
      setIsLoading(true);

      await api.post("/auth/register", {
        name: formData.username,
        email: formData.email,
        password: formData.password,
      });

      setSuccess("Conta criada com sucesso!");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
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
    <main className="container min-vh-100 d-flex align-items-center justify-content-center py-5">
      <section className="w-100" style={{ maxWidth: "420px" }}>
        <div className="text-center mb-4">
          <h1 className="h2 mb-2">FootCentral</h1>
          <p className="text-muted">Cria a tua conta.</p>
        </div>

        <form
          className="card border-0 shadow-sm text-start"
          onSubmit={handleSubmit}
        >
          <div className="card-body p-4">
            {error && <div className="alert alert-danger">{error}</div>}

            {success && (
              <div className="alert alert-success">{success}</div>
            )}

            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                className="form-control"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                className="form-control"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Confirmar Password</label>
              <input
                className="form-control"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <button
              className="btn btn-primary w-100"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "A criar..." : "Criar Conta"}
            </button>

            <div className="text-center mt-3">
              <small>
                Já tens conta? <Link to="/login">Entrar</Link>
              </small>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Register;