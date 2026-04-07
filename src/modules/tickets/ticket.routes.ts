import { Router } from "express";
import * as ticketController from "./ticket.controller";
import { verifyToken, requireAdmin } from "../../middleware/auth.middleware";

const router = Router({ mergeParams: true });

router.get("/", ticketController.getAll);
router.post("/", verifyToken, requireAdmin, ticketController.create);
router.put("/:id", verifyToken, requireAdmin, ticketController.update);
router.delete("/:id", verifyToken, requireAdmin, ticketController.remove);

export default router;
