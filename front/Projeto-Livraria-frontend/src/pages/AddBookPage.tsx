// frontend/src/pages/AddBookPage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchBooks } from "../services/googleBooksService";

// [CORREÇÃO] Importando a API correta (para livros do Google)
import { toggleGoogleFavoriteApi } from "../services/wishlistService";

import { FaHeart } from "react-icons/fa";

// CSS (O seu design)
import "../styles/AddBookPage.css";
import "../styles/BookCard.css";

// --- Tipos ---
type BookResult = {
  id: string; // google_book_id
  title: string;
  author: string;
  imageUrl: string;
  description: string;
};

type GoogleBookItem = {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: { thumbnail: string };
    description?: string;
  };
};
// --- Fim dos Tipos ---

export default function AddBookPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [favoritedBooks, setFavoritedBooks] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const booksData: GoogleBookItem[] = await searchBooks(query);

      const formattedResults: BookResult[] = booksData.map((book) => ({
        id: book.id,
        title: book.volumeInfo.title,
        author: book.volumeInfo.authors
          ? book.volumeInfo.authors.join(", ")
          : "Autor desconhecido",
        imageUrl:
          book.volumeInfo.imageLinks?.thumbnail ||
          "https://via.placeholder.com/128x192",
        description: book.volumeInfo.description || "Sem descrição.",
      }));

      setResults(formattedResults);
    } catch (err) {
      console.error("Erro ao buscar livros:", err);
    } finally {
      setLoading(false);
    }
  };

  // [CORREÇÃO] Esta função agora chama a API correta: 'toggleGoogleFavoriteApi'
  const handleToggleFavorite = async (book: BookResult) => {
    try {
      // Chama a nova função que vai para /google-toggle
      const result = await toggleGoogleFavoriteApi(book.id, {
        title: book.title,
        author: book.author,
        imageUrl: book.imageUrl,
      });

      // O 'alert' que você lembrava
      if (result.isFavorited) {
        alert(`'${book.title}' adicionado aos favoritos!`);
        setFavoritedBooks((prev) => new Set(prev).add(book.id));
      } else {
        alert(`'${book.title}' removido dos favoritos.`);
        setFavoritedBooks((prev) => {
          const newSet = new Set(prev);
          newSet.delete(book.id);
          return newSet;
        });
      }
    } catch (err) {
      console.error("Erro ao favoritar:", err);
      alert("Erro ao processar o favorito.");
    }
  };

  // Função para adicionar à estante
  const handleAddBookToShelf = (book: BookResult) => {
    console.log("Livro selecionado:", book);
    navigate("/livros/confirmar-detalhes", { state: { book: book } });
  };

  return (
    <div className="layout-container">
      {/* O seu design, usando 'addbook-container' */}
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
            <button type="submit" className="auth-button">
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </div>
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

          {/* O seu design, usando 'addbook-results-grid' */}
          <div className="addbook-results-grid">
            {results.map((book) => {
              const isFavorited = favoritedBooks.has(book.id);
              return (
                <div key={book.id} className="book-card">
                  <div className="book-card-image">
                    <img src={book.imageUrl} alt={book.title} />
                    <button
                      className="book-card-favorite-btn"
                      onClick={() => handleToggleFavorite(book)}
                    >
                      <FaHeart color={isFavorited ? "red" : "#ccc"} />
                    </button>
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
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
