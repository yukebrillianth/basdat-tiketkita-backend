import { Router } from "express";
import * as paymentMethodController from "./paymentMethod.controller";
import { verifyToken, requireAdmin } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", paymentMethodController.getAll);
router.post("/", verifyToken, requireAdmin, paymentMethodController.create);
router.put("/:id", verifyToken, requireAdmin, paymentMethodController.update);

export default router;
