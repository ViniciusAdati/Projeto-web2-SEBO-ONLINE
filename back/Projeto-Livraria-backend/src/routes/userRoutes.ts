import { Router } from "express";
import {
  getPublicUsers,
  getPublicUserById,
  getCommunityUsers,
} from "../controllers/userController";

const router = Router();
router.get("/list", getPublicUsers);

router.get("/community", getCommunityUsers);

router.get("/:id", getPublicUserById);

export default router;
