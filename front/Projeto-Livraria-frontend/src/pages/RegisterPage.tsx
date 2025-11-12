import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AuthPage.css";
import api from "../services/api";

export function RegisterPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");
    if (!nome || !email || !password) {
      setFormError("Todos os campos são obrigatórios.");
      return;
    }
    if (password.length < 6) {
      setFormError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      await api.post("/auth/register", {
        nome: nome,
        email: email,
        senha: password,
      });

      alert("Conta criada com sucesso! Você será redirecionado para o login.");
      navigate("/login");
    } catch (error: any) {
      console.error("Falha no registro:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Erro ao criar conta. Tente outro e-mail.";
      setFormError(errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-column">
        <h2>Criar Nova Conta</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">
              Nome <span>*</span>
            </label>
            <input
              type="text"
              id="nome"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

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
          <button type="submit" className="auth-button">
            Criar Conta
          </button>

          <p className="required-text" style={{ marginTop: "1.5rem" }}>
            * Campos Obrigatórios
          </p>
        </form>
      </div>

      <div className="auth-column">
        <h2>Clientes Registrados</h2>
        <p>Se você já tem uma conta, acesse usando o link abaixo.</p>
        <Link to="/login" className="auth-button auth-button-secondary">
          Fazer Login
        </Link>
      </div>
    </div>
  );
}

export default RegisterPage;
