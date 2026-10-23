import { Metadata } from 'next';
import { CheckoutPage } from '@/views/CheckoutPage';

export const metadata: Metadata = {
  title: 'Secure Checkout & B2B Billing | DAGDI Electricals',
  description: 'Complete your industrial order with GST tax invoicing, input tax credit, and secure payment options.',
};

export default function Page() {
  return <CheckoutPage />;
}
