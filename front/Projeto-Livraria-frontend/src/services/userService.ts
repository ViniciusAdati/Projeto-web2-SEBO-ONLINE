import api from "./api";

export interface IUserPublic {
  id: number;
  nome: string;
  data_cadastro: string;
  cidade: string | null;
  estado: string | null;
}

export const fetchPublicUsers = async (): Promise<IUserPublic[]> => {
  try {
    const response = await api.get<IUserPublic[]>("/users/list");
    return response.data;
  } catch (error: any) {
    console.error("Falha ao buscar usuários:", error);
    throw new Error(
      error.response?.data?.message || "Falha ao buscar usuários."
    );
  }
};

export const getUserById = async (userId: string): Promise<IUserPublic> => {
  try {
    const response = await api.get<IUserPublic>(`/users/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error("Falha ao buscar usuário:", error);
    throw new Error(
      error.response?.data?.message || "Falha ao buscar usuário."
    );
  }
};
