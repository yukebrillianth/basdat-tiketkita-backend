import pool from "../../config/database";
import { AppError } from "../../utils/AppError";
import * as paymentRepo from "./payment.repository";
import * as orderRepo from "../orders/order.repository";

export const confirm = async (orderId: string, userId: string | null) => {
  const order = userId
    ? await orderRepo.findByIdAndUser(orderId, userId)
    : await orderRepo.findById(orderId);

  if (!order) {
    throw new AppError("Order tidak ditemukan", 404);
  }

  if (order.status !== "waiting_payment") {
    throw new AppError("Order tidak dalam status menunggu pembayaran", 400);
  }

  if (new Date(order.expired_at) <= new Date()) {
    throw new AppError("Order sudah kadaluarsa", 400);
  }

  const payment = await paymentRepo.findByOrderId(orderId);
  if (!payment) {
    throw new AppError("Data pembayaran tidak ditemukan", 404);
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await paymentRepo.confirmPayment(conn, payment.id);
    await orderRepo.updateOrderStatus(conn, orderId, "paid");

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }

  return orderRepo.findByIdWithDetailsAdmin(orderId);
};

export const webhook = async (data: { order_id: string; status: "success" | "failed" }) => {
  const order = await orderRepo.findById(data.order_id);
  if (!order) {
    throw new AppError("Order tidak ditemukan", 404);
  }

  const payment = await paymentRepo.findByOrderId(data.order_id);
  if (!payment) {
    throw new AppError("Data pembayaran tidak ditemukan", 404);
  }

  if (data.status === "success") {
    if (order.status === "paid") {
      return { message: "Webhook processed" };
    }

    if (order.status !== "waiting_payment") {
      throw new AppError("Order tidak dalam status menunggu pembayaran", 400);
    }

    if (new Date(order.expired_at) <= new Date()) {
      throw new AppError("Order sudah kadaluarsa", 400);
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await paymentRepo.confirmPayment(conn, payment.id);
      await orderRepo.updateOrderStatus(conn, order.id, "paid");

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } else {
    if (order.status === "paid" || order.status === "cancelled" || order.status === "expired") {
      return { message: "Webhook processed" };
    }
    if (order.status !== "waiting_payment" && order.status !== "pending") {
      return { message: "Webhook processed" };
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await paymentRepo.failPayment(conn, payment.id);
      await orderRepo.updateOrderStatus(conn, order.id, "cancelled");
      await orderRepo.restoreStock(conn, order.id);

      if (order.promo_id) {
        await orderRepo.restorePromoUsedCount(conn, order.promo_id);
      }

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  return { message: "Webhook processed" };
};
