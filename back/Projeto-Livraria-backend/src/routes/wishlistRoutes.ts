import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { toggleFavorite, getWishlist } from "../controllers/wishlistController";

const router = Router();

router.get("/", authMiddleware, getWishlist);
router.post("/toggle", authMiddleware, toggleFavorite);

export default router;
