import { useState } from "react";
import { searchBooks } from "../services/googleBooksService";
import { addBookToInventory } from "../services/inventoryService";
import { toggleWishlist, getWishlist } from "../services/wishlistService";
import BookCard from "../components/BookCard";

export default function AddBookPage() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await searchBooks(query);
      setBooks(data);
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

  const handleToggleFavorite = async (book: any) => {
    await toggleWishlist(book);
    const list = await getWishlist();
    const ids = Array.isArray(list)
      ? list.map((item: any) => String(item.googleBooksId || item.id))
      : [];
    setWishlist(ids);
  };

  const handleAddBook = async (book: any) => {
    await addBookToInventory(book);
    alert("Livro adicionado ao inventário!");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <form onSubmit={handleSearch} className="flex mb-4">
        <input
          type="text"
          placeholder="Pesquise um livro..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border rounded-l-lg p-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
        >
          Buscar
        </button>
      </form>

      {loading && <p>Carregando...</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            isFavorited={wishlist.includes(String(book.id))}
            onToggleFavorite={() => handleToggleFavorite(book)}
            onAddBook={() => handleAddBook(book)}
          />
        ))}
      </div>
    </div>
  );
}
