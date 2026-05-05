import pool from "../../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { PoolConnection } from "mysql2/promise";
import {
  Order,
  OrderItem,
  Payment,
  PaymentMethod,
  PromoCode,
  PaginatedResult,
  OrderStatus,
  PaymentStatus,
} from "../../types";

// ── Non-transaction functions (use pool) ──────────────────────

interface OrderWithPaymentMethod extends Order {
  payment_method_name: string | null;
}

export const findAllByUser = async (
  userId: string,
  page: number,
  limit: number,
  offset: number,
): Promise<PaginatedResult<OrderWithPaymentMethod>> => {
  const [countRows] = await pool.execute<(RowDataPacket & { total: number })[]>(
    "SELECT COUNT(*) AS total FROM orders WHERE user_id = ?",
    [userId],
  );
  const total = countRows[0].total;

  const [rows] = await pool.execute<(OrderWithPaymentMethod & RowDataPacket)[]>(
    `SELECT o.*, pm.name AS payment_method_name
     FROM orders o
     LEFT JOIN payments p ON p.order_id = o.id
     LEFT JOIN payment_methods pm ON pm.id = p.payment_method_id
     WHERE o.user_id = ?
     ORDER BY o.created_at DESC
     LIMIT ? OFFSET ?`,
    [userId, String(limit), String(offset)],
  );

  return {
    items: rows,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const findAll = async (
  page: number,
  limit: number,
  offset: number,
): Promise<PaginatedResult<OrderWithPaymentMethod>> => {
  const [countRows] = await pool.execute<(RowDataPacket & { total: number })[]>(
    "SELECT COUNT(*) AS total FROM orders",
  );
  const total = countRows[0].total;

  const [rows] = await pool.execute<(OrderWithPaymentMethod & RowDataPacket)[]>(
    `SELECT o.*, pm.name AS payment_method_name
     FROM orders o
     LEFT JOIN payments p ON p.order_id = o.id
     LEFT JOIN payment_methods pm ON pm.id = p.payment_method_id
     ORDER BY o.created_at DESC
     LIMIT ? OFFSET ?`,
    [String(limit), String(offset)],
  );

  return {
    items: rows,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const findById = async (id: string): Promise<Order | null> => {
  const [rows] = await pool.execute<(Order & RowDataPacket)[]>(
    "SELECT * FROM orders WHERE id = ?",
    [id],
  );
  return rows[0] ?? null;
};

interface OrderWithDetails {
  order: Order;
  items: OrderItem[];
  payment: Payment | null;
}

export const findByIdWithDetails = async (
  id: string,
  userId: string,
): Promise<OrderWithDetails | null> => {
  const [orderRows] = await pool.execute<(Order & RowDataPacket)[]>(
    "SELECT * FROM orders WHERE id = ? AND user_id = ?",
    [id, userId],
  );
  if (!orderRows[0]) return null;

  const [itemRows] = await pool.execute<(OrderItem & RowDataPacket)[]>(
    "SELECT * FROM order_items WHERE order_id = ?",
    [id],
  );

  const [paymentRows] = await pool.execute<(Payment & RowDataPacket)[]>(
    "SELECT * FROM payments WHERE order_id = ?",
    [id],
  );

  return {
    order: orderRows[0],
    items: itemRows,
    payment: paymentRows[0] ?? null,
  };
};

export const findByIdWithDetailsAdmin = async (
  id: string,
): Promise<OrderWithDetails | null> => {
  const [orderRows] = await pool.execute<(Order & RowDataPacket)[]>(
    "SELECT * FROM orders WHERE id = ?",
    [id],
  );
  if (!orderRows[0]) return null;

  const [itemRows] = await pool.execute<(OrderItem & RowDataPacket)[]>(
    "SELECT * FROM order_items WHERE order_id = ?",
    [id],
  );

  const [paymentRows] = await pool.execute<(Payment & RowDataPacket)[]>(
    "SELECT * FROM payments WHERE order_id = ?",
    [id],
  );

  return {
    order: orderRows[0],
    items: itemRows,
    payment: paymentRows[0] ?? null,
  };
};

// ── Transaction functions (use conn: PoolConnection) ──────────

interface CreateOrderData {
  id: string;
  order_number: string;
  user_id: string;
  promo_id: string | null;
  subtotal: number;
  discount: number;
  admin_fee: number;
  total: number;
  status: OrderStatus;
  expired_at: Date;
}

export const createOrder = async (
  conn: PoolConnection,
  data: CreateOrderData,
): Promise<void> => {
  await conn.execute<ResultSetHeader>(
    `INSERT INTO orders (id, order_number, user_id, promo_id, subtotal, discount, admin_fee, total, status, expired_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.id,
      data.order_number,
      data.user_id,
      data.promo_id,
      data.subtotal,
      data.discount,
      data.admin_fee,
      data.total,
      data.status,
      data.expired_at,
    ],
  );
};

interface CreateOrderItemData {
  id: string;
  order_id: string;
  ticket_type_id: string;
  ticket_name: string;
  ticket_price: number;
  quantity: number;
  subtotal: number;
}

export const createOrderItem = async (
  conn: PoolConnection,
  data: CreateOrderItemData,
): Promise<void> => {
  await conn.execute<ResultSetHeader>(
    `INSERT INTO order_items (id, order_id, ticket_type_id, ticket_name, ticket_price, quantity, subtotal)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.id,
      data.order_id,
      data.ticket_type_id,
      data.ticket_name,
      data.ticket_price,
      data.quantity,
      data.subtotal,
    ],
  );
};

export const decrementStock = async (
  conn: PoolConnection,
  ticketTypeId: string,
  quantity: number,
): Promise<number> => {
  const [result] = await conn.execute<ResultSetHeader>(
    "UPDATE ticket_types SET available = available - ? WHERE id = ? AND available >= ?",
    [quantity, ticketTypeId, quantity],
  );
  return result.affectedRows;
};

export const updateOrderStatus = async (
  conn: PoolConnection,
  orderId: string,
  status: OrderStatus,
): Promise<void> => {
  await conn.execute<ResultSetHeader>(
    "UPDATE orders SET status = ? WHERE id = ?",
    [status, orderId],
  );
};

export const updatePaymentStatus = async (
  conn: PoolConnection,
  orderId: string,
  status: PaymentStatus,
): Promise<void> => {
  await conn.execute<ResultSetHeader>(
    "UPDATE payments SET status = ? WHERE order_id = ?",
    [status, orderId],
  );
};

export const restoreStock = async (
  conn: PoolConnection,
  orderId: string,
): Promise<void> => {
  await conn.execute<ResultSetHeader>(
    `UPDATE ticket_types tt
     JOIN order_items oi ON oi.ticket_type_id = tt.id
     SET tt.available = tt.available + oi.quantity
     WHERE oi.order_id = ?`,
    [orderId],
  );
};

export const restorePromoUsedCount = async (
  conn: PoolConnection,
  promoId: string,
): Promise<void> => {
  await conn.execute<ResultSetHeader>(
    "UPDATE promo_codes SET used_count = used_count - 1 WHERE id = ? AND used_count > 0",
    [promoId],
  );
};

interface CreatePaymentData {
  id: string;
  order_id: string;
  payment_method_id: string;
  unique_code: number;
  total: number;
  status: PaymentStatus;
}

export const createPayment = async (
  conn: PoolConnection,
  data: CreatePaymentData,
): Promise<void> => {
  await conn.execute<ResultSetHeader>(
    `INSERT INTO payments (id, order_id, payment_method_id, unique_code, total, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.id,
      data.order_id,
      data.payment_method_id,
      data.unique_code,
      data.total,
      data.status,
    ],
  );
};

export const incrementPromoUsedCount = async (
  conn: PoolConnection,
  promoId: string,
): Promise<void> => {
  await conn.execute<ResultSetHeader>(
    "UPDATE promo_codes SET used_count = used_count + 1 WHERE id = ?",
    [promoId],
  );
};

export const findByIdAndUser = async (
  id: string,
  userId: string,
): Promise<Order | null> => {
  const [rows] = await pool.execute<(Order & RowDataPacket)[]>(
    "SELECT * FROM orders WHERE id = ? AND user_id = ?",
    [id, userId],
  );
  return rows[0] ?? null;
};

export const findPromoByCode = async (
  code: string,
): Promise<PromoCode | null> => {
  const [rows] = await pool.execute<(PromoCode & RowDataPacket)[]>(
    "SELECT * FROM promo_codes WHERE code = ? AND is_active = 1",
    [code],
  );
  return rows[0] ?? null;
};

export const findPromoByCodeForUpdate = async (
  conn: PoolConnection,
  code: string,
): Promise<PromoCode | null> => {
  const [rows] = await conn.execute<(PromoCode & RowDataPacket)[]>(
    "SELECT * FROM promo_codes WHERE code = ? AND is_active = 1 FOR UPDATE",
    [code],
  );
  return rows[0] ?? null;
};

export const findActivePaymentMethod = async (
  id: string,
): Promise<PaymentMethod | null> => {
  const [rows] = await pool.execute<(PaymentMethod & RowDataPacket)[]>(
    "SELECT * FROM payment_methods WHERE id = ? AND is_active = 1",
    [id],
  );
  return rows[0] ?? null;
};
