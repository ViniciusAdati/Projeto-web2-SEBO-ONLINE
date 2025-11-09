// backend/src/routes/wishlistRoutes.ts
import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

// [CORREÇÃO 1] Importe a nova função do controller
import {
  toggleFavorite,
  getWishlist,
  toggleGoogleFavorite, // <-- NOVO
} from "../controllers/wishlistController";

const router = Router();

// [Mantido] Rota do 'GET' que corrige o Erro 404
router.get("/me", authMiddleware, getWishlist);

// [Mantido] Esta rota é para FAVORITAR ITENS DO INVENTÁRIO
router.post("/toggle", authMiddleware, toggleFavorite);

// [CORREÇÃO 2] Rota NOVA para FAVORITAR LIVROS DO GOOGLE
// Isso corrige o Erro 500
router.post("/google-toggle", authMiddleware, toggleGoogleFavorite);

export default router;
