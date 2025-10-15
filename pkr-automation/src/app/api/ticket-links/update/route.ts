import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

async function readDb() {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { configurations: [], ticket_links: [] };
  }
}

async function writeDb(data: any) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

export async function POST(request: Request) {
  try {
    const updatedTicket = await request.json();

    if (!updatedTicket || !updatedTicket.source_ticket_id) {
      return NextResponse.json({ error: 'Invalid ticket data provided.' }, { status: 400 });
    }

    const db = await readDb();
    const ticketIndex = db.ticket_links.findIndex(
      (link: any) => link.source_ticket_id === updatedTicket.source_ticket_id
    );

    if (ticketIndex === -1) {
      return NextResponse.json({ error: 'Ticket link not found.' }, { status: 404 });
    }

    db.ticket_links[ticketIndex] = updatedTicket;
    await writeDb(db);

    return NextResponse.json({ message: 'Ticket link updated successfully.' });
  } catch (error: any) {
    console.error('Failed to update ticket link:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
