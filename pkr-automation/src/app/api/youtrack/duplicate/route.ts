import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/crypto';
import { readDb, writeDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { sourceTicketId, destinationProjectId, customTitle, customDescription, assigneeId, storyPoints, typeId } = await request.json();
    if (!sourceTicketId || !destinationProjectId || !customTitle) {
      return NextResponse.json({ error: 'Ticket ID, destination project, and title are required' }, { status: 400 });
    }

    // Simulate YouTrack ticket creation for local testing
    const newTicketId = `${destinationProjectId}-${Math.floor(Math.random() * 10000)}`;

    // Read current data from db.json
    const db = await readDb();

    // Save the link and details in our persistent store
    db.ticketLinks.push({
      source_ticket_id: sourceTicketId,
      destination_ticket_id: newTicketId,
      title: customTitle,
      description: customDescription || '',
      assignee: assigneeId || '',
      storyPoints: storyPoints || '',
      type: typeId || '',
    });

    // Write updated data back to db.json
    await writeDb(db);

    return NextResponse.json({ newTicketId: newTicketId });

  } catch (error: any) {
    console.error('Duplication error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}