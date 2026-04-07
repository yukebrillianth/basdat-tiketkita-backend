import { PromoCode } from "../types";
import { AppError } from "./AppError";

export const calculateDiscount = (
  promo: PromoCode,
  subtotal: number,
): number => {
  if (subtotal < promo.min_purchase)
    throw new AppError(
      `Minimum pembelian Rp ${promo.min_purchase.toLocaleString("id-ID")}`,
      400,
    );

  let discount: number;
  if (promo.type === "percentage") {
    discount = subtotal * (promo.value / 100);
    if (promo.max_discount !== null)
      discount = Math.min(discount, promo.max_discount);
  } else {
    discount = Math.min(promo.value, subtotal);
  }
  return Math.round(discount);
};
