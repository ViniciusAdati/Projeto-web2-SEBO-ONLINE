// src/components/RecentBooksList.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FaHeart } from "react-icons/fa"; // <-- Importa o ícone
import api from "../services/api";
import type { IBookInventory } from "../services/inventoryService";

import "../styles/BookCard.css";
import "../styles/RecentBooksList.css";

export function RecentBooksList() {
  const [books, setBooks] = useState<IBookInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  // Pega a wishlist e a função de favoritar do AuthContext
  const { user: currentUser, wishlist, toggleWishlistItem } = useAuth();

  useEffect(() => {
    const loadRecentBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<IBookInventory[]>("/inventory/recent");
        setBooks(response.data);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar livros recentes.");
      } finally {
        setLoading(false);
      }
    };
    loadRecentBooks();
  }, []);

  const handleBookClick = async (book: IBookInventory) => {
    if (!currentUser) {
      alert("Faça login para ver detalhes.");
      navigate("/login");
      return;
    }
    if (book.usuario_id === currentUser.id) {
      navigate("/minha-estante");
      return;
    }
    try {
      const response = await api.post<{ negociacaoId: number }>(
        "/chat/initiate",
        {
          otherUserId: book.usuario_id,
        }
      );
      navigate(`/chat/${response.data.negociacaoId}`);
    } catch (error: any) {
      console.error(error);
    }
  };

  // --- LÓGICA DO CLIQUE NO CORAÇÃO ---
  const handleFavoriteClick = (
    event: React.MouseEvent,
    inventarioId: number
  ) => {
    event.stopPropagation(); // Impede de abrir o chat

    if (!currentUser) {
      alert("Você precisa estar logado para favoritar.");
      return;
    }

    // Chama a função do contexto
    toggleWishlistItem(inventarioId).catch((err: any) => {
      console.error("Erro ao favoritar:", err);
    });
  };

  if (loading) return <p className="recent-books-message">Carregando...</p>;
  if (error) return <p className="recent-books-message error">{error}</p>;

  return (
    <div className="recent-books-container">
      <h2 className="recent-books-title">Livros Adicionados Recentemente</h2>

      <div className="recent-books-grid">
        {books.map((book) => (
          <div
            key={book.inventario_id}
            className="book-card"
            onClick={() => handleBookClick(book)}
            style={{ cursor: "pointer" }}
          >
            {/* --- AQUI ESTÁ O BOTÃO DO CORAÇÃO --- */}
            {currentUser && currentUser.id !== book.usuario_id && (
              <button
                // Se o ID estiver na wishlist, adiciona a classe .favorited
                className={`wishlist-heart-btn ${
                  wishlist?.has(book.inventario_id) ? "favorited" : ""
                }`}
                onClick={(e) => handleFavoriteClick(e, book.inventario_id)}
                title="Favoritar"
              >
                <FaHeart />
              </button>
            )}
            {/* ------------------------------------ */}

            <div className="book-card-image">
              <img src={book.url_capa} alt={book.titulo} />
              <span
                className={`book-card-tag ${book.estado_conservacao.replace(
                  /\s/g,
                  ""
                )}`}
              >
                {book.estado_conservacao}
              </span>
            </div>
            <div className="book-card-content">
              <h3 className="book-card-title">{book.titulo}</h3>
              <p className="book-card-author">
                {book.autor || "Autor desconhecido"}
              </p>
              <div className="book-card-price">
                <span className="new-price">
                  R${" "}
                  {parseFloat(book.valor_troca.toString())
                    .toFixed(2)
                    .replace(".", ",")}
                </span>
              </div>
              <span className="installments">
                Postado por: {book.nome_usuario}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentBooksList;
