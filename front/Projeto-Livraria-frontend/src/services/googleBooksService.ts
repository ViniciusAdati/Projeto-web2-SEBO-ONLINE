import axios from "axios";

const googleApi = axios.create({
  baseURL: "https://www.googleapis.com/books/v1",
});

interface GoogleBookItem {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail: string;
      smallThumbnail: string;
    };
  };
}

interface GoogleApiResponse {
  items: GoogleBookItem[];
}

export const searchBooks = async (query: string): Promise<GoogleBookItem[]> => {
  try {
    const response = await googleApi.get<GoogleApiResponse>(`/volumes`, {
      params: {
        q: query,
        maxResults: 20,
      },
    });

    if (response.data && response.data.items) {
      return response.data.items;
    }
    return [];
  } catch (error) {
    console.error("Erro ao buscar livros no Google API:", error);
    throw new Error("Falha ao buscar livros.");
  }
};
