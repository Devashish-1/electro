import { Metadata } from 'next';
import { QuotationBuilderPage } from '@/views/QuotationBuilderPage';

export const metadata: Metadata = {
  title: 'B2B Quotation Builder & RFQ Desk | DAGDI Electricals & Power Controls',
  description: 'Request formal GST tax quotations for custom APFC panels, bulk welding consumables, electric motors and copper winding wires.',
};

export default function Page() {
  return <QuotationBuilderPage />;
}
