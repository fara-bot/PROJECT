'use client';

import { useState } from 'react';

export default function ConfigurePage() {
  const [youtrackUrl, setYoutrackUrl] = useState('');
  const [youtrackToken, setYoutrackToken] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [projects, setProjects] = useState<{ id: string, name: string }[]>([]);
  const [sourceProject, setSourceProject] = useState('');
  const [destinationProject, setDestinationProject] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/youtrack/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ youtrackUrl, youtrackToken }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to connect.');
      }
      setProjects(data.projects);
      setIsConnected(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfiguration = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/youtrack/configure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          youtrackUrl,
          youtrackToken, // Sending the raw token to the backend for encryption
          sourceProject,
          destinationProject,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save configuration.');
      }
      alert('Configuration saved successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Connect to YouTrack
          </h1>
          <p className="mt-2 text-gray-600">
            Enter your YouTrack instance URL and a permanent token to get started.
          </p>
        </div>

        {error && (
          <div className="p-4 text-center bg-red-100 border border-red-200 rounded-md">
            <p className="font-medium text-red-800">Error: {error}</p>
          </div>
        )}

        {!isConnected ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="youtrackUrl" className="block text-sm font-medium text-gray-700">
                YouTrack URL
              </label>
              <input
                type="text"
                id="youtrackUrl"
                value={youtrackUrl}
                onChange={(e) => setYoutrackUrl(e.target.value)}
                placeholder="https://your-instance.myjetbrains.com/youtrack"
                className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="youtrackToken" className="block text-sm font-medium text-gray-700">
                Permanent Token
              </label>
              <input
                type="password"
                id="youtrackToken"
                value={youtrackToken}
                onChange={(e) => setYoutrackToken(e.target.value)}
                placeholder="perm:xxxxxxxx.xxxxxxxx.xxxxxxxx"
                className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleConnect}
              className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? 'Connecting...' : 'Connect'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 text-center bg-green-100 border border-green-200 rounded-md">
              <p className="font-medium text-green-800">Successfully connected to YouTrack!</p>
            </div>
            <div>
              <label htmlFor="sourceProject" className="block text-sm font-medium text-gray-700">
                Source Project
              </label>
              <select
                id="sourceProject"
                value={sourceProject}
                onChange={(e) => setSourceProject(e.target.value)}
                className="w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md"
              >
                <option value="">Select source project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="destinationProject" className="block text-sm font-medium text-gray-700">
                Destination Project (for PKR)
              </label>
              <select
                id="destinationProject"
                value={destinationProject}
                onChange={(e) => setDestinationProject(e.target.value)}
                className="w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md"
              >
                <option value="">Select destination project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSaveConfiguration}
              className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Save Configuration
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
