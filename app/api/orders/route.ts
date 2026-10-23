import { NextRequest, NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const phone = searchParams.get('phone');
    const email = searchParams.get('email');

    let orders = await getOrders();

    if (status && status !== 'all') {
      orders = orders.filter(o => o.orderStatus === status);
    }

    if (phone) {
      orders = orders.filter(o => o.phone.includes(phone));
    }

    if (email) {
      orders = orders.filter(o => o.email.toLowerCase() === email.toLowerCase());
    }

    return NextResponse.json({ success: true, count: orders.length, data: orders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.customerName || !body.phone || !body.items || !body.items.length) {
      return NextResponse.json(
        { success: false, error: 'Customer name, phone, and items are required' },
        { status: 400 }
      );
    }

    const newOrder = await createOrder({
      customerName: body.customerName,
      email: body.email || '',
      phone: body.phone,
      address: body.address,
      city: body.city,
      state: body.state,
      pincode: body.pincode,
      isB2B: Boolean(body.isB2B),
      gstin: body.gstin || '',
      companyName: body.companyName || '',
      items: body.items,
      subtotal: Number(body.subtotal || 0),
      taxAmount: Number(body.taxAmount || 0),
      shippingCost: Number(body.shippingCost || 0),
      discountAmount: Number(body.discountAmount || 0),
      couponCode: body.couponCode || '',
      totalAmount: Number(body.totalAmount || 0),
      paymentMethod: body.paymentMethod || 'COD',
      paymentStatus: body.paymentStatus || (body.paymentMethod === 'COD' ? 'Pending' : 'Paid'),
      orderStatus: 'Confirmed',
    });

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
