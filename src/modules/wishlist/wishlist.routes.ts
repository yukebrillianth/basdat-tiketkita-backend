import { Router } from "express";
import * as wishlistController from "./wishlist.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { toggleWishlistSchema } from "./wishlist.validation";

const router = Router();

router.get("/", verifyToken, wishlistController.getAll);
router.post("/", verifyToken, validate(toggleWishlistSchema), wishlistController.toggle);

export default router;
