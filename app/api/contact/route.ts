import { NextRequest, NextResponse } from 'next/server';
import { createInquiry } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.phone || !body.message) {
      return NextResponse.json(
        { success: false, error: 'Name, phone, and message are required' },
        { status: 400 }
      );
    }

    const inquiry = await createInquiry({
      name: body.name,
      email: body.email || '',
      phone: body.phone,
      company: body.company || '',
      subject: body.subject || 'General Inquiry',
      message: body.message,
    });

    return NextResponse.json({ success: true, data: inquiry }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error submitting contact form' },
      { status: 500 }
    );
  }
}
