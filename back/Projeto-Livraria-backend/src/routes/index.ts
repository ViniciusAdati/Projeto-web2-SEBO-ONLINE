import { Router } from "express";
import authRoutes from "./authRoutes";
import chatRoutes from "./chatRoutes";
import userRoutes from "./userRoutes";
import inventoryRoutes from "./inventoryRoutes";
import wishlistRoutes from "./wishlistRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/chat", chatRoutes);
router.use("/users", userRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/wishlist", wishlistRoutes);

export default router;
