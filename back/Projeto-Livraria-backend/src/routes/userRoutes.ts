import { Router } from "express";
// Importe as funções existentes e a nova
import {
  getPublicUsers,
  getPublicUserById,
  getCommunityUsers, // Importa a nova função
} from "../controllers/userController";

const router = Router();

// Rota existente (pode manter ou remover se /community for substituir)
router.get("/list", getPublicUsers);

// --- NOVA ROTA ---
// Rota específica para a lista da comunidade na HomePage
router.get("/community", getCommunityUsers);
// --- FIM DA NOVA ROTA ---

// Rota existente para buscar um usuário por ID
router.get("/:id", getPublicUserById);

export default router;
