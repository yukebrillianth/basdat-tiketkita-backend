import cors from "cors";
import express, { Application } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";

import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./modules/auth/auth.routes";
import categoryRoutes from "./modules/categories/category.routes";
import eventRoutes from "./modules/events/event.routes";
import orderRoutes from "./modules/orders/order.routes";
import paymentMethodRoutes from "./modules/payment-methods/paymentMethod.routes";
import paymentRoutes from "./modules/payments/payment.routes";
import promoCodeRoutes from "./modules/promo-codes/promoCode.routes";
import ticketRoutes from "./modules/tickets/ticket.routes";
import venueRoutes from "./modules/venues/venue.routes";
import wishlistRoutes from "./modules/wishlist/wishlist.routes";

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Terlalu banyak permintaan, coba lagi nanti",
});
app.use("/api", limiter);

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/events/:eventId/tickets", ticketRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/promo-codes", promoCodeRoutes);
app.use("/api/payment-methods", paymentMethodRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/wishlist", wishlistRoutes);

app.use(errorHandler);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

export default app;
