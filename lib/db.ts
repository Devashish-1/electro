import fs from 'fs/promises';
import path from 'path';
import { Product, Order, QuotationRequest, RewindingBooking, StoreConfig } from '@/types';
import { initialProducts, initialOrders, initialQuotations, initialStoreConfig } from '@/data/catalogue';

const DB_DIR = path.join(process.cwd(), 'data', 'db');

async function ensureDbDir() {
  try {
    await fs.mkdir(DB_DIR, { recursive: true });
  } catch (err) {
    // Already exists or ignore
  }
}

async function readJsonFile<T>(filename: string, defaultData: T): Promise<T> {
  await ensureDbDir();
  const filePath = path.join(DB_DIR, filename);
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    console.error(`Error reading ${filename}:`, err);
    return defaultData;
  }
}

async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  await ensureDbDir();
  const filePath = path.join(DB_DIR, filename);
  const tempPath = `${filePath}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  await fs.rename(tempPath, filePath);
}

// ----------------- PRODUCTS -----------------
export async function getProducts(): Promise<Product[]> {
  return await readJsonFile<Product[]>('products.json', initialProducts);
}

export async function saveProducts(products: Product[]): Promise<void> {
  await writeJsonFile('products.json', products);
}

export async function getProductByIdOrSlug(idOrSlug: string): Promise<Product | null> {
  const products = await getProducts();
  const found = products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  return found || null;
}

export async function addProduct(product: Product): Promise<Product> {
  const products = await getProducts();
  products.unshift(product);
  await saveProducts(products);
  return product;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const products = await getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...updates };
  await saveProducts(products);
  return products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await getProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;
  await saveProducts(filtered);
  return true;
}

// ----------------- ORDERS -----------------
export async function getOrders(): Promise<Order[]> {
  return await readJsonFile<Order[]>('orders.json', initialOrders);
}

export async function saveOrders(orders: Order[]): Promise<void> {
  await writeJsonFile('orders.json', orders);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const orders = await getOrders();
  const found = orders.find(o => o.id === id || o.orderNumber === id);
  return found || null;
}

export async function createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>): Promise<Order> {
  const orders = await getOrders();
  const orderNum = `ORD-${new Date().getFullYear()}-${String(orders.length + 101).padStart(4, '0')}`;
  const newOrder: Order = {
    ...orderData,
    id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    orderNumber: orderNum,
    date: new Date().toISOString().split('T')[0],
  };
  orders.unshift(newOrder);
  await saveOrders(orders);
  return newOrder;
}

export async function updateOrderStatus(id: string, orderStatus: Order['orderStatus'], paymentStatus?: Order['paymentStatus']): Promise<Order | null> {
  const orders = await getOrders();
  const index = orders.findIndex(o => o.id === id || o.orderNumber === id);
  if (index === -1) return null;
  orders[index].orderStatus = orderStatus;
  if (paymentStatus) {
    orders[index].paymentStatus = paymentStatus;
  }
  await saveOrders(orders);
  return orders[index];
}

// ----------------- RFQ / QUOTATIONS -----------------
export async function getQuotations(): Promise<QuotationRequest[]> {
  return await readJsonFile<QuotationRequest[]>('quotations.json', initialQuotations);
}

export async function saveQuotations(quotations: QuotationRequest[]): Promise<void> {
  await writeJsonFile('quotations.json', quotations);
}

export async function getQuotationById(id: string): Promise<QuotationRequest | null> {
  const quotations = await getQuotations();
  const found = quotations.find(q => q.id === id || q.rfqNumber === id);
  return found || null;
}

export async function createQuotation(rfqData: Omit<QuotationRequest, 'id' | 'rfqNumber' | 'date' | 'status'>): Promise<QuotationRequest> {
  const quotations = await getQuotations();
  const rfqNum = `RFQ-${new Date().getFullYear()}-${String(quotations.length + 201).padStart(4, '0')}`;
  const newRfq: QuotationRequest = {
    ...rfqData,
    id: `rfq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    rfqNumber: rfqNum,
    date: new Date().toISOString().split('T')[0],
    status: 'New',
  };
  quotations.unshift(newRfq);
  await saveQuotations(quotations);
  return newRfq;
}

