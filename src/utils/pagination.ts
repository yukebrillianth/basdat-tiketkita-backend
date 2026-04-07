export const getPagination = (page = 1, limit = 10) => ({
  limit: Math.min(Number(limit), 50),
  offset: (Math.max(Number(page), 1) - 1) * Math.min(Number(limit), 50),
  page: Math.max(Number(page), 1),
});
