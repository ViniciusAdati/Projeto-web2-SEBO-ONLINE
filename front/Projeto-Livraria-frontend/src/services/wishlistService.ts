// frontend/src/services/wishlistService.ts
import api from "./api";

//
// --- [A CORREÇÃO ESTÁ AQUI] ---
//
// Esta é a nova interface UNIFICADA.
// Ela bate com os dados que o seu backend (do Passo 2) agora envia.
export interface WishlistItem {
  id: number; // ID da tabela (wishlist.id ou wishlist_books.id)
  title: string;
  author: string;
  imageUrl: string; // <-- Nome padronizado (antes era url_capa)
  type: "inventory" | "google"; // <-- O campo mais importante

  // Opcional (só existe se type == 'inventory')
  inventario_id?: number;
  estado_conservacao?: string;

  // Opcional (só existe se type == 'google')
  google_book_id?: string;
}
// --- FIM DA CORREÇÃO ---

/**
 * [Função 1 - Corrigida]
 * Busca a wishlist (agora unificada) do INVENTÁRIO e do GOOGLE
 */
export async function getMyWishlistApi(): Promise<WishlistItem[]> {
  try {
    // Esta rota agora retorna a lista combinada do backend
    const response = await api.get("/wishlist/me");
    return response.data || [];
  } catch (error) {
    console.error("Erro ao buscar wishlist:", error);
    return [];
  }
}

/**
 * [Função 2 - Mantida]
 * Esta função é para favoritar ITENS DO INVENTÁRIO
 */
export async function toggleFavoriteApi(inventarioId: string, bookData?: any) {
  const response = await api.post("/wishlist/toggle", {
    bookId: inventarioId,
    ...bookData,
  });
  return response.data;
}

/**
 * [Função 3 - Mantida]
 * Esta função chama a rota /google-toggle
 * para favoritar LIVROS DO GOOGLE.
 */
export async function toggleGoogleFavoriteApi(
  googleBookId: string,
  bookDetails: { title: string; author: string; imageUrl: string }
) {
  // Chama a nova rota que criamos no backend
  const response = await api.post("/wishlist/google-toggle", {
    bookId: googleBookId,
    ...bookDetails,
  });
  return response.data; // Retorna { isFavorited: true/false }
}
