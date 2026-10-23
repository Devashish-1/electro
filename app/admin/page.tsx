import { Metadata } from 'next';
import { AdminDashboardPage } from '@/views/AdminDashboardPage';

export const metadata: Metadata = {
  title: 'Admin Management Console | DAGDI Electricals',
  description: 'Manage store orders, B2B RFQ quotations, motor rewinding job cards, and product inventory.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <AdminDashboardPage />;
}
