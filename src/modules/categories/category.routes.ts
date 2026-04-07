import { Router } from "express";
import * as categoryController from "./category.controller";
import { verifyToken, requireAdmin } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getById);
router.post("/", verifyToken, requireAdmin, categoryController.create);
router.put("/:id", verifyToken, requireAdmin, categoryController.update);
router.delete("/:id", verifyToken, requireAdmin, categoryController.remove);

export default router;
