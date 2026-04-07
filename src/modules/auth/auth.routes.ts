import { Router } from "express";
import * as authController from "./auth.controller";
import { verifyToken } from "../../middleware/auth.middleware";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", verifyToken, authController.me);

export default router;
