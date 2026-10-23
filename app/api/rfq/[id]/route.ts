import { NextRequest, NextResponse } from 'next/server';
import { getQuotationById, updateQuotationStatus } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rfq = await getQuotationById(id);

    if (!rfq) {
      return NextResponse.json(
        { success: false, error: 'Quotation request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: rfq });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error fetching quotation' },
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

    const updated = await updateQuotationStatus(id, body.status, body.adminNotes);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Quotation request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error updating quotation' },
      { status: 500 }
    );
  }
}
