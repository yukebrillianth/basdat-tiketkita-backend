import { v7 as uuidv7 } from "uuid";
import { AppError } from "../../utils/AppError";
import * as paymentMethodRepo from "./paymentMethod.repository";
import { PaymentMethodType } from "../../types";

interface CreatePaymentMethodInput {
  name: string;
  type: PaymentMethodType;
  code: string;
  admin_fee?: number;
  admin_fee_percent?: number;
  is_active?: boolean;
}

interface UpdatePaymentMethodInput {
  name?: string;
  type?: PaymentMethodType;
  code?: string;
  admin_fee?: number;
  admin_fee_percent?: number;
  is_active?: boolean;
}

export const getAll = async () => {
  return paymentMethodRepo.findAllActive();
};

export const getAllAdmin = async () => {
  return paymentMethodRepo.findAllAdmin();
};

export const create = async (data: CreatePaymentMethodInput) => {
  const id = uuidv7();
  await paymentMethodRepo.create({
    id,
    name: data.name,
    type: data.type,
    code: data.code,
    admin_fee: data.admin_fee ?? 0,
    admin_fee_percent: data.admin_fee_percent ?? 0,
    is_active: data.is_active ?? true,
  });
  return paymentMethodRepo.findById(id);
};

export const update = async (id: string, data: UpdatePaymentMethodInput) => {
  const existing = await paymentMethodRepo.findById(id);
  if (!existing) {
    throw new AppError("Metode pembayaran tidak ditemukan", 404);
  }

  await paymentMethodRepo.update(id, data);
  return paymentMethodRepo.findById(id);
};
