import { Router } from "express";
import * as venueController from "./venue.controller";
import { verifyToken, requireAdmin } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createVenueSchema, updateVenueSchema } from "./venue.validation";

const router = Router();

router.get("/", venueController.getAll);
router.get("/:id", venueController.getById);
router.post("/", verifyToken, requireAdmin, validate(createVenueSchema), venueController.create);
router.put("/:id", verifyToken, requireAdmin, validate(updateVenueSchema), venueController.update);
router.delete("/:id", verifyToken, requireAdmin, venueController.remove);

export default router;
