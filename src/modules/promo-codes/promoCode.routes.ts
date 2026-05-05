import { Router } from "express";
import * as promoCodeController from "./promoCode.controller";
import { verifyToken, requireAdmin } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { validatePromoSchema, createPromoCodeSchema, updatePromoCodeSchema } from "./promoCode.validation";

const router = Router();

router.post("/validate", verifyToken, validate(validatePromoSchema), promoCodeController.validate);
router.get("/", verifyToken, requireAdmin, promoCodeController.getAll);
router.post("/", verifyToken, requireAdmin, validate(createPromoCodeSchema), promoCodeController.create);
router.put("/:id", verifyToken, requireAdmin, validate(updatePromoCodeSchema), promoCodeController.update);

export default router;
