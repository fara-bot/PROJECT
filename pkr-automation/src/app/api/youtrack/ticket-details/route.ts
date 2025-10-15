import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { decrypt } from '@/lib/crypto';

const dbPath = path.join(process.cwd(), 'db.json');

async function readDb() {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { configurations: [], ticket_links: [] };
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get('ticketId');

    if (!ticketId) {
      return NextResponse.json({ error: 'Ticket ID is required.' }, { status: 400 });
    }

    // Simulate fetching ticket details for local testing
    const simulatedTitle = `Simulated Title for ${ticketId}`;
    const simulatedDescription = `This is a simulated description for ticket ${ticketId}. This data is not from YouTrack production.`;

    return NextResponse.json({
      title: simulatedTitle,
      description: simulatedDescription,
    });

  } catch (error: any) {
    console.error('Error fetching ticket details:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
