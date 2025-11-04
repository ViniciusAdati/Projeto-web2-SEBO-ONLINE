import api from "./api";

interface BookDataPayload {
  googleBookId: string;
  title: string;
  author: string;
  imageUrl: string;
  condition: string;
  tradeValue: number;
  description: string;
}

interface AddBookResponse {
  success: boolean;
  message: string;
}

export const addBookToInventory = async (
  bookData: BookDataPayload
): Promise<AddBookResponse> => {
  try {
    const response = await api.post<AddBookResponse>("/inventory", bookData);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Falha ao adicionar livro."
    );
  }
};

export interface IBookInventory {
  inventario_id: number;
  valor_troca: number;
  estado_conservacao: string;
  titulo: string;
  autor: string;
  url_capa: string;
  nome_usuario: string;
}

export const getRecentBooks = async (): Promise<IBookInventory[]> => {
  try {
    const response = await api.get<IBookInventory[]>("/inventory/recent");
    return response.data;
  } catch (error: any) {
    console.error("Falha ao buscar livros recentes:", error);
    throw new Error(error.response?.data?.message || "Falha ao buscar livros.");
  }
};

export const getMyBooks = async (): Promise<IBookInventory[]> => {
  try {
    const response = await api.get<IBookInventory[]>("/inventory/my-books");
    return response.data;
  } catch (error: any) {
    console.error("Falha ao buscar 'meus livros':", error);
    throw new Error(
      error.response?.data?.message || "Falha ao buscar inventário pessoal."
    );
  }
};

export const deleteMyBook = async (
  inventoryId: number
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.delete(`/inventory/item/${inventoryId}`);
    return response.data;
  } catch (error: any) {
    console.error("Falha ao deletar livro:", error);
    throw new Error(error.response?.data?.message || "Falha ao remover livro.");
  }
};

export const getBooksForPublicProfile = async (
  userId: string
): Promise<IBookInventory[]> => {
  try {
    const response = await api.get<IBookInventory[]>(
      `/inventory/by-user/${userId}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Falha ao buscar inventário público:", error);
    throw new Error(
      error.response?.data?.message || "Falha ao buscar inventário."
    );
  }
};
