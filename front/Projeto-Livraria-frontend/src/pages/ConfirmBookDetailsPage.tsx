// src/pages/ConfirmBookDetailsPage.tsx (CÓDIGO ATUALIZADO)

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addBookToInventory } from "../services/inventoryService";

// Importa os estilos necessários
import "../styles/AuthPage.css";
import "../styles/AddBookPage.css";

export function ConfirmBookDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const bookDataFromSearch = location.state?.book;

  const [condition, setCondition] = useState("Seminovo");
  const [tradeValue, setTradeValue] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!bookDataFromSearch) {
      console.warn(
        "Nenhum dado de livro encontrado. Redirecionando para busca."
      );
      navigate("/livros/adicionar");
    }
  }, [bookDataFromSearch, navigate]);

  const handleFinalSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const finalBookForApi = {
      googleBookId: bookDataFromSearch.id,
      title: bookDataFromSearch.title,
      author: bookDataFromSearch.author,
      imageUrl: bookDataFromSearch.imageUrl,
      condition: condition,
      tradeValue: parseFloat(tradeValue) || 0,
      description: description,
    };

    try {
      await addBookToInventory(finalBookForApi);
      alert("Livro adicionado com sucesso à sua estante!");
      navigate("/minha-estante");
    } catch (error: any) {
      console.error("Falha ao adicionar livro:", error);
      alert(`Erro: ${error.response?.data?.message || error.message}`);
    }
  };

  if (!bookDataFromSearch) {
    return null;
  }

  return (
    <div>
      {/* Container principal para as duas colunas */}
      <div className="auth-container confirm-book-details-container">
        {/* Coluna da Esquerda: Confirme o Item */}
        <div className="auth-column confirm-item-column">
          <h2>Confirme o Item</h2>
          <div className="book-image-wrapper">
            {" "}
            {/* Adiciona um wrapper para a imagem */}
            <img
              src={bookDataFromSearch.imageUrl}
              alt={bookDataFromSearch.title}
              // Estilos inline removidos e movidos para o CSS
            />
          </div>
          <h3 className="book-title-display">{bookDataFromSearch.title}</h3>
          <p className="book-author-display">{bookDataFromSearch.author}</p>
        </div>

        {/* Coluna da Direita: Detalhes da Cópia */}
        <div className="auth-column add-details-column">
          <h2>Adicionar Detalhes da sua Cópia</h2>
          <form onSubmit={handleFinalSubmit}>
            <div className="form-group">
              <label htmlFor="condition">
                Condição / Estado <span>*</span>
              </label>
              <select
                id="condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                required
              >
                <option value="Novo">Novo (Lacrado)</option>
                <option value="Seminovo">Seminovo (Em perfeito estado)</option>
                <option value="Usado">Usado (Com marcas de uso)</option>
                <option value="Desgastado">Desgastado (Com avarias)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="value">
                Valor de Troca (Preço) (R$) <span>*</span>
              </label>
              <input
                type="number"
                id="value"
                placeholder="Ex: 35.50"
                step="0.01"
                required
                value={tradeValue}
                onChange={(e) => setTradeValue(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Descrição (Opcional)</label>
              <textarea
                id="description"
                placeholder="Ex: Edição de capa dura, possui uma pequena marca na lombada..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button type="submit" className="auth-button auth-button-secondary">
              Adicionar à Minha Estante
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ConfirmBookDetailsPage;
