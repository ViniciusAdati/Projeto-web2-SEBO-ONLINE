// src/components/RecentBooksList.tsx

import { useState, useEffect } from "react";
// --- IMPORTAÇÕES NECESSÁRIAS ---
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Para saber quem está logado
// --- FIM IMPORTAÇÕES ---
import api from "../services/api";
import type { IBookInventory } from "../services/inventoryService";

import "../styles/BookCard.css";
import "../styles/RecentBooksList.css";

export function RecentBooksList() {
  const [books, setBooks] = useState<IBookInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- HOOKS NECESSÁRIOS ---
  const navigate = useNavigate();
  const { user: currentUser } = useAuth(); // Pega o usuário logado
  // --- FIM HOOKS ---

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

  // --- FUNÇÃO DE CLICK PARA O CARD ---
  const handleBookClick = async (book: IBookInventory) => {
    // 1. Verifica se o usuário está logado
    if (!currentUser) {
      alert("Você precisa estar logado para iniciar uma troca.");
      navigate("/login");
      return;
    }

    // 2. Verifica se o livro é do próprio usuário
    if (book.usuario_id === currentUser.id) {
      navigate("/minha-estante");
      return;
    }

    // 3. É o livro de outra pessoa, iniciar o chat/troca
    try {
      console.log(
        `Iniciando chat entre ${currentUser.id} e ${book.usuario_id}`
      );
      const response = await api.post<{ negociacaoId: number }>(
        "/chat/initiate",
        {
          otherUserId: book.usuario_id, // O ID do dono do livro
        }
      );
      const { negociacaoId } = response.data;
      navigate(`/chat/${negociacaoId}`); // Navega para a página de chat
    } catch (error: any) {
      console.error("Erro ao iniciar chat:", error);
      alert(
        `Não foi possível iniciar o chat: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };
  // --- FIM DA FUNÇÃO ---

  if (loading) {
    /* ... (código de loading) ... */
  }
  if (error) {
    /* ... (código de erro) ... */
  }
  if (books.length === 0) {
    /* ... (código de lista vazia) ... */
  }

  return (
    <div className="recent-books-container">
      <h2 className="recent-books-title">Livros Adicionados Recentemente</h2>

      <div className="recent-books-grid">
        {books.map((book) => (
          // --- ALTERAÇÃO AQUI: Remove <Link> e adiciona onClick ---
          <div
            key={book.inventario_id}
            className="book-card"
            onClick={() => handleBookClick(book)} // Chama a nova função
            style={{ cursor: "pointer" }} // Indica que é clicável
          >
            {/* O <Link> foi removido daqui */}
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
            {/* O </Link> foi removido daqui */}
          </div>
          // --- FIM DA ALTERAÇÃO ---
        ))}
      </div>
    </div>
  );
}

export default RecentBooksList;
