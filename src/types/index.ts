export type UserRole = "user" | "admin";
export type EventStatus = "draft" | "published" | "cancelled" | "completed";
export type PaymentMethodType = "bank" | "ewallet" | "cc" | "va" | "qris";
export type PromoType = "percentage" | "nominal";
export type OrderStatus =
  | "pending"
  | "waiting_payment"
  | "paid"
  | "cancelled"
  | "expired";
export type PaymentStatus = "pending" | "success" | "failed";

export interface User {
  id: string;
  fullname: string;
  email: string;
  phone: string | null;
  password_hash: string;
  role: UserRole;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
}
export type SafeUser = Omit<User, "password_hash">;

export interface Category {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  address: string;
  capacity: number;
  created_at: Date;
  updated_at: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  category_id: string;
  venue_id: string;
  date_start: Date;
  date_end: Date;
  status: EventStatus;
  poster_url: string | null;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface TicketType {
  id: string;
  event_id: string;
  name: string;
  price: number;
  quota: number;
  available: number;
  max_per_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: PaymentMethodType;
  code: string;
  admin_fee: number;
  admin_fee_percent: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface PromoCode {
  id: string;
  code: string;
  type: PromoType;
  value: number;
  min_purchase: number;
  max_discount: number | null;
  quota: number | null;
  used_count: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  promo_id: string | null;
  subtotal: number;
  discount: number;
  admin_fee: number;
  total: number;
  status: OrderStatus;
  expired_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: string;
  order_id: string;
  ticket_type_id: string;
  ticket_name: string;
  ticket_price: number;
  quantity: number;
  subtotal: number;
  created_at: Date;
}

export interface Payment {
  id: string;
  order_id: string;
  payment_method_id: string;
  unique_code: number;
  total: number;
  payment_code: string | null;
  status: PaymentStatus;
  paid_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface Wishlist {
  id: string;
  user_id: string;
  event_id: string;
  created_at: Date;
}

export interface CreateOrderItemDTO {
  ticket_type_id: string;
  quantity: number;
}
export interface CreateOrderDTO {
  items: CreateOrderItemDTO[];
  promo_code?: string;
  payment_method_id: string;
}
export interface ValidatePromoDTO {
  code: string;
  subtotal: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}
export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface JwtPayload {
  id: string;
  role: UserRole;
}
