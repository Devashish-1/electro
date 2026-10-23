export interface TierPrice {
  minQty: number;
  pricePerUnit: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  slug: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  mrp: number;
  unit: string;
  inStock: boolean;
  stockCount: number;
  hsnCode: string;
  gstRate: number; // e.g., 18 for 18%
  rating: number;
  reviewCount: number;
  featured: boolean;
  badge?: string; // 'BESTSELLER' | 'NEW' | 'HEAVY DUTY' | 'OEM'
  images: string[];
  shortDesc: string;
  fullDesc: string;
  specs: Record<string, string>;
  applications: string[];
  tierPricing?: TierPrice[];
  datasheetAvailable?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  iconName: string;
  count: number;
  subcategories: string[];
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  description: string;
  isAuthorizedStockist: boolean;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isB2B: boolean;
  gstin?: string;
  companyName?: string;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  couponCode?: string;
  totalAmount: number;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'NEFT_RTGS' | 'COD';
  paymentStatus: 'Paid' | 'Pending' | 'COD Verified';
  orderStatus: 'Confirmed' | 'Processing' | 'Dispatched' | 'Delivered' | 'Cancelled';
}

export interface QuotationItem {
  productId?: string;
  productName: string;
  quantity: number;
  unit: string;
  targetSpecs?: string;
}

export interface QuotationRequest {
  id: string;
  rfqNumber: string;
  date: string;
  contactName: string;
  companyName?: string;
  gstin?: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  pincode: string;
  requestedItems: QuotationItem[];
  projectNotes?: string;
  estimatedBudget?: string;
  status: 'New' | 'Under Review' | 'Quotation Prepared' | 'Sent' | 'Won' | 'Lost';
  assignedTo?: string;
  adminNotes?: string;
}

export interface RewindingBooking {
  id: string;
  bookingNumber: string;
  date: string;
  motorType: '3-Phase AC Induction' | 'Submersible Borewell Pump' | 'DC Industrial Motor' | 'Transformer / Armature';
  hpRating: string;
  rpm: string;
  voltage: string;
  issueDescription: string;
  pickupRequired: boolean;
  contactName: string;
  phone: string;
  address: string;
  estimatedCostRange: string;
  status: 'Received' | 'Diagnosis' | 'Rewinding' | 'Baking & Testing' | 'Ready for Dispatch';
}

export interface StoreConfig {
  businessName: string;
  tradeName: string;
  proprietor: string;
  gstin: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone1: string;
  phone2: string;
  email: string;
  whatsapp: string;
  freeShippingThreshold: number;
  flatShippingRate: number;
  defaultGstRate: number;
  announcementText: string;
  announcementActive: boolean;
}
