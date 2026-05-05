import { v7 as uuidv7 } from "uuid";
import { AppError } from "../../utils/AppError";
import { calculateDiscount } from "../../utils/calculateDiscount";
import { getPagination } from "../../utils/pagination";
import * as promoCodeRepo from "./promoCode.repository";
import { PaginationQuery, PromoType } from "../../types";

export const getAll = async (query: PaginationQuery) => {
  const { limit, offset, page } = getPagination(query.page, query.limit);
  return promoCodeRepo.findAll(page, limit, offset);
};

export const validate = async (code: string, subtotal: number) => {
  const promo = await promoCodeRepo.findByCode(code);
  if (!promo) {
    throw new AppError("Kode promo tidak valid", 400);
  }

  const now = new Date().toISOString().slice(0, 10);
  if (now < promo.start_date || now > promo.end_date) {
    throw new AppError("Kode promo sudah kadaluarsa", 400);
  }

  if (promo.quota !== null && promo.used_count >= promo.quota) {
    throw new AppError("Kuota kode promo sudah habis", 400);
  }

  const discount = calculateDiscount(promo, subtotal);

  return {
    promo_id: promo.id,
    code: promo.code,
    type: promo.type,
    value: promo.value,
    discount,
  };
};

interface CreatePromoCodeInput {
  code: string;
  type: PromoType;
  value: number;
  min_purchase?: number;
  max_discount?: number | null;
  quota?: number | null;
  start_date: string;
  end_date: string;
  is_active?: boolean;
}

export const create = async (userId: string, data: CreatePromoCodeInput) => {
  const id = uuidv7();
  await promoCodeRepo.create({
    id,
    code: data.code.toUpperCase(),
    type: data.type,
    value: data.value,
    min_purchase: data.min_purchase ?? 0,
    max_discount: data.max_discount ?? null,
    quota: data.quota ?? null,
    start_date: data.start_date,
    end_date: data.end_date,
    is_active: data.is_active ?? true,
    created_by: userId,
  });
  return promoCodeRepo.findById(id);
};

interface UpdatePromoCodeInput {
  code?: string;
  type?: PromoType;
  value?: number;
  min_purchase?: number;
  max_discount?: number | null;
  quota?: number | null;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

export const update = async (id: string, data: UpdatePromoCodeInput) => {
  const existing = await promoCodeRepo.findById(id);
  if (!existing) {
    throw new AppError("Kode promo tidak ditemukan", 404);
  }

  await promoCodeRepo.update(id, {
    ...data,
    code: data.code?.toUpperCase(),
  });
  return promoCodeRepo.findById(id);
};
