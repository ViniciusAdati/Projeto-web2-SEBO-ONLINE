import api from "./api";

export const initiateChatApi = async (
  otherUserId: string
): Promise<{ negociacaoId: number }> => {
  try {
    const response = await api.post<{ negociacaoId: number }>(
      "/chat/initiate",
      { otherUserId }
    );
    return response.data;
  } catch (error: any) {
    console.error("Erro ao iniciar chat:", error);
    throw new Error(error.response?.data?.message || "Falha ao iniciar chat.");
  }
};

export interface IChatMessage {
  id: number;
  remetente_id: number;
  negociacaoId: string;
  remetente_nome: string;
  conteudo: string;
  timestamp: string;
}

export const getChatHistoryApi = async (
  negociacaoId: string
): Promise<IChatMessage[]> => {
  try {
    const response = await api.get<IChatMessage[]>(
      `/chat/history/${negociacaoId}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar histórico:", error);
    throw new Error(
      error.response?.data?.message || "Falha ao buscar histórico."
    );
  }
};
