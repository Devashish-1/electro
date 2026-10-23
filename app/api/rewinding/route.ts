import { NextRequest, NextResponse } from 'next/server';
import { getRewindings, createRewinding } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let rewindings = await getRewindings();

    if (status && status !== 'all') {
      rewindings = rewindings.filter(r => r.status === status);
    }

    return NextResponse.json({ success: true, count: rewindings.length, data: rewindings });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch rewinding bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.contactName || !body.phone || !body.motorType || !body.hpRating) {
      return NextResponse.json(
        { success: false, error: 'Contact name, phone, motor type, and HP rating are required' },
        { status: 400 }
      );
    }

    const newBooking = await createRewinding({
      motorType: body.motorType,
      hpRating: body.hpRating,
      rpm: body.rpm || '1440 RPM',
      voltage: body.voltage || '415V 3-Phase',
      issueDescription: body.issueDescription || '',
      pickupRequired: Boolean(body.pickupRequired),
      contactName: body.contactName,
      phone: body.phone,
      address: body.address || '',
      estimatedCostRange: body.estimatedCostRange || '₹5,000 - ₹12,000',
    });

    return NextResponse.json({ success: true, data: newBooking }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create rewinding booking' },
      { status: 500 }
    );
  }
}
