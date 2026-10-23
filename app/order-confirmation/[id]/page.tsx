import { Metadata } from 'next';
import { getOrderById } from '@/lib/db';
import { OrderConfirmationPage } from '@/views/OrderConfirmationPage';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order Tax Invoice ${id} | DAGDI Electricals`,
    description: `Official GST Tax invoice and order status for order ${id}.`,
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const order = await getOrderById(id);

  return <OrderConfirmationPage initialOrder={order || undefined} />;
}
