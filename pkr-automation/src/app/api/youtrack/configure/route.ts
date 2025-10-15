import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { encrypt } from '@/lib/crypto';

// Path to our local JSON database
const dbPath = path.join(process.cwd(), 'db.json');

async function readDb() {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is empty, return a default structure
    return { configurations: [], ticket_links: [] };
  }
}

async function writeDb(data: any) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

export async function POST(request: Request) {
  try {
    const { youtrackUrl, youtrackToken, sourceProject, destinationProject } = await request.json();
    if (!youtrackUrl || !youtrackToken || !sourceProject || !destinationProject) {
      return NextResponse.json({ error: 'All configuration fields are required.' }, { status: 400 });
    }

    const encryptedToken = await encrypt(youtrackToken);
    const db = await readDb();

    // For simplicity, this will always overwrite the first configuration.
    db.configurations[0] = {
      id: 1, // Simple ID for local file
      youtrack_url: youtrackUrl,
      youtrack_token_encrypted: encryptedToken,
      source_project_id: sourceProject,
      destination_project_id: destinationProject,
    };

    await writeDb(db);

    return NextResponse.json({ message: 'Configuration saved successfully.' }, { status: 200 });
  } catch (error: any) {
    console.error('Failed to save configuration:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
