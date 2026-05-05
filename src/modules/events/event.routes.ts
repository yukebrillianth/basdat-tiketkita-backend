import { Router } from "express";
import * as eventController from "./event.controller";
import { verifyToken, requireAdmin, optionalAuth } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createEventSchema, updateEventSchema } from "./event.validation";

const router = Router();

router.get("/", optionalAuth, eventController.getAll);
router.get("/:id", optionalAuth, eventController.getById);
router.post("/", verifyToken, requireAdmin, validate(createEventSchema), eventController.create);
router.put("/:id", verifyToken, requireAdmin, validate(updateEventSchema), eventController.update);
router.delete("/:id", verifyToken, requireAdmin, eventController.remove);

export default router;
