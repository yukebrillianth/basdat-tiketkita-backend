import * as dashboardRepo from "./dashboard.repository";

export const getStats = async () => {
  return dashboardRepo.getStats();
};

export const getRecentOrders = async (limit?: number) => {
  return dashboardRepo.getRecentOrders(limit);
};

export const getTopEvents = async (limit?: number) => {
  return dashboardRepo.getTopEvents(limit);
};

export const getMonthlySales = async () => {
  return dashboardRepo.getMonthlySales();
};

export const getDashboard = async () => {
  const [stats, recentOrders, topEvents, monthlySales] = await Promise.all([
    getStats(),
    getRecentOrders(10),
    getTopEvents(5),
    getMonthlySales(),
  ]);

  return {
    stats,
    recent_orders: recentOrders,
    top_events: topEvents,
    monthly_sales: monthlySales,
  };
};
