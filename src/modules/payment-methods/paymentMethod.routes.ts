import { Router } from "express";
import * as paymentMethodController from "./paymentMethod.controller";
import { verifyToken, requireAdmin, optionalAuth } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createPaymentMethodSchema, updatePaymentMethodSchema } from "./paymentMethod.validation";

const router = Router();

router.get("/", optionalAuth, paymentMethodController.getAll);
router.post("/", verifyToken, requireAdmin, validate(createPaymentMethodSchema), paymentMethodController.create);
router.put("/:id", verifyToken, requireAdmin, validate(updatePaymentMethodSchema), paymentMethodController.update);

export default router;
