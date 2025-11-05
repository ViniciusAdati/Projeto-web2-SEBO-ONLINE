// src/routes/wishlistRoutes.ts

import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware"; // Protege a rota
import { toggleFavorite } from "../controllers/wishlistController";

const router = Router();

// Rota POST para favoritar/desfavoritar. Requer que o usuário esteja logado.
router.post("/toggle", authMiddleware, toggleFavorite);

export default router;
