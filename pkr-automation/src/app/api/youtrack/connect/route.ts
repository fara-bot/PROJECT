import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { youtrackUrl, youtrackToken } = await request.json();

    if (!youtrackUrl || !youtrackToken) {
      return NextResponse.json({ error: 'YouTrack URL and token are required.' }, { status: 400 });
    }

    // Construct the YouTrack API URL
    const projectsUrl = `${youtrackUrl.replace(/\/$/, '')}/api/admin/projects?fields=id,name`;

    const response = await fetch(projectsUrl, {
      headers: {
        'Authorization': `Bearer ${youtrackToken}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Authentication failed or invalid URL.' }));
      return NextResponse.json({ error: errorData.message || 'Failed to connect to YouTrack.' }, { status: response.status });
    }

    const projects = await response.json();

    return NextResponse.json({ projects });

  } catch (error) {
    console.error('YouTrack connection error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
