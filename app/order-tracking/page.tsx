import { Metadata } from 'next';
import { OrderTrackingPage } from '@/views/OrderTrackingPage';

export const metadata: Metadata = {
  title: 'Track Industrial Order & Dispatch Status | DAGDI Electricals',
  description: 'Real-time tracking for electrical orders, dispatched motor rewindings, and freight shipments.',
};

export default function Page() {
  return <OrderTrackingPage />;
}
