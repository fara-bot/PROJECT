import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/crypto';

import { inMemoryTicketLinks } from '@/lib/inMemoryStore';

export async function POST(request: NextRequest) {
  try {
    const { sourceTicketId, destinationProjectId, customTitle, customDescription, assigneeId, storyPoints, typeId } = await request.json();
    if (!sourceTicketId || !destinationProjectId || !customTitle) {
      return NextResponse.json({ error: 'Ticket ID, destination project, and title are required' }, { status: 400 });
    }

    // Simulate YouTrack ticket creation for local testing
    const newTicketId = `${destinationProjectId}-${Math.floor(Math.random() * 10000)}`;

    // Save the link and details in our in-memory store
    inMemoryTicketLinks.push({
      source_ticket_id: sourceTicketId,
      destination_ticket_id: newTicketId,
      title: customTitle,
      description: customDescription || '',
      assignee: assigneeId || '',
      storyPoints: storyPoints || '',
      type: typeId || '',
    });

    return NextResponse.json({ newTicketId: newTicketId });

  } catch (error: any) {
    console.error('Duplication error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}