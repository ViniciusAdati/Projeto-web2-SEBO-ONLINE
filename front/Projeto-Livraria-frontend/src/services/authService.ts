import api from "./api";

export interface LoginResponse {
  usuario: {
    id: number;
    nome: string;
    email: string;
  };
  token: string;
}

export const login = async (
  email: string,
  senha: string
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", {
    email,
    senha,
  });
  return response.data;
};

export interface RegisterResponse {
  success: boolean;
  userId: number;
}

export const register = async (
  nome: string,
  email: string,
  senha: string
): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>("/auth/register", {
    nome,
    email,
    senha,
  });
  return response.data;
};
