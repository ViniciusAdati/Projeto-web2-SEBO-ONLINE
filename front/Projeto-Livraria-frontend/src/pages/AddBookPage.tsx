import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchBooks } from "../services/googleBooksService";
import { useAuth } from "../hooks/useAuth";
import { FaHeart } from "react-icons/fa"; // Importa o coração

import "../styles/AddBookPage.css";
import "../styles/BookCard.css";

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
  const { user: currentUser } = useAuth();

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

  const handleFavoriteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    alert("Para favoritar este livro, primeiro adicione ele à sua Estante!");
  };

  return (
    <div>
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

          <div className="addbook-results-grid">
            {results.map((book) => (
              <div key={book.id} className="book-card">
                {/* --- BOTÃO DE CORAÇÃO --- */}
                <button
                  className="wishlist-heart-btn"
                  onClick={handleFavoriteClick}
                  title="Adicionar aos favoritos"
                >
                  <FaHeart />
                </button>
                {/* ------------------------ */}

                <div className="book-card-image">
                  <img src={book.imageUrl} alt={book.title} />
                  <span className="book-card-tag Novo">Novo</span>
                </div>
                <div className="book-card-content">
                  <h3 className="book-card-title">{book.title}</h3>
                  <p className="book-card-author">{book.author}</p>
                  <div className="book-card-price">
                    <span className="new-price">R$ ??.??</span>
                  </div>
                  <span className="installments">Via Google Books</span>
                </div>
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
