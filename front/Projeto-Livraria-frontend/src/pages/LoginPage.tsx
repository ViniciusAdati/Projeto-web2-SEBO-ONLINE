// src/pages/LoginPage.tsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// Importa o CSS que acabamos de criar
import "../styles/AuthPage.css";
import { useAuth } from "../hooks/useAuth"; // Importa o hook

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(""); // Estado para erro
  const navigate = useNavigate();
  const { login } = useAuth(); // Pega a função de login do contexto

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(""); // Limpa erros antigos

    try {
      await login(email, password); // Chama a função de login do AuthContext
      navigate("/"); // Redireciona para a Home (dashboard)
    } catch (error: any) {
      console.error("Falha no login:", error);
      // Define a mensagem de erro
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Email ou senha inválidos.";
      setFormError(errorMessage);
    }
  };

  return (
    <div className="auth-container">
      {/* Coluna da Esquerda (Login) */}
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

          {/* Mostra a mensagem de erro */}
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

      {/* Coluna da Direita (Novos Clientes) */}
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

// Adicione a exportação default
export default LoginPage;
