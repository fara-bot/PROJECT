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

export async function GET() {
  try {
    const db = await readDb();
    return NextResponse.json({ ticketLinks: db.ticket_links });
  } catch (error: any) {
    console.error('Failed to fetch ticket links:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