export async function updateQuotationStatus(id: string, status: QuotationRequest['status'], adminNotes?: string): Promise<QuotationRequest | null> {
  const quotations = await getQuotations();
  const index = quotations.findIndex(q => q.id === id || q.rfqNumber === id);
  if (index === -1) return null;
  quotations[index].status = status;
  if (adminNotes !== undefined) {
    quotations[index].adminNotes = adminNotes;
  }
  await saveQuotations(quotations);
  return quotations[index];
}

// ----------------- REWINDING BOOKINGS -----------------
export async function getRewindings(): Promise<RewindingBooking[]> {
  const sampleBookings: RewindingBooking[] = [
    {
      id: 'rew_101',
      bookingNumber: 'RWD-2026-0042',
      date: '2026-10-20',
      motorType: '3-Phase AC Induction',
      hpRating: '25 HP',
      rpm: '1440 RPM',
      voltage: '415V 3-Phase',
      issueDescription: 'Overheating on phase B, burnt coil smell, high humming noise on no-load run.',
      pickupRequired: true,
      contactName: 'Rajesh Sharma (Marble Gangsaw Works)',
      phone: '+91 94142 81395',
      address: 'Industrial Area Phase 2, Beawar, Rajasthan',
      estimatedCostRange: '₹14,500 - ₹18,000',
      status: 'Rewinding',
    },
    {
      id: 'rew_102',
      bookingNumber: 'RWD-2026-0043',
      date: '2026-10-22',
      motorType: 'Submersible Borewell Pump',
      hpRating: '10 HP',
      rpm: '2880 RPM',
      voltage: '415V 3-Phase',
      issueDescription: 'Water ingress into stator cavity, tripped ELCB breaker immediately upon starting.',
      pickupRequired: false,
      contactName: 'Kailash Choudhary',
      phone: '+91 98291 54723',
      address: 'Gram Panchayat Delwara Road, Beawar',
      estimatedCostRange: '₹6,800 - ₹8,500',
      status: 'Diagnosis',
    }
  ];
  return await readJsonFile<RewindingBooking[]>('rewindings.json', sampleBookings);
}

export async function saveRewindings(rewindings: RewindingBooking[]): Promise<void> {
  await writeJsonFile('rewindings.json', rewindings);
}

export async function createRewinding(bookingData: Omit<RewindingBooking, 'id' | 'bookingNumber' | 'date' | 'status'>): Promise<RewindingBooking> {
  const rewindings = await getRewindings();
  const bookingNum = `RWD-${new Date().getFullYear()}-${String(rewindings.length + 45).padStart(4, '0')}`;
  const newBooking: RewindingBooking = {
    ...bookingData,
    id: `rew_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    bookingNumber: bookingNum,
    date: new Date().toISOString().split('T')[0],
    status: 'Received',
  };
  rewindings.unshift(newBooking);
  await saveRewindings(rewindings);
  return newBooking;
}

export async function updateRewindingStatus(id: string, status: RewindingBooking['status']): Promise<RewindingBooking | null> {
  const rewindings = await getRewindings();
  const index = rewindings.findIndex(r => r.id === id || r.bookingNumber === id);
  if (index === -1) return null;
  rewindings[index].status = status;
  await saveRewindings(rewindings);
  return rewindings[index];
}

// ----------------- STORE CONFIG -----------------
export async function getStoreConfig(): Promise<StoreConfig> {
  return await readJsonFile<StoreConfig>('config.json', initialStoreConfig);
}

export async function saveStoreConfig(config: StoreConfig): Promise<void> {
  await writeJsonFile('config.json', config);
}

// ----------------- INQUIRIES -----------------
export interface ContactInquiry {
  id: string;
  date: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject: string;
  message: string;
  status: 'Unread' | 'Replied' | 'Closed';
}

export async function getInquiries(): Promise<ContactInquiry[]> {
  return await readJsonFile<ContactInquiry[]>('inquiries.json', []);
}

export async function createInquiry(data: Omit<ContactInquiry, 'id' | 'date' | 'status'>): Promise<ContactInquiry> {
  const inquiries = await getInquiries();
  const newInquiry: ContactInquiry = {
    ...data,
    id: `inq_${Date.now()}`,
    date: new Date().toISOString(),
    status: 'Unread',
  };
  inquiries.unshift(newInquiry);
  await writeJsonFile('inquiries.json', inquiries);
  return newInquiry;
}
