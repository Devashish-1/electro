import { NextResponse } from 'next/server';
import { getProducts, getOrders, getQuotations, getRewindings } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const [products, orders, quotations, rewindings] = await Promise.all([
      getProducts(),
      getOrders(),
      getQuotations(),
      getRewindings(),
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const pendingOrders = orders.filter(o => o.orderStatus === 'Confirmed' || o.orderStatus === 'Processing');
    const newQuotations = quotations.filter(q => q.status === 'New' || q.status === 'Under Review');
    const activeRewindings = rewindings.filter(r => r.status !== 'Ready for Dispatch');
    const lowStockProducts = products.filter(p => p.stockCount <= 5);

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        ordersCount: orders.length,
        pendingOrdersCount: pendingOrders.length,
        quotationsCount: quotations.length,
        newQuotationsCount: newQuotations.length,
        rewindingsCount: rewindings.length,
        activeRewindingsCount: activeRewindings.length,
        productsCount: products.length,
        lowStockCount: lowStockProducts.length,
      },
      recentOrders: orders.slice(0, 5),
      recentQuotations: quotations.slice(0, 5),
      recentRewindings: rewindings.slice(0, 5),
      lowStockProducts: lowStockProducts.slice(0, 5),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error fetching admin stats' },
      { status: 500 }
    );
  }
}
