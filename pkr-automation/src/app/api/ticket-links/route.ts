import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await readDb();
    return NextResponse.json({ ticketLinks: db.ticketLinks });
  } catch (error: any) {
    console.error('Failed to fetch ticket links:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}