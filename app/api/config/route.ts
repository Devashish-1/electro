import { NextRequest, NextResponse } from 'next/server';
import { getStoreConfig, saveStoreConfig } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const config = await getStoreConfig();
    return NextResponse.json({ success: true, data: config });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error fetching store config' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    await saveStoreConfig(body);
    return NextResponse.json({ success: true, data: body });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error saving store config' },
      { status: 500 }
    );
  }
}
