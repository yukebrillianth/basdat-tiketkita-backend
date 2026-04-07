import { Router } from "express";
import * as promoCodeController from "./promoCode.controller";
import { verifyToken, requireAdmin } from "../../middleware/auth.middleware";

const router = Router();

router.post("/validate", verifyToken, promoCodeController.validate);
router.get("/", verifyToken, requireAdmin, promoCodeController.getAll);
router.post("/", verifyToken, requireAdmin, promoCodeController.create);
router.put("/:id", verifyToken, requireAdmin, promoCodeController.update);

export default router;
