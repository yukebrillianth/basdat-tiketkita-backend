import { Router } from "express";
import * as paymentController from "./payment.controller";
import { verifyToken } from "../../middleware/auth.middleware";

const router = Router();

router.post("/:orderId/confirm", verifyToken, paymentController.confirm);
router.post("/webhook", paymentController.webhook);

export default router;
