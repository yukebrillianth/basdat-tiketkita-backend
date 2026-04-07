import { Router } from "express";
import * as eventController from "./event.controller";
import { verifyToken, requireAdmin } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", eventController.getAll);
router.get("/:id", eventController.getById);
router.post("/", verifyToken, requireAdmin, eventController.create);
router.put("/:id", verifyToken, requireAdmin, eventController.update);
router.delete("/:id", verifyToken, requireAdmin, eventController.remove);

export default router;
