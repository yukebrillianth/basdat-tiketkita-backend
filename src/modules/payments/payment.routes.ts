import { Router, Request, Response, NextFunction } from "express";
import * as paymentController from "./payment.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { webhookSchema } from "./payment.validation";

const router = Router();

const verifyWebhookSecret = (req: Request, res: Response, next: NextFunction) => {
  const secret = req.headers["x-webhook-secret"];
  if (!process.env.WEBHOOK_SECRET || secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ success: false, message: "Webhook secret tidak valid" });
  }
  next();
};

router.post("/:orderId/confirm", verifyToken, paymentController.confirm);
router.post("/webhook", verifyWebhookSecret, validate(webhookSchema), paymentController.webhook);

export default router;
