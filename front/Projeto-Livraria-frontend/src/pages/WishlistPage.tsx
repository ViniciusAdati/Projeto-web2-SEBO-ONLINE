// src/pages/WishlistPage.tsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";
// [CORREÇÃO] Importa a interface unificada (que corrigimos no Passo 3)
import { WishlistItem } from "../services/wishlistService";

/**
 * [CORREÇÃO]
 * Este é o card de exemplo que você tinha, mas atualizado
 * para usar os nomes de propriedade corretos da interface unificada.
 */
const SimpleBookCard = ({ item }: { item: WishlistItem }) => (
  <div
    style={{
      border: "1px solid #ccc",
      padding: "10px",
      margin: "10px",
      display: "flex",
      width: "300px",
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

    {/* [CORREÇÃO] usa item.imageUrl (antes era url_capa) */}
    <img
      src={item.imageUrl}
      alt={item.title}
      style={{
        width: "80px",
        height: "120px",
        marginRight: "10px",
        objectFit: "cover",
      }}
    />

    <div>
      {/* [CORREÇÃO] usa item.title (antes era titulo) */}
      <h4 style={{ margin: 0, marginTop: "30px", fontSize: "1em" }}>
        {item.title}
      </h4>

      {/* [CORREÇÃO] usa item.author (antes era autor) */}
      <p style={{ margin: "4px 0", fontSize: "0.9em", color: "#444" }}>
        por {item.author}
      </p>

      {/* [CORREÇÃO] Mostra o estado_conservacao (se existir) */}
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
  </div>
);

export function WishlistPage() {
  // 1. Pega a lista de desejos (agora unificada) direto do contexto
  const { wishlist } = useAuth();

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2>Minha Lista de Desejos</h2>

      {wishlist.length === 0 && <p>Sua lista de desejos está vazia.</p>}

      {/* 2. Exibe a lista */}
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {wishlist.map((item) => (
          // O ID agora pode ser duplicado (um do google, um do inventário)
          // Usamos 'type' para garantir uma chave única
          <SimpleBookCard key={`${item.type}-${item.id}`} item={item} />
        ))}
      </div>
    </div>
  );
}
