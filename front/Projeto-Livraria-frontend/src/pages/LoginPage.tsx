import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AuthPage.css";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");

    try {
      await login(email, password);
      navigate("/");
    } catch (error: any) {
      console.error("Falha no login:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Email ou senha inválidos.";
      setFormError(errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-column">
        <h2>Clientes Registrados</h2>
        <p>Se você tem uma conta, acesse com seu endereço de e-mail e senha.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">
              E-mail <span>*</span>
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="senha">
              Senha <span>*</span>
            </label>
            <input
              type="password"
              id="senha"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {formError && <p className="form-error-message">{formError}</p>}

          <div className="form-checkbox">
            <input type="checkbox" id="showPass" />
            <label htmlFor="showPass">Show Password</label>
          </div>
          <button type="submit" className="auth-button">
            Entrar
          </button>
          <a href="#" className="form-link">
            Esqueceu a sua senha?
          </a>
          <p className="required-text">* Campos Obrigatórios</p>
        </form>
      </div>

      <div className="auth-column">
        <h2>Novos Clientes</h2>
        <p>
          Se você ainda não tem uma conta em nossa plataforma, aproveite para se
          registrar e desfrutar de todos os nossos recursos.
        </p>
        <Link to="/register" className="auth-button auth-button-secondary">
          Criar Conta
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
