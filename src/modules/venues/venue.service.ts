import { v7 as uuidv7 } from "uuid";
import { AppError } from "../../utils/AppError";
import * as venueRepo from "./venue.repository";

export const getAll = async () => {
  return venueRepo.findAll();
};

export const getById = async (id: string) => {
  const venue = await venueRepo.findById(id);
  if (!venue) throw new AppError("Venue tidak ditemukan", 404);
  return venue;
};

interface CreateVenueInput {
  name: string;
  city: string;
  address: string;
  capacity: number;
}

export const create = async (data: CreateVenueInput) => {
  const id = uuidv7();
  await venueRepo.create({
    id,
    name: data.name,
    city: data.city,
    address: data.address,
    capacity: data.capacity,
  });
  return venueRepo.findById(id);
};

interface UpdateVenueInput {
  name?: string;
  city?: string;
  address?: string;
  capacity?: number;
}

export const update = async (id: string, data: UpdateVenueInput) => {
  await getById(id);
  const updated = await venueRepo.update(id, data);
  if (!updated) throw new AppError("Gagal mengupdate venue", 400);
  return venueRepo.findById(id);
};

export const remove = async (id: string) => {
  const deleted = await venueRepo.remove(id);
  if (!deleted) throw new AppError("Venue tidak ditemukan", 404);
};
