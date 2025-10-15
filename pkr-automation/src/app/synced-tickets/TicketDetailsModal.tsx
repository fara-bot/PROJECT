'use client';

import React from 'react';

const mockUsers = [
  { id: 'harry-p', name: 'Harry Potter' },
  { id: 'hermione-g', name: 'Hermione Granger' },
  { id: 'ron-w', name: 'Ron Weasley' },
  { id: '', name: 'Unassigned' }, // Option for unassigning
];

const mockTypes = [
  { id: 'user-story', name: 'User Story' },
  { id: 'bug', name: 'Bug' },
  { id: 'task', name: 'Task' },
  { id: '', name: 'Select Type...' }, // Option for no type selected
];

interface TicketLink {
  source_ticket_id: string;
  destination_ticket_id: string;
  title: string;
  description: string;
  assignee: string;
  storyPoints: number | string;
  type: string;
}

interface TicketDetailsModalProps {
  ticket: TicketLink;
  onClose: () => void;
  onSave: (updatedTicket: TicketLink) => void;
}

export default function TicketDetailsModal({ ticket, onClose, onSave }: TicketDetailsModalProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedTitle, setEditedTitle] = React.useState(ticket.title);
  const [editedDescription, setEditedDescription] = React.useState(ticket.description);
  const [editedAssignee, setEditedAssignee] = React.useState(ticket.assignee);
  const [editedStoryPoints, setEditedStoryPoints] = React.useState(ticket.storyPoints);
  const [editedType, setEditedType] = React.useState(ticket.type);

  React.useEffect(() => {
    setEditedTitle(ticket.title);
    setEditedDescription(ticket.description);
    setEditedAssignee(ticket.assignee);
    setEditedStoryPoints(ticket.storyPoints);
    setEditedType(ticket.type);
  }, [ticket]);

  const handleSave = () => {
    onSave({
      ...ticket,
      title: editedTitle,
      description: editedDescription,
      assignee: editedAssignee,
      storyPoints: editedStoryPoints,
      type: editedType,
    });
    setIsEditing(false);
  };

  const modalStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const contentStyle: React.CSSProperties = {
    backgroundColor: '#fbfbfb',
    padding: '20px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90%',
    overflowY: 'auto',
    fontFamily: 'sans-serif',
    position: 'relative',
  };

  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '4px',
    marginTop: '12px',
  };

  const valueStyle: React.CSSProperties = {
    backgroundColor: '#e9ecef',
    padding: '8px',
    borderRadius: '4px',
    marginBottom: '10px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    border: '1px solid transparent',
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeButtonStyle} onClick={onClose}>&times;</button>
        <h2 style={{ fontSize: '22px', marginBottom: '20px' }}>Ticket Details</h2>

        <label style={labelStyle}>Title:</label>
        {isEditing ? (
          <input
            type="text"
            style={{ ...valueStyle, border: '1px solid #ccc' }}
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
        ) : (
          <div style={valueStyle}>{editedTitle}</div>
        )}

        <label style={labelStyle}>Description:</label>
        {isEditing ? (
          <textarea
            style={{ ...valueStyle, border: '1px solid #ccc', minHeight: '80px' }}
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
        ) : (
          <div style={valueStyle}>{editedDescription}</div>
        )}

        <label style={labelStyle}>Assignee:</label>
        {isEditing ? (
          <select
            style={{ ...valueStyle, border: '1px solid #ccc' }}
            value={editedAssignee}
            onChange={(e) => setEditedAssignee(e.target.value)}
          >
            {mockUsers.map((user) => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        ) : (
          <div style={valueStyle}>{editedAssignee || 'Unassigned'}</div>
        )}

        <label style={labelStyle}>Story Points:</label>
        {isEditing ? (
          <input
            type="number"
            style={{ ...valueStyle, border: '1px solid #ccc' }}
            value={editedStoryPoints}
            onChange={(e) => setEditedStoryPoints(e.target.value)}
          />
        ) : (
          <div style={valueStyle}>{editedStoryPoints}</div>
        )}

        <label style={labelStyle}>Type:</label>
        {isEditing ? (
          <select
            style={{ ...valueStyle, border: '1px solid #ccc' }}
            value={editedType}
            onChange={(e) => setEditedType(e.target.value)}
          >
            {mockTypes.map((type) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        ) : (
          <div style={valueStyle}>{editedType || 'No Type Selected'}</div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          {isEditing ? (
            <button
              style={{ padding: '8px 15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              onClick={handleSave}
            >
              Save
            </button>
          ) : (
            <button
              style={{ padding: '8px 15px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          )}
          <button
            style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
