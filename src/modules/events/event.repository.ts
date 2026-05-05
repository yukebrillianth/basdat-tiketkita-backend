import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../../config/database";
import { Event, PaginatedResult, TicketType } from "../../types";

interface EventWithDetails extends Event {
  category_name: string;
  venue_name: string;
  venue_city: string;
}

interface EventDetail extends Event {
  category: { id: string; name: string };
  venue: {
    id: string;
    name: string;
    city: string;
    address: string;
    capacity: number;
  };
  ticket_types: TicketType[];
}

interface FindAllParams {
  search?: string;
  category_id?: string;
  status?: string;
  page: number;
  limit: number;
  offset: number;
  isAdmin?: boolean;
}

export const findAll = async (
  params: FindAllParams,
): Promise<PaginatedResult<EventWithDetails>> => {
  const { search, category_id, status, page, limit, offset, isAdmin } = params;

  const conditions: string[] = ["e.deleted_at IS NULL"];
  const values: (string | number)[] = [];

  if (!isAdmin) {
    conditions.push("e.status = 'published'");
  } else if (status) {
    conditions.push("e.status = ?");
    values.push(status);
  }

  if (search) {
    conditions.push("e.title LIKE ?");
    values.push(`%${search}%`);
  }

  if (category_id) {
    conditions.push("e.category_id = ?");
    values.push(category_id);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const [countRows] = await pool.execute<(RowDataPacket & { total: number })[]>(
    `SELECT COUNT(*) AS total FROM events e ${whereClause}`,
    values,
  );
  const total = countRows[0].total;

  const [rows] = await pool.execute<(EventWithDetails & RowDataPacket)[]>(
    `SELECT e.*, c.name AS category_name, v.name AS venue_name, v.city AS venue_city
     FROM events e
     JOIN categories c ON c.id = e.category_id
     JOIN venues v ON v.id = e.venue_id
     ${whereClause}
     ORDER BY e.date_start ASC
     LIMIT ? OFFSET ?`,
    [...values, String(limit), String(offset)],
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

export const findById = async (id: string): Promise<EventDetail | null> => {
  const [rows] = await pool.execute<
    (Event &
      RowDataPacket & {
        category_name: string;
        venue_name: string;
        venue_city: string;
        venue_address: string;
        venue_capacity: number;
      })[]
  >(
    `SELECT e.*, c.name AS category_name,
            v.name AS venue_name, v.city AS venue_city,
            v.address AS venue_address, v.capacity AS venue_capacity
     FROM events e
     JOIN categories c ON c.id = e.category_id
     JOIN venues v ON v.id = e.venue_id
     WHERE e.id = ? AND e.deleted_at IS NULL`,
    [id],
  );

  if (!rows[0]) return null;

  const row = rows[0];

  const [ticketRows] = await pool.execute<(TicketType & RowDataPacket)[]>(
    "SELECT * FROM ticket_types WHERE event_id = ? ORDER BY price ASC",
    [id],
  );

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category_id: row.category_id,
    venue_id: row.venue_id,
    date_start: row.date_start,
    date_end: row.date_end,
    status: row.status,
    poster_url: row.poster_url,
    created_by: row.created_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
    category: {
      id: row.category_id,
      name: row.category_name,
    },
    venue: {
      id: row.venue_id,
      name: row.venue_name,
      city: row.venue_city,
      address: row.venue_address,
      capacity: row.venue_capacity,
    },
    ticket_types: ticketRows,
  };
};

interface CreateEventData {
  id: string;
  title: string;
  description?: string | null;
  category_id: string;
  venue_id: string;
  date_start: string;
  date_end: string;
  status?: string;
  poster_url?: string | null;
  created_by: string;
}

export const create = async (
  data: CreateEventData,
): Promise<EventDetail | null> => {
  await pool.execute<ResultSetHeader>(
    `INSERT INTO events (id, title, description, category_id, venue_id, date_start, date_end, status, poster_url, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.id,
      data.title,
      data.description ?? null,
      data.category_id,
      data.venue_id,
      data.date_start,
      data.date_end,
      data.status ?? "draft",
      data.poster_url ?? null,
      data.created_by,
    ],
  );

  return findById(data.id);
};

interface UpdateEventData {
  title?: string;
  description?: string | null;
  category_id?: string;
  venue_id?: string;
  date_start?: string;
  date_end?: string;
  status?: string;
  poster_url?: string | null;
}

export const update = async (
  id: string,
  data: UpdateEventData,
): Promise<boolean> => {
  const fields: string[] = [];
  const values: (string | null)[] = [];

  if (data.title !== undefined) {
    fields.push("title = ?");
    values.push(data.title);
  }
  if (data.description !== undefined) {
    fields.push("description = ?");
    values.push(data.description ?? null);
  }
  if (data.category_id !== undefined) {
    fields.push("category_id = ?");
    values.push(data.category_id);
  }
  if (data.venue_id !== undefined) {
    fields.push("venue_id = ?");
    values.push(data.venue_id);
  }
  if (data.date_start !== undefined) {
    fields.push("date_start = ?");
    values.push(data.date_start);
  }
  if (data.date_end !== undefined) {
    fields.push("date_end = ?");
    values.push(data.date_end);
  }
  if (data.status !== undefined) {
    fields.push("status = ?");
    values.push(data.status);
  }
  if (data.poster_url !== undefined) {
    fields.push("poster_url = ?");
    values.push(data.poster_url ?? null);
  }

  if (fields.length === 0) return false;

  values.push(id);

  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE events SET ${fields.join(", ")} WHERE id = ? AND deleted_at IS NULL`,
    values,
  );

  return result.affectedRows > 0;
};

export const findByIdRaw = async (id: string): Promise<Event | null> => {
  const [rows] = await pool.execute<(Event & RowDataPacket)[]>(
    "SELECT * FROM events WHERE id = ? AND deleted_at IS NULL",
    [id],
  );
  return rows[0] ?? null;
};

export const countActiveOrdersForEvent = async (eventId: string): Promise<number> => {
  const [rows] = await pool.execute<(RowDataPacket & { count: number })[]>(
    `SELECT COUNT(*) as count FROM orders o
     JOIN order_items oi ON oi.order_id = o.id
     JOIN ticket_types tt ON tt.id = oi.ticket_type_id
     WHERE tt.event_id = ? AND o.status IN ('pending', 'waiting_payment', 'paid')`,
    [eventId],
  );
  return rows[0].count;
};

export const softDelete = async (id: string): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>(
    "UPDATE events SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL",
    [id],
  );
  return result.affectedRows > 0;
};
