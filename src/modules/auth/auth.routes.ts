import { Router } from "express";
import * as authController from "./auth.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.validation";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/verify-email", validate(verifyEmailSchema), authController.verifyEmail);
router.post("/resend-verification", validate(resendVerificationSchema), authController.resendVerification);
router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);
router.get("/me", verifyToken, authController.me);

export default router;
