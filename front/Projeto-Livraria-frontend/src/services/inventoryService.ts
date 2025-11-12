import api from "./api";
export interface IBookInventory {
  inventario_id: number;
  valor_troca: number | string;
  estado_conservacao: string;
  descricao_usuario: string;
  titulo: string;
  autor: string;
  url_capa: string;
  nome_usuario: string;
  usuario_id: number;
}

export const getMyBooks = async (): Promise<IBookInventory[]> => {
  const response = await api.get<IBookInventory[]>("/inventory/my-books");
  return response.data;
};

export const deleteMyBook = async (
  inventoryId: number
): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete<{ success: boolean; message: string }>(
    `/inventory/item/${inventoryId}`
  );
  return response.data;
};

export const addBookToInventory = async (
  bookData: any
): Promise<{ success: boolean; message: string }> => {
  const response = await api.post<{ success: boolean; message: string }>(
    "/inventory",
    bookData
  );
  return response.data;
};

export const getBooksForPublicProfile = async (
  userId: string | number
): Promise<IBookInventory[]> => {
  const response = await api.get<IBookInventory[]>(
    `/inventory/by-user/${userId}`
  );
  return response.data;
};
