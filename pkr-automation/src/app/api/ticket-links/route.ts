import { NextResponse } from 'next/server';
import { inMemoryTicketLinks } from '@/lib/inMemoryStore';

export async function GET() {
  try {
    // Return the in-memory stored ticket links
    return NextResponse.json({ ticketLinks: inMemoryTicketLinks });
  } catch (error: any) {
    console.error('Failed to fetch ticket links:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}