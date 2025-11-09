// backend/src/routes/statsRoutes.ts

import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getDashboardStatsController } from "../controllers/statsController";

const router = Router();

// Esta rota será acessada como: GET /api/stats/dashboard
router.get("/dashboard", authMiddleware, getDashboardStatsController);

export default router;
