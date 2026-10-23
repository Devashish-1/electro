import { NextRequest, NextResponse } from 'next/server';
import { getQuotations, createQuotation } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let quotations = await getQuotations();

    if (status && status !== 'all') {
      quotations = quotations.filter(q => q.status === status);
    }

    return NextResponse.json({ success: true, count: quotations.length, data: quotations });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch quotations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.contactName || !body.phone || !body.requestedItems || !body.requestedItems.length) {
      return NextResponse.json(
        { success: false, error: 'Contact name, phone, and requested items are required' },
        { status: 400 }
      );
    }

    const newRfq = await createQuotation({
      contactName: body.contactName,
      companyName: body.companyName || '',
      gstin: body.gstin || '',
      email: body.email || '',
      phone: body.phone,
      city: body.city || '',
      state: body.state || '',
      pincode: body.pincode || '',
      requestedItems: body.requestedItems,
      projectNotes: body.projectNotes || '',
      estimatedBudget: body.estimatedBudget || '',
    });

    return NextResponse.json({ success: true, data: newRfq }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create quotation request' },
      { status: 500 }
    );
  }
}
