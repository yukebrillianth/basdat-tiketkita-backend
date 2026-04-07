import { Router } from "express";
import * as orderController from "./order.controller";
import { verifyToken } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", verifyToken, orderController.getAll);
router.get("/:id", verifyToken, orderController.getById);
router.post("/", verifyToken, orderController.create);
router.post("/:id/cancel", verifyToken, orderController.cancel);

export default router;
