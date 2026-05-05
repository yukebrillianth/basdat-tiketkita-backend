import { v7 as uuidv7 } from "uuid";
import { AppError } from "../../utils/AppError";
import * as categoryRepo from "./category.repository";

export const getAll = async () => {
  return categoryRepo.findAll();
};

export const getById = async (id: string) => {
  const category = await categoryRepo.findById(id);
  if (!category) throw new AppError("Kategori tidak ditemukan", 404);
  return category;
};

export const create = async (data: { name: string }) => {
  const id = uuidv7();
  await categoryRepo.create({ id, name: data.name });
  return categoryRepo.findById(id);
};

export const update = async (id: string, data: { name?: string }) => {
  await getById(id);
  const updated = await categoryRepo.update(id, data);
  if (!updated) throw new AppError("Gagal mengupdate kategori", 400);
  return categoryRepo.findById(id);
};

export const remove = async (id: string) => {
  const deleted = await categoryRepo.remove(id);
  if (!deleted) throw new AppError("Kategori tidak ditemukan", 404);
};
