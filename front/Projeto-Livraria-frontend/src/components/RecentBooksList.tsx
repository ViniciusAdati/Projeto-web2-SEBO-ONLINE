// src/components/RecentBooksList.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import type { IBookInventory } from "../services/inventoryService";

import "../styles/BookCard.css";
import "../styles/RecentBooksList.css";

export function RecentBooksList() {
  const [books, setBooks] = useState<IBookInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

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
      alert("Você precisa estar logado para iniciar uma troca.");
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
      const { negociacaoId } = response.data;
      navigate(`/chat/${negociacaoId}`);
    } catch (error: any) {
      console.error("Erro ao iniciar chat:", error);
      alert(
        `Não foi possível iniciar o chat: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (books.length === 0) return <p>Nenhum livro recente encontrado.</p>;

  return (
    <div className="recent-books-container">
      <h2 className="recent-books-title">Livros Adicionados Recentemente</h2>
      <div className="recent-books-grid">
        {books.map((book) => (
          <div
            key={book.inventario_id}
            className="book-card"
            onClick={() => handleBookClick(book)} // ✅ apenas 1 argumento
            style={{ cursor: "pointer" }}
          >
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
                  R$
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
