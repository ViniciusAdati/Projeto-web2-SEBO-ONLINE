// src/pages/AddBookPage.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { Navbar } from "../components/Navbar"; // <-- REMOVIDO
import { searchBooks } from "../services/googleBooksService";

// --- CSS CORRIGIDO ---
import "../styles/AddBookPage.css"; // Para o formulário de busca
import "../styles/BookCard.css"; // Para os cards "bonitinhos"
// --- FIM CSS ---

type BookResult = {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
};

export function AddBookPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!query) return;
    setLoading(true);
    setSearched(true);
    setResults([]);
    try {
      const googleBooks = await searchBooks(query);
      const formattedResults: BookResult[] = googleBooks
        .filter((item) => item.volumeInfo.imageLinks)
        .map((item) => ({
          id: item.id,
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors
            ? item.volumeInfo.authors.join(", ")
            : "Autor desconhecido",
          imageUrl: item.volumeInfo.imageLinks!.thumbnail.replace(
            "http:",
            "https:"
          ),
        }));
      setResults(formattedResults);
    } catch (error) {
      alert("Erro ao buscar livros.");
    }
    setLoading(false);
  };

  const handleAddBookToShelf = (book: BookResult) => {
    navigate("/livros/confirmar-detalhes", { state: { book: book } });
  };

  return (
    <div>
      {/* <Navbar ... /> <-- REMOVIDO */}

      <main className="addbook-container">
        <h2>Adicionar Novo Livro/HQ</h2>
        <p>Busque pelo título ou ISBN para adicionar um item à sua estante.</p>

        <form onSubmit={handleSearch} className="addbook-search-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Digite o título ou ISBN..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="addbook-search-button"
            disabled={loading}
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </form>

        <hr />

        <div className="results-container">
          {loading && (
            <p className="results-message">Carregando resultados...</p>
          )}
          {!loading && searched && results.length === 0 && (
            <p className="results-message">
              Nenhum resultado encontrado para "{query}".
            </p>
          )}

          {/* --- ESTRUTURA "BONITINHA" APLICADA --- */}
          <div className="addbook-results-grid">
            {results.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-card-image">
                  <img src={book.imageUrl} alt={book.title} />
                  {/* Tag mocada (opcional) */}
                  <span className="book-card-tag Novo">Novo</span>
                </div>
                {/* Wrapper de conteúdo para alinhamento correto */}
                <div className="book-card-content">
                  <h3 className="book-card-title">{book.title}</h3>
                  <p className="book-card-author">{book.author}</p>
                  <div className="book-card-price">
                    {/* Preço Mocado (pois API do Google não tem) */}
                    <span className="new-price">R$ ??.??</span>
                  </div>
                  <span className="installments">Via Google Books</span>
                </div>
                {/* Botão de Adicionar (estilizado pelo BookCard.css) */}
                <button
                  className="auth-button"
                  onClick={() => handleAddBookToShelf(book)}
                >
                  Adicionar à Estante
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AddBookPage;
