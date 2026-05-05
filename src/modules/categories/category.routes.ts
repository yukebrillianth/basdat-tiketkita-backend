import { Router } from "express";
import * as categoryController from "./category.controller";
import { verifyToken, requireAdmin } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createCategorySchema, updateCategorySchema } from "./category.validation";

const router = Router();

router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getById);
router.post("/", verifyToken, requireAdmin, validate(createCategorySchema), categoryController.create);
router.put("/:id", verifyToken, requireAdmin, validate(updateCategorySchema), categoryController.update);
router.delete("/:id", verifyToken, requireAdmin, categoryController.remove);

export default router;
