import app from "./app";
import pool from "./config/database";

const PORT = process.env.PORT || 3000;

const cancelExpiredOrders = async (): Promise<void> => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [expired]: any = await conn.execute(
      `SELECT id FROM orders WHERE status = 'waiting_payment' AND expired_at < NOW()`,
    );
    for (const order of expired) {
      await conn.execute(`UPDATE orders SET status='expired' WHERE id=?`, [
        order.id,
      ]);
      await conn.execute(
        `UPDATE payments SET status='failed' WHERE order_id=?`,
        [order.id],
      );
      await conn.execute(
        `
        UPDATE ticket_types tt
        JOIN order_items oi ON oi.ticket_type_id = tt.id
        SET tt.available = tt.available + oi.quantity
        WHERE oi.order_id = ?
      `,
        [order.id],
      );
    }
    if (expired.length > 0) {
      console.log(`[Auto-cancel] ${expired.length} expired order(s) cancelled`);
    }
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    console.error("[Auto-cancel] Error:", err);
  } finally {
    conn.release();
  }
};

setInterval(cancelExpiredOrders, 60_000);

app.listen(PORT, () => {
  console.log(`TiketKita server running on port ${PORT}`);
});
