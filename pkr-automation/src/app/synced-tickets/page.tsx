'use client';

import { useState, useEffect } from 'react';
import TicketDetailsModal from './TicketDetailsModal';

interface TicketLink {
  source_ticket_id: string;
  destination_ticket_id: string;
  title: string;
  description: string;
  assignee: string;
  storyPoints: number | string;
  type: string;
}

export default function SyncedTicketsPage() {
  const [ticketLinks, setTicketLinks] = useState<TicketLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketLink | null>(null);

  const handleTicketClick = (ticket: TicketLink) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTicket(null);
  };

  const handleSaveTicketDetails = async (updatedTicket: TicketLink) => {
    try {
      const response = await fetch('/api/ticket-links/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTicket),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update the local state to reflect the changes
      setTicketLinks((prevLinks) =>
        prevLinks.map((link) =>
          link.source_ticket_id === updatedTicket.source_ticket_id ? updatedTicket : link
        )
      );
      // setShowModal(false); // Keep modal open after save
      // setSelectedTicket(null); // Keep selected ticket in state
    } catch (err: any) {
      console.error('Failed to save ticket details:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    async function fetchTicketLinks() {
      try {
        const response = await fetch('/api/ticket-links');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTicketLinks(data.ticketLinks);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTicketLinks();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>Loading synced tickets...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', fontFamily: 'sans-serif', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Synced Tickets Overview</h1>
      {ticketLinks.length === 0 ? (
        <p>No tickets have been synced yet.</p>
      ) : (
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Source Board */}
          <div style={{ flex: 1, border: '1px solid #ccc', padding: '15px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>SEO Board</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {ticketLinks.map((link, index) => (
                <li
                  key={index}
                  style={{ marginBottom: '10px', border: '1px solid #e0e0e0', padding: '10px', borderRadius: '5px', backgroundColor: '#fff', cursor: 'pointer' }}
                  onClick={() => handleTicketClick(link)}
                >
                  <p style={{ margin: 0 }}>{link.source_ticket_id}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Destination Board */}
          <div style={{ flex: 1, border: '1px solid #ccc', padding: '15px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Discoveries Board</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {ticketLinks.map((link, index) => (
                <li
                  key={index}
                  style={{ marginBottom: '10px', border: '1px solid #e0e0e0', padding: '10px', borderRadius: '5px', backgroundColor: '#fff', cursor: 'pointer' }}
                  onClick={() => handleTicketClick(link)}
                >
                  <p style={{ margin: 0 }}>DIS-{link.destination_ticket_id}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {showModal && selectedTicket && (
        <TicketDetailsModal ticket={selectedTicket} onClose={handleCloseModal} onSave={handleSaveTicketDetails} />
      )}
    </div>
  );
}
