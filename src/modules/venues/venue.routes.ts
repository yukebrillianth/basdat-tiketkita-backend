import { Router } from "express";
import * as venueController from "./venue.controller";
import { verifyToken, requireAdmin } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", venueController.getAll);
router.get("/:id", venueController.getById);
router.post("/", verifyToken, requireAdmin, venueController.create);
router.put("/:id", verifyToken, requireAdmin, venueController.update);
router.delete("/:id", verifyToken, requireAdmin, venueController.remove);

export default router;
