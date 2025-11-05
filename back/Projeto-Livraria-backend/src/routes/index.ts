// src/routes/index.ts

import { Router } from "express";
import authRoutes from "./authRoutes";
import chatRoutes from "./chatRoutes";
import userRoutes from "./userRoutes";
import inventoryRoutes from "./inventoryRoutes";
import wishlistRoutes from "./wishlistRoutes"; // <-- 1. IMPORTAR

const router = Router();

router.use("/auth", authRoutes);
router.use("/chat", chatRoutes);
router.use("/users", userRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/wishlist", wishlistRoutes); // <-- 2. USAR

export default router;
