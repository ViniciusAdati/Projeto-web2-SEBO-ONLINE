// front/Projeto-Livraria-frontend/src/services/inventoryService.ts

import api from "./api"; // Importa sua instância axios

// --- INTERFACE CORRIGIDA AQUI ---
// Esta é a interface que o seu frontend usa
export interface IBookInventory {
  inventario_id: number;
  valor_troca: number | string; // Permitindo string para o 'parseFloat'
  estado_conservacao: string;
  descricao_usuario: string;
  titulo: string;
  autor: string;
  url_capa: string;
  nome_usuario: string;
  usuario_id: number; // <-- PROPRIEDADE ADICIONADA
}
// --- FIM DA CORREÇÃO ---

// Função que a MyShelfPage usa
export const getMyBooks = async (): Promise<IBookInventory[]> => {
  const response = await api.get<IBookInventory[]>("/inventory/my-books");
  return response.data;
};

// Função que a MyShelfPage usa
export const deleteMyBook = async (inventoryId: number): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete<{ success: boolean; message: string }>(`/inventory/item/${inventoryId}`);
  return response.data;
};

// Função que a ConfirmBookDetailsPage usa
export const addBookToInventory = async (bookData: any): Promise<{ success: boolean; message: string }> => {
  const response = await api.post<{ success: boolean; message: string }>("/inventory", bookData);
  return response.data;
};

// Função que a UserProfilePage usa (baseado no seu código)
export const getBooksForPublicProfile = async (userId: string | number): Promise<IBookInventory[]> => {
  const response = await api.get<IBookInventory[]>(`/inventory/by-user/${userId}`);
  return response.data;
}

// (O RecentBooksList usa api.get("/inventory/recent") diretamente)