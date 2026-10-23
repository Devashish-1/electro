import { Metadata } from 'next';
import { ContactPage } from '@/views/ContactPage';

export const metadata: Metadata = {
  title: 'Contact Engineering Desk & Workshop | DAGDI Electricals Beawar',
  description: 'Reach our sales and technical support team for custom APFC panels, motor breakdown services, and bulk welding electrode orders.',
};

export default function Page() {
  return <ContactPage />;
}
