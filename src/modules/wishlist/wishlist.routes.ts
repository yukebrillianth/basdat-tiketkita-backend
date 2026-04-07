import { Router } from "express";
import * as wishlistController from "./wishlist.controller";
import { verifyToken } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", verifyToken, wishlistController.getAll);
router.post("/", verifyToken, wishlistController.toggle);

export default router;
