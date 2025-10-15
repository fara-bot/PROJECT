import { NextResponse } from 'next/server';
import { encrypt } from '@/lib/crypto';
import { inMemoryConfigurations } from '@/lib/inMemoryStore';

export async function POST(request: Request) {
  try {
    const { youtrackUrl, youtrackToken, sourceProject, destinationProject } = await request.json();
    if (!youtrackUrl || !youtrackToken || !sourceProject || !destinationProject) {
      return NextResponse.json({ error: 'All configuration fields are required.' }, { status: 400 });
    }

    const encryptedToken = await encrypt(youtrackToken);

    // For simplicity, this will always overwrite the first configuration in memory.
    inMemoryConfigurations[0] = {
      id: 1, // Simple ID for in-memory store
      youtrack_url: youtrackUrl,
      youtrack_token_encrypted: encryptedToken,
      source_project_id: sourceProject,
      destination_project_id: destinationProject,
    };

    console.log('YouTrack Configuration received and stored in-memory:', {
      youtrackUrl,
      youtrackToken: youtrackToken ? '********' : '', // Mask token for logs
      sourceProject,
      destinationProject,
    });

    return NextResponse.json({ message: 'Configuration received and stored in-memory successfully.' }, { status: 200 });
  } catch (error: any) {
    console.error('Failed to process configuration:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
