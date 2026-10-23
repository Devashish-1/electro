import { NextRequest, NextResponse } from 'next/server';
import { getRewindings, updateRewindingStatus } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rewindings = await getRewindings();
    const booking = rewindings.find(r => r.id === id || r.bookingNumber === id);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Rewinding booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error fetching rewinding booking' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      );
    }

    const updated = await updateRewindingStatus(id, body.status);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Rewinding booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error updating rewinding status' },
      { status: 500 }
    );
  }
}
