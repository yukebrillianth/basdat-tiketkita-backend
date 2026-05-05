import { v7 as uuidv7 } from "uuid";
import * as wishlistRepo from "./wishlist.repository";

export const getAll = async (userId: string) => {
  return wishlistRepo.findAllByUser(userId);
};

export const toggle = async (userId: string, eventId: string) => {
  const existing = await wishlistRepo.findByUserAndEvent(userId, eventId);

  if (existing) {
    await wishlistRepo.remove(userId, eventId);
    return { added: false };
  }

  await wishlistRepo.create(uuidv7(), userId, eventId);
  return { added: true };
};
