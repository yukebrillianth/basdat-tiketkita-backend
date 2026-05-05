import { v7 as uuidv7 } from "uuid";
import { AppError } from "../../utils/AppError";
import * as ticketRepo from "./ticket.repository";
import * as eventRepo from "../events/event.repository";

const validateEventExists = async (eventId: string): Promise<void> => {
  const event = await eventRepo.findByIdRaw(eventId);
  if (!event) throw new AppError("Event tidak ditemukan", 404);
};

export const getAllByEvent = async (eventId: string) => {
  await validateEventExists(eventId);
  return ticketRepo.findAllByEvent(eventId);
};

interface CreateTicketInput {
  name: string;
  price: number;
  quota: number;
  max_per_order?: number;
}

export const create = async (eventId: string, data: CreateTicketInput) => {
  await validateEventExists(eventId);

  return ticketRepo.create({
    id: uuidv7(),
    event_id: eventId,
    name: data.name,
    price: data.price,
    quota: data.quota,
    available: data.quota,
    max_per_order: data.max_per_order,
  });
};

interface UpdateTicketInput {
  name?: string;
  price?: number;
  quota?: number;
  max_per_order?: number;
}

export const update = async (eventId: string, id: string, data: UpdateTicketInput) => {
  const ticket = await ticketRepo.findById(id);
  if (!ticket) throw new AppError("Tipe tiket tidak ditemukan", 404);

  if (ticket.event_id !== eventId) {
    throw new AppError("Tipe tiket tidak ditemukan di event ini", 404);
  }

  if (data.quota !== undefined) {
    const sold = ticket.quota - ticket.available;
    if (data.quota < sold) {
      throw new AppError(`Kuota tidak boleh kurang dari jumlah tiket terjual (${sold})`, 400);
    }
  }

  const updated = await ticketRepo.update(id, data);
  if (!updated) throw new AppError("Gagal mengupdate tipe tiket", 400);

  return updated;
};
