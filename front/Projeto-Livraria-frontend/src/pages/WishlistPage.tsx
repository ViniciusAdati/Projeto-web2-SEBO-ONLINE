// src/pages/WishlistPage.tsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  WishlistItem,
  toggleGoogleFavoriteApi,
} from "../services/wishlistService";

// [CORREÇÃO 1] Importar o Ícone e o CSS
import { FaTimes } from "react-icons/fa";
import "../styles/BookCard.css"; // Para o card e o "X"
import "../styles/MyShelfPage.css"; // Para o layout (list-wrapper, shelf-title, user-grid)

/**
 * [CARD ATUALIZADO]
 * Agora usa className (do BookCard.css) em vez de estilos inline.
 * O botão "REMOVER" foi trocado pelo "X".
 */
const SimpleBookCard = ({
  item,
  onRemove,
  isLoading,
}: {
  item: WishlistItem;
  onRemove: (item: WishlistItem) => void;
  isLoading: boolean;
}) => (
  // [CORREÇÃO 2] Usa a classe .book-card
  <div className="book-card">
    <div className="book-card-image">
      {/* Tag para mostrar o tipo (mantida com estilos inline, pois é única desta página) */}
      <span
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          background: item.type === "google" ? "#4285F4" : "#0F9D58",
          color: "white",
          padding: "2px 6px",
          borderRadius: "4px",
          fontSize: "0.7em",
          textTransform: "uppercase",
          zIndex: 5, // Garante que fique acima da imagem
        }}
      >
        {item.type === "google" ? "Google" : "Inventário"}
      </span>

      {/* [CORREÇÃO 3] O botão "X" (igual ao da MyShelfPage) */}
      <button
        className="book-card-remove"
        title="Remover dos Favoritos"
        onClick={() => onRemove(item)}
        disabled={isLoading}
      >
        <FaTimes />
      </button>

      <img src={item.imageUrl} alt={item.title} />
    </div>

    {/* [CORREÇÃO 4] Usa as classes de conteúdo */}
    <div className="book-card-content">
      <h3 className="book-card-title" title={item.title}>
        {item.title}
      </h3>
      <p className="book-card-author">por {item.author}</p>

      {item.type === "inventory" && (
        <p
          style={{
            // Manter este estilo inline, pois é específico
            fontSize: "0.8em",
            color: "#555",
            fontStyle: "italic",
            marginTop: "8px",
          }}
        >
          {item.estado_conservacao}
        </p>
      )}
    </div>
    {/* O botão "REMOVER" vermelho foi APAGADO daqui */}
  </div>
);

export function WishlistPage() {
  // A lógica está 100% correta, sem mudanças
  const { wishlist, toggleWishlistItem, fetchWishlist } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRemoveFavorite = async (item: WishlistItem) => {
    if (loading) return;

    const confirmDelete = window.confirm(
      `Tem certeza que quer remover "${item.title}" dos favoritos?`
    );
    if (!confirmDelete) {
      return;
    }

    setLoading(true);
    try {
      if (item.type === "google") {
        await toggleGoogleFavoriteApi(item.google_book_id!, {
          title: item.title,
          author: item.author,
          imageUrl: item.imageUrl,
        });
        await fetchWishlist();
      } else if (item.type === "inventory") {
        await toggleWishlistItem(item.inventario_id!);
      }
    } catch (err) {
      console.error("Erro ao remover favorito:", err);
      alert("Não foi possível remover o favorito.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // [CORREÇÃO 5] Usa as classes de layout da MyShelfPage
    <div className="list-wrapper">
      <h2 className="shelf-title">Minha Lista de Desejos</h2>

      {wishlist.length === 0 && (
        <p className="shelf-message">Sua lista de desejos está vazia.</p>
      )}

      {/* [CORREÇÃO 6] Usa a classe de grid */}
      <div className="user-grid">
        {wishlist.map((item) => (
          <SimpleBookCard
            key={`${item.type}-${item.id}`}
            item={item}
            onRemove={handleRemoveFavorite}
            isLoading={loading}
          />
        ))}
      </div>
    </div>
  );
}
