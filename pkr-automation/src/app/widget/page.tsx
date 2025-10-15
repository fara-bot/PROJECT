'use client';

import { useState, useEffect, Suspense, CSSProperties } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const mockBoards = [
  { id: 'DIS', name: 'PKR Board' }, // Updated ID to DIS
  { id: 'WEB', name: 'Website Project' },
  { id: 'MOB', name: 'Mobile App' },
];
const mockUsers = [
  { id: 'harry-p', name: 'Harry Potter' },
  { id: 'hermione-g', name: 'Hermione Granger' },
  { id: 'ron-w', name: 'Ron Weasley' },
];
const mockTypes = [
  { id: 'user-story', name: 'User Story' },
  { id: 'bug', name: 'Bug' },
  { id: 'task', name: 'Task' },
];

function WidgetContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const issueIdFromUrl = searchParams.get('issueId');

  const [isClient, setIsClient] = useState(false);
  const [ticketNumber, setTicketNumber] = useState(''); // New state for ticket number input
  const [selectedBoard, setSelectedBoard] = useState('');
  const [syncToDiscoveries, setSyncToDiscoveries] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const [storyPoints, setStoryPoints] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('idle');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSync = async () => {
    const finalSourceTicketId = ticketNumber || issueIdFromUrl; // Use input field value or URL param

    if (!finalSourceTicketId) {
      setFeedback('Error: Source ticket ID is missing. Please provide a ticket number.');
      setStatus('error');
      return;
    }
    if (syncToDiscoveries && !title) {
      setFeedback('Title is required for syncing.');
      setStatus('error');
      return;
    }
    // NEW VALIDATION
    if (assignee && !mockUsers.some(u => u.id === assignee)) {
      setFeedback('Error: Invalid assignee selected.');
      setStatus('error');
      return;
    }
    if (type && !mockTypes.some(t => t.id === type)) {
      setFeedback('Error: Invalid type selected.');
      setStatus('error');
      return;
    }
    if (storyPoints && (isNaN(Number(storyPoints)) || Number(storyPoints) <= 0)) {
      setFeedback('Error: Story points must be a positive number.');
      setStatus('error');
      return;
    }

    if (!syncToDiscoveries) {
        setFeedback('Sync to Discoveries board is turned off.');
        setStatus('idle');
        return;
    }

    setStatus('syncing');
    setFeedback('Syncing...');

    try {
      const response = await fetch('/api/youtrack/duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceTicketId: finalSourceTicketId,
          destinationProjectId: 'DIS', // Hardcoded to 'DIS'
          customTitle: title,
          customDescription: description,
          assigneeId: assignee,
          storyPoints: storyPoints ? Number(storyPoints) : undefined,
          typeId: type,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Syncing failed');
      }

      setStatus('synced');
      setFeedback(`Synced as ${data.newTicketId}`);
      handleCancel(); // Clear form after successful sync
      router.push('/synced-tickets'); // Redirect to synced-tickets page
    } catch (err: any) {
      setStatus('error');
      setFeedback(err.message);
    }
  };

  const handleCancel = () => {
    setSelectedBoard('');
    setSyncToDiscoveries(false);
    setTitle('');
    setDescription('');
    setAssignee('');
    setStoryPoints('');
    setType('');
    setStatus('idle');
    setFeedback('');
  };

  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' };
  const inputStyle: CSSProperties = { width: '100%', padding: '4px', border: '1px solid #ccc', boxSizing: 'border-box' };

  return (
    <div style={{ backgroundColor: '#fbfbfb', padding: '12px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        
        {/* Left Column */}
        <div style={{ flex: 2 }}>
          <h4 style={{ margin: '0 0 12px 0', fontWeight: '600' }}>New Ticket Details</h4>
          <label htmlFor="ticket-number-input" style={labelStyle}>Source Ticket ID</label>
          <input
            id="ticket-number-input"
            type="text"
            value={ticketNumber}
            onChange={async (e) => {
              const id = e.target.value;
              setTicketNumber(id);
              if (id) {
                try {
                  const response = await fetch(`/api/youtrack/ticket-details?ticketId=${id}`);
                  if (response.ok) {
                    const data = await response.json();
                    setTitle(data.title || '');
                    setDescription(data.description || '');
                    setFeedback('');
                  } else {
                    const errorData = await response.json();
                    setFeedback(`Error fetching ticket details: ${errorData.error}`);
                    setTitle('');
                    setDescription('');
                  }
                } catch (err: any) {
                  setFeedback(`Error fetching ticket details: ${err.message}`);
                  setTitle('');
                  setDescription('');
                }
              } else {
                setTitle('');
                setDescription('');
                setFeedback('');
              }
            }}
            style={inputStyle}
            placeholder="Enter source ticket ID (e.g., JW-123)"
          />
          <label htmlFor="title-input" style={labelStyle}>Title</label>
          <input id="title-input" type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} placeholder="Write the title..." />

          <label htmlFor="desc-input" style={{ ...labelStyle, marginTop: '12px' }}>Description</label>
          <textarea id="desc-input" value={description} onChange={(e) => setDescription(e.target.value)} rows={8} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Write the description..." />


        </div>

        {/* Right Column */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 4px 0', fontWeight: '600' }}>Auto-Sync to Discoveries</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '20px' }}>
                    <input type="checkbox" checked={syncToDiscoveries} onChange={() => setSyncToDiscoveries(!syncToDiscoveries)} style={{ opacity: 0, width: 0, height: 0 }} />
                    <span style={{ position: 'absolute', cursor: 'pointer', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: syncToDiscoveries ? '#2563eb' : '#ccc', transition: '.4s', borderRadius: '20px' }}><span style={{ position: 'absolute', content: '""', height: '12px', width: '12px', left: '4px', bottom: '4px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%', transform: syncToDiscoveries ? 'translateX(20px)' : 'translateX(0)' }}></span></span>
                </label>
                <span>{syncToDiscoveries ? 'Sync on' : 'Sync off'}</span>
            </div>

          </div>

          <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

          <div>
            <div style={{ marginBottom: '12px' }}>
              <label htmlFor="type-select" style={labelStyle}>Type</label>
              <select id="type-select" value={type} onChange={(e) => setType(e.target.value)} style={inputStyle}>
                <option value="">Select Type...</option>
                {mockTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label htmlFor="assignee-select" style={labelStyle}>Assignee</label>
              <select id="assignee-select" value={assignee} onChange={(e) => setAssignee(e.target.value)} style={inputStyle}>
                <option value="">Unassigned</option>
                {mockUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="sp-input" style={labelStyle}>Story Points</label>
              <input id="sp-input" type="number" value={storyPoints} onChange={(e) => setStoryPoints(e.target.value)} style={inputStyle} />
            </div>
          </div>
        </div>
      </div>

      {/* New Save/Cancel Buttons */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'center' }}>
        <button onClick={handleSync} style={{ padding: '8px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', width: '120px' }}>Save</button>
        <button onClick={handleCancel} style={{ padding: '8px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', width: '120px' }}>Cancel</button>
      </div>

      {(status !== 'idle') && <div style={{ marginTop: '12px', color: status === 'error' ? 'red' : 'inherit' }}><p>{feedback}</p></div>}
      
      {/* Removed Current Ticket Info */}

    </div>
  );
}

export default function WidgetPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WidgetContent />
    </Suspense>
  );
}
