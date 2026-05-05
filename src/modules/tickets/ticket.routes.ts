import { Router } from "express";
import * as ticketController from "./ticket.controller";
import { verifyToken, requireAdmin } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createTicketSchema, updateTicketSchema } from "./ticket.validation";

const router = Router({ mergeParams: true });

router.get("/", ticketController.getAll);
router.post("/", verifyToken, requireAdmin, validate(createTicketSchema), ticketController.create);
router.put("/:id", verifyToken, requireAdmin, validate(updateTicketSchema), ticketController.update);

export default router;
