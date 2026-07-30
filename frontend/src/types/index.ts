export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  shortDescription: string | null;
  priceInCents: number;
  comparePriceInCents: number | null;
  stock: number;
  isService: boolean;
  requiresAttachment: boolean;
  attachmentInstructions: string | null;
  weightGrams: number | null;
  lengthCm: number | null;
  widthCm: number | null;
  heightCm: number | null;
  isActive: boolean;
  featured: boolean;
  metadata: any;
  images: ProductImage[];
  categories: ProductCategory[];
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  order: number;
}

export interface ProductCategory {
  category: { id: string; name: string; slug: string };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  children: Category[];
  _count: { products: number };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "CUSTOMER";
  cpfCnpj?: string;
  phone?: string;
  avatarUrl?: string;
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  isDefault: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  artworkUrl?: string;
  customizations?: Record<string, any>;
}

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "AWAITING_ARTWORK"
  | "ARTWORK_UNDER_REVIEW"
  | "ARTWORK_APPROVED"
  | "CONFIRMED"
  | "IN_PRODUCTION"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalInCents: number;
  discountInCents: number;
  shippingCostInCents: number;
  paymentMethod: string | null;
  clientWhatsapp: string | null;
  trackingCode: string | null;
  trackingUrl: string | null;
  estimatedDays: number | null;
  createdAt: string;
  user: { id: string; name: string; email: string; phone?: string | null } | null;
  items: OrderItem[];
  history: OrderHistory[];
  address: Address | null;
}

export interface OrderItem {
  id: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPriceInCents: number;
  totalInCents: number;
  artworkUrl: string | null;
  artworkApproved: boolean | null;
  artworkNotes: string | null;
}

export interface OrderHistory {
  id: string;
  status: OrderStatus;
  note: string | null;
  changedBy: string | null;
  createdAt: string;
}
