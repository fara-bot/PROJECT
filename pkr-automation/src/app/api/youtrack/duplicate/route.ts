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

async function writeDb(data: any) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

export async function POST(request: NextRequest) {
  try {
    const { sourceTicketId, destinationProjectId, customTitle, customDescription, assigneeId, storyPoints, typeId } = await request.json();
    if (!sourceTicketId || !destinationProjectId || !customTitle) {
      return NextResponse.json({ error: 'Ticket ID, destination project, and title are required' }, { status: 400 });
    }

    const db = await readDb();
    // Simulate YouTrack ticket creation for local testing
    const newTicketId = `${destinationProjectId}-SIM-${Math.floor(Math.random() * 10000)}`;

    // Save the link and details in our local db file
    db.ticket_links.push({
      source_ticket_id: sourceTicketId,
      destination_ticket_id: newTicketId,
      title: customTitle,
      description: customDescription || '',
      assignee: assigneeId || '',
      storyPoints: storyPoints || '',
      type: typeId || '',
    });
    await writeDb(db);

    return NextResponse.json({ newTicketId: newTicketId });

  } catch (error: any) {
    console.error('Duplication error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
