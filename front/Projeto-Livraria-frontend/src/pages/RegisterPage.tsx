import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// Importa o CSS que já arrumamos para a página de Login
import "../styles/AuthPage.css";
// Precisamos do 'api' para fazer a chamada de registro
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

    // Validação simples
    if (!nome || !email || !password) {
      setFormError("Todos os campos são obrigatórios.");
      return;
    }
    if (password.length < 6) {
      setFormError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      // Chama a API de registro do backend
      await api.post("/auth/register", {
        nome: nome,
        email: email,
        senha: password, // O backend espera 'senha' (vimos no authService)
      });

      alert("Conta criada com sucesso! Você será redirecionado para o login.");
      navigate("/login"); // Redireciona para o login
    } catch (error: any) {
      console.error("Falha no registro:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Erro ao criar conta. Tente outro e-mail.";
      setFormError(errorMessage);
    }
  };

  return (
    // Usa o mesmo container e classes da página de Login
    <div className="auth-container">
      {/* Coluna da Esquerda (Formulário de Registro) */}
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

          {/* Exibe a mensagem de erro, se houver */}
          {formError && <p className="form-error-message">{formError}</p>}

          {/* O botão verde "Criar Conta" */}
          <button type="submit" className="auth-button">
            Criar Conta
          </button>

          <p className="required-text" style={{ marginTop: "1.5rem" }}>
            * Campos Obrigatórios
          </p>
        </form>
      </div>

      {/* Coluna da Direita (Clientes Registrados) */}
      <div className="auth-column">
        <h2>Clientes Registrados</h2>
        <p>Se você já tem uma conta, acesse usando o link abaixo.</p>

        {/* --- SUA CORREÇÃO AQUI --- */}
        {/* O link "Fazer Login" agora usa as classes para parecer um botão azul */}
        <Link to="/login" className="auth-button auth-button-secondary">
          Fazer Login
        </Link>
      </div>
    </div>
  );
}

// Adiciona a exportação default
export default RegisterPage;
