// src/pages/WishlistPage.tsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  WishlistItem,
  toggleGoogleFavoriteApi, // Importa a API de toggle do Google
} from "../services/wishlistService";

/**
 * [CARD ATUALIZADO]
 * O card agora recebe a função 'onRemove' e o estado 'isLoading'
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
  <div
    style={{
      border: "1px solid #ccc",
      padding: "10px",
      margin: "10px",
      display: "flex",
      flexDirection: "column", // Mudei para coluna para o botão caber
      width: "220px", // Ajustei a largura
      borderRadius: "8px",
      position: "relative",
    }}
  >
    {/* Tag para mostrar o tipo */}
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
      }}
    >
      {item.type === "google" ? "Google" : "Inventário"}
    </span>

    <img
      src={item.imageUrl}
      alt={item.title}
      style={{
        width: "120px",
        height: "180px",
        objectFit: "cover",
        margin: "0 auto", // Centraliza a imagem
        marginTop: "30px",
      }}
    />

    <div style={{ marginTop: "10px", flexGrow: 1 }}>
      <h4
        style={{
          margin: 0,
          fontSize: "1em",
          height: "40px",
          overflow: "hidden",
        }}
        title={item.title}
      >
        {item.title}
      </h4>
      <p style={{ margin: "4px 0", fontSize: "0.9em", color: "#444" }}>
        por {item.author}
      </p>
      {item.type === "inventory" && (
        <p
          style={{
            margin: "8px 0 0 0",
            fontSize: "0.8em",
            color: "#555",
            fontStyle: "italic",
          }}
        >
          {item.estado_conservacao}
        </p>
      )}
    </div>

    {/* --- O BOTÃO DE REMOVER ESTÁ AQUI --- */}
    <button
      onClick={() => onRemove(item)}
      disabled={isLoading}
      style={{
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        padding: "8px 10px",
        borderRadius: "4px",
        cursor: "pointer",
        marginTop: "10px",
        width: "100%",
      }}
    >
      {isLoading ? "Removendo..." : "Remover"}
    </button>
  </div>
);

export function WishlistPage() {
  // 1. Pega a lista e as funções de manipulação do AuthContext
  const { wishlist, toggleWishlistItem, fetchWishlist } = useAuth();
  const [loading, setLoading] = useState(false);

  // 2. [NOVA FUNÇÃO] Lida com a remoção de QUALQUER tipo de item
  const handleRemoveFavorite = async (item: WishlistItem) => {
    if (loading) return; // Previne cliques duplos

    const confirmDelete = window.confirm(
      `Tem certeza que quer remover "${item.title}" dos favoritos?`
    );
    if (!confirmDelete) {
      return;
    }

    setLoading(true);
    try {
      if (item.type === "google") {
        // 1. Livro do Google: chama a API de toggle do Google
        await toggleGoogleFavoriteApi(
          item.google_book_id!, // '!' garante ao TS que não é nulo
          {
            title: item.title,
            author: item.author,
            imageUrl: item.imageUrl,
          }
        );
        // 2. Força a atualização da lista no AuthContext
        await fetchWishlist();
      } else if (item.type === "inventory") {
        // 1. Livro do Inventário: chama a função de toggle do Inventário
        // (Esta função já chama 'fetchWishlist' por si só)
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
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2>Minha Lista de Desejos</h2>

      {wishlist.length === 0 && <p>Sua lista de desejos está vazia.</p>}

      {/* 3. Exibe a lista (agora passando as props novas) */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {wishlist.map((item) => (
          <SimpleBookCard
            key={`${item.type}-${item.id}`}
            item={item}
            onRemove={handleRemoveFavorite} // <-- Passa a função
            isLoading={loading} // <-- Passa o estado de loading
          />
        ))}
      </div>
    </div>
  );
}
