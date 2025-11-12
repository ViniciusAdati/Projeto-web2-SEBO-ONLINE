import api from "./api";

export const toggleWishlist = async (inventarioId: string) => {
  const response = await api.post("/wishlist/toggle", { inventarioId });
  return response.data;
};

export const getWishlist = async (): Promise<string[]> => {
  const response = await api.get("/wishlist");
  return response.data;
};
