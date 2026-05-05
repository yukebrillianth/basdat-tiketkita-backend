import pool from "../../config/database";
import { RowDataPacket } from "mysql2";

interface DashboardStats {
  total_events: number;
  published_events: number;
  total_orders: number;
  paid_orders: number;
  total_revenue: number;
  total_tickets_sold: number;
  total_users: number;
  pending_payments: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  user_fullname: string;
  user_email: string;
  total: number;
  status: string;
  created_at: Date;
}

interface TopEvent {
  id: string;
  title: string;
  category_name: string;
  venue_name: string;
  date_start: Date;
  status: string;
  tickets_sold: number;
  total_revenue: number;
}

interface MonthlySales {
  month: string;
  orders_count: number;
  revenue: number;
}

export const getStats = async (): Promise<DashboardStats> => {
  const [rows] = await pool.execute<(RowDataPacket & DashboardStats)[]>(`
    SELECT
      (SELECT COUNT(*) FROM events WHERE deleted_at IS NULL) AS total_events,
      (SELECT COUNT(*) FROM events WHERE status = 'published' AND deleted_at IS NULL) AS published_events,
      (SELECT COUNT(*) FROM orders) AS total_orders,
      (SELECT COUNT(*) FROM orders WHERE status = 'paid') AS paid_orders,
      (SELECT COALESCE(SUM(total), 0) FROM orders WHERE status = 'paid') AS total_revenue,
      (SELECT COALESCE(SUM(oi.quantity), 0) FROM order_items oi JOIN orders o ON o.id = oi.order_id WHERE o.status = 'paid') AS total_tickets_sold,
      (SELECT COUNT(*) FROM users WHERE role = 'user') AS total_users,
      (SELECT COUNT(*) FROM payments WHERE status = 'pending') AS pending_payments
  `);
  return rows[0];
};

export const getRecentOrders = async (limit = 10): Promise<RecentOrder[]> => {
  const [rows] = await pool.execute<(RecentOrder & RowDataPacket)[]>(
    `SELECT o.id, o.order_number, u.fullname AS user_fullname, u.email AS user_email,
            o.total, o.status, o.created_at
     FROM orders o
     JOIN users u ON u.id = o.user_id
     ORDER BY o.created_at DESC
     LIMIT ?`,
    [String(limit)],
  );
  return rows;
};

export const getTopEvents = async (limit = 5): Promise<TopEvent[]> => {
  const [rows] = await pool.execute<(TopEvent & RowDataPacket)[]>(
    `SELECT e.id, e.title, c.name AS category_name, v.name AS venue_name,
            e.date_start, e.status,
            COALESCE(SUM(oi.quantity), 0) AS tickets_sold,
            COALESCE(SUM(oi.subtotal), 0) AS total_revenue
     FROM events e
     JOIN categories c ON c.id = e.category_id
     JOIN venues v ON v.id = e.venue_id
     LEFT JOIN ticket_types tt ON tt.event_id = e.id
     LEFT JOIN order_items oi ON oi.ticket_type_id = tt.id
     LEFT JOIN orders o ON o.id = oi.order_id AND o.status = 'paid'
     WHERE e.deleted_at IS NULL
     GROUP BY e.id
     ORDER BY tickets_sold DESC
     LIMIT ?`,
    [String(limit)],
  );
  return rows;
};

export const getMonthlySales = async (): Promise<MonthlySales[]> => {
  const [rows] = await pool.execute<(MonthlySales & RowDataPacket)[]>(`
    SELECT DATE_FORMAT(o.created_at, '%Y-%m') AS month,
           COUNT(*) AS orders_count,
           COALESCE(SUM(o.total), 0) AS revenue
    FROM orders o
    WHERE o.status = 'paid'
      AND o.created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
    GROUP BY DATE_FORMAT(o.created_at, '%Y-%m')
    ORDER BY month ASC
  `);
  return rows;
};
