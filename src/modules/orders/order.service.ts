import { v7 as uuidv7 } from "uuid";
import pool from "../../config/database";
import { AppError } from "../../utils/AppError";
import { calculateDiscount } from "../../utils/calculateDiscount";
import { generateOrderNumber } from "../../utils/generateOrderNumber";
import { getPagination } from "../../utils/pagination";
import * as orderRepo from "./order.repository";
import * as ticketRepo from "../tickets/ticket.repository";
import * as eventRepo from "../events/event.repository";
import {
  CreateOrderDTO,
  TicketType,
  PromoCode,
  PaginationQuery,
} from "../../types";

export const getAll = async (userId: string, query: PaginationQuery) => {
  const { limit, offset, page } = getPagination(query.page, query.limit);
  return orderRepo.findAllByUser(userId, page, limit, offset);
};

export const getAllAdmin = async (query: PaginationQuery) => {
  const { limit, offset, page } = getPagination(query.page, query.limit);
  return orderRepo.findAll(page, limit, offset);
};

export const getById = async (id: string, userId: string) => {
  const result = await orderRepo.findByIdWithDetails(id, userId);
  if (!result) throw new AppError("Order tidak ditemukan", 404);
  return result;
};

export const getByIdAdmin = async (id: string) => {
  const result = await orderRepo.findByIdWithDetailsAdmin(id);
  if (!result) throw new AppError("Order tidak ditemukan", 404);
  return result;
};

export const create = async (userId: string, data: CreateOrderDTO) => {
  const ticketTypeIds = data.items.map((i) => i.ticket_type_id);
  if (new Set(ticketTypeIds).size !== ticketTypeIds.length) {
    throw new AppError("Tidak boleh ada tipe tiket duplikat dalam satu order", 400);
  }

  const ticketTypes: TicketType[] = [];
  let eventId: string | null = null;

  for (const item of data.items) {
    const ticketType = await ticketRepo.findById(item.ticket_type_id);
    if (!ticketType) {
      throw new AppError(
        `Tipe tiket dengan id ${item.ticket_type_id} tidak ditemukan`,
        404,
      );
    }

    if (eventId === null) {
      eventId = ticketType.event_id;
    } else if (ticketType.event_id !== eventId) {
      throw new AppError(
        "Semua tiket harus dari event yang sama",
        400,
      );
    }

    ticketTypes.push(ticketType);
  }

  const event = await eventRepo.findByIdRaw(eventId!);
  if (!event || event.status !== "published") {
    throw new AppError("Event belum dipublikasi", 400);
  }

  if (new Date(event.date_end) < new Date()) {
    throw new AppError("Event sudah berakhir", 400);
  }

  for (let i = 0; i < data.items.length; i++) {
    const item = data.items[i];
    const ticketType = ticketTypes[i];

    if (ticketType.available < item.quantity) {
      throw new AppError(
        `Stok tiket "${ticketType.name}" tidak mencukupi (tersisa ${ticketType.available})`,
        400,
      );
    }

    if (item.quantity > ticketType.max_per_order) {
      throw new AppError(
        `Maksimal ${ticketType.max_per_order} tiket per order untuk ${ticketType.name}`,
        400,
      );
    }
  }

  let subtotal = 0;
  for (let i = 0; i < data.items.length; i++) {
    subtotal += ticketTypes[i].price * data.items[i].quantity;
  }

  const paymentMethod = await orderRepo.findActivePaymentMethod(data.payment_method_id);
  if (!paymentMethod) {
    throw new AppError("Metode pembayaran tidak ditemukan atau tidak aktif", 400);
  }

  const adminFee =
    paymentMethod.admin_fee +
    Math.round((subtotal * paymentMethod.admin_fee_percent) / 100);

  const orderId = uuidv7();
  const orderNumber = generateOrderNumber();
  const expiredAt = new Date(Date.now() + 15 * 60 * 1000);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    let discount = 0;
    let promo: PromoCode | null = null;

    if (data.promo_code) {
      promo = await orderRepo.findPromoByCodeForUpdate(conn, data.promo_code);

      if (!promo) {
        throw new AppError("Kode promo tidak valid", 400);
      }

      const now = new Date().toISOString().slice(0, 10);
      if (now < promo.start_date || now > promo.end_date) {
        throw new AppError("Kode promo sudah kadaluarsa", 400);
      }

      if (promo.quota !== null && promo.used_count >= promo.quota) {
        throw new AppError("Kuota kode promo sudah habis", 400);
      }

      discount = calculateDiscount(promo, subtotal);
    }

    const total = subtotal - discount + adminFee;

    await orderRepo.createOrder(conn, {
      id: orderId,
      order_number: orderNumber,
      user_id: userId,
      promo_id: promo?.id ?? null,
      subtotal,
      discount,
      admin_fee: adminFee,
      total,
      status: "waiting_payment",
      expired_at: expiredAt,
    });

    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];
      const ticketType = ticketTypes[i];

      await orderRepo.createOrderItem(conn, {
        id: uuidv7(),
        order_id: orderId,
        ticket_type_id: item.ticket_type_id,
        ticket_name: ticketType.name,
        ticket_price: ticketType.price,
        quantity: item.quantity,
        subtotal: ticketType.price * item.quantity,
      });
    }

    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];
      const affectedRows = await orderRepo.decrementStock(
        conn,
        item.ticket_type_id,
        item.quantity,
      );
      if (affectedRows === 0) {
        throw new AppError("Stok tiket tidak mencukupi", 400);
      }
    }

    const uniqueCode =
      paymentMethod.type === "bank"
        ? Math.floor(Math.random() * 900) + 100
        : 0;

    await orderRepo.createPayment(conn, {
      id: uuidv7(),
      order_id: orderId,
      payment_method_id: data.payment_method_id,
      unique_code: uniqueCode,
      total,
      status: "pending",
    });

    if (promo) {
      await orderRepo.incrementPromoUsedCount(conn, promo.id);
    }

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }

  return orderRepo.findByIdWithDetails(orderId, userId);
};

export const cancel = async (id: string, userId: string | null) => {
  const orderDetails = userId
    ? await orderRepo.findByIdWithDetails(id, userId)
    : await orderRepo.findByIdWithDetailsAdmin(id);

  if (!orderDetails) {
    throw new AppError("Order tidak ditemukan", 404);
  }

  const { order } = orderDetails;

  if (order.status !== "pending" && order.status !== "waiting_payment") {
    throw new AppError("Order tidak dapat dibatalkan", 400);
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await orderRepo.updateOrderStatus(conn, order.id, "cancelled");
    await orderRepo.restoreStock(conn, order.id);

    if (order.promo_id) {
      await orderRepo.restorePromoUsedCount(conn, order.promo_id);
    }

    await orderRepo.updatePaymentStatus(conn, order.id, "failed");

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }

  return orderRepo.findByIdWithDetailsAdmin(id);
};
