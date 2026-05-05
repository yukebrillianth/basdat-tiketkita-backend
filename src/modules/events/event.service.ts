import { v7 as uuidv7 } from "uuid";
import { AppError } from "../../utils/AppError";
import { getPagination } from "../../utils/pagination";
import * as eventRepo from "./event.repository";
import * as categoryRepo from "../categories/category.repository";
import * as venueRepo from "../venues/venue.repository";

interface GetAllQuery {
  search?: string;
  category_id?: string;
  status?: string;
  page?: number;
  limit?: number;
  isAdmin?: boolean;
}

export const getAll = async (query: GetAllQuery) => {
  const { limit, offset, page } = getPagination(query.page, query.limit);
  return eventRepo.findAll({
    search: query.search,
    category_id: query.category_id,
    status: query.status,
    page,
    limit,
    offset,
    isAdmin: query.isAdmin,
  });
};

export const getById = async (id: string, isAdmin?: boolean) => {
  const event = await eventRepo.findById(id);
  if (!event) throw new AppError("Event tidak ditemukan", 404);
  if (!isAdmin && event.status !== "published") {
    throw new AppError("Event tidak ditemukan", 404);
  }
  return event;
};

interface CreateEventInput {
  title: string;
  description?: string | null;
  category_id: string;
  venue_id: string;
  date_start: string;
  date_end: string;
  status?: string;
  poster_url?: string | null;
}

const validateCategoryExists = async (categoryId: string): Promise<void> => {
  const category = await categoryRepo.findById(categoryId);
  if (!category) throw new AppError("Kategori tidak ditemukan", 404);
};

const validateVenueExists = async (venueId: string): Promise<void> => {
  const venue = await venueRepo.findById(venueId);
  if (!venue) throw new AppError("Venue tidak ditemukan", 404);
};

export const create = async (userId: string, data: CreateEventInput) => {
  if (new Date(data.date_start) >= new Date(data.date_end)) {
    throw new AppError("Tanggal mulai harus sebelum tanggal selesai", 400);
  }

  await validateCategoryExists(data.category_id);
  await validateVenueExists(data.venue_id);

  return eventRepo.create({
    id: uuidv7(),
    title: data.title,
    description: data.description,
    category_id: data.category_id,
    venue_id: data.venue_id,
    date_start: data.date_start,
    date_end: data.date_end,
    status: data.status,
    poster_url: data.poster_url,
    created_by: userId,
  });
};

export const update = async (id: string, data: Partial<CreateEventInput>) => {
  const existing = await eventRepo.findByIdRaw(id);
  if (!existing) throw new AppError("Event tidak ditemukan", 404);

  if (data.date_start && data.date_end) {
    if (new Date(data.date_start) >= new Date(data.date_end)) {
      throw new AppError("Tanggal mulai harus sebelum tanggal selesai", 400);
    }
  } else if (data.date_start && !data.date_end) {
    if (new Date(data.date_start) >= new Date(existing.date_end)) {
      throw new AppError("Tanggal mulai harus sebelum tanggal selesai", 400);
    }
  } else if (!data.date_start && data.date_end) {
    if (new Date(existing.date_start) >= new Date(data.date_end)) {
      throw new AppError("Tanggal mulai harus sebelum tanggal selesai", 400);
    }
  }

  if (data.category_id) {
    await validateCategoryExists(data.category_id);
  }
  if (data.venue_id) {
    await validateVenueExists(data.venue_id);
  }

  const updated = await eventRepo.update(id, data);
  if (!updated) throw new AppError("Gagal mengupdate event", 400);

  return eventRepo.findById(id);
};

export const remove = async (id: string) => {
  const activeOrders = await eventRepo.countActiveOrdersForEvent(id);
  if (activeOrders > 0) {
    throw new AppError("Tidak dapat menghapus event yang memiliki order aktif", 400);
  }

  const deleted = await eventRepo.softDelete(id);
  if (!deleted) throw new AppError("Event tidak ditemukan", 404);
};
