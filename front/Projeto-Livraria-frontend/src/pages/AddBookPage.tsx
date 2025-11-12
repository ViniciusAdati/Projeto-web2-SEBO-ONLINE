import { useState } from "react";
import { searchBooks } from "../services/googleBooksService";
import { addBookToInventory } from "../services/inventoryService";
import { toggleWishlist, getWishlist } from "../services/wishlistService";
import "../styles/AddBookPage.css";
import "../styles/BookCard.css";

type BookResult = {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
};

export default function AddBookPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookResult[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const data = await searchBooks(query);

      const mapped = data.map((item: any) => ({
        id: item.id,
        title: item.volumeInfo?.title || "Título desconhecido",
        author: item.volumeInfo?.authors?.[0] || "Autor desconhecido",
        imageUrl:
          item.volumeInfo?.imageLinks?.thumbnail ||
          "https://via.placeholder.com/150x200?text=Sem+Imagem",
      }));

      setResults(mapped);

      const list = await getWishlist();
      const ids = Array.isArray(list)
        ? list.map((item: any) => String(item.googleBooksId || item.id))
        : [];
      setWishlist(ids);
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (book: BookResult) => {
    await toggleWishlist(book.id);
    const list = await getWishlist();
    const ids = Array.isArray(list)
      ? list.map((item: any) => String(item.googleBooksId || item.id))
      : [];
    setWishlist(ids);
  };

  const handleAddBookToShelf = async (book: BookResult) => {
    await addBookToInventory(book);
    alert("Livro adicionado à estante!");
  };

  return (
    <div className="addbook-container-wrapper">
      <main className="addbook-container">
        <h2>Adicionar Novo Livro/HQ</h2>
        <p>Busque pelo título ou ISBN para adicionar um item à sua estante.</p>

        <form
          onSubmit={handleSearch}
          className="addbook-search-form flex flex-col md:flex-row items-center gap-3"
        >
          <input
            type="text"
            placeholder="Digite o título ou ISBN..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border rounded-lg p-2 w-full md:w-auto"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-3 md:mt-0 hover:bg-blue-600 transition"
          >
            Buscar
          </button>
        </form>

        <hr className="my-4" />

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
                <div className="book-card-image relative">
                  <img src={book.imageUrl} alt={book.title} />

                  <button
                    type="button"
                    className={`favorite-btn ${
                      wishlist.includes(book.id) ? "favorited" : ""
                    }`}
                    onClick={() => handleToggleFavorite(book)}
                    title={
                      wishlist.includes(book.id)
                        ? "Remover dos favoritos"
                        : "Adicionar aos favoritos"
                    }
                  >
                    {wishlist.includes(book.id) ? "❤️" : "🤍"}
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
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
