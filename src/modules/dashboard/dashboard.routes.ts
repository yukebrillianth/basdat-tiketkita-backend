import { Router } from "express";
import * as dashboardController from "./dashboard.controller";
import { verifyToken, requireAdmin } from "../../middleware/auth.middleware";

const router = Router();

router.use(verifyToken, requireAdmin);

router.get("/", dashboardController.getDashboard);
router.get("/stats", dashboardController.getStats);
router.get("/top-events", dashboardController.getTopEvents);
router.get("/recent-orders", dashboardController.getRecentOrders);

export default router;
