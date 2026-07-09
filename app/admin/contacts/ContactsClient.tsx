'use client';

import { useState, useTransition } from 'react';
import type { Contact } from '@prisma/client';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { markReadAction } from './actions';

export default function ContactsClient({ contacts }: { contacts: Contact[] }) {
  const [list, setList] = useState(contacts);
  const [, startTransition] = useTransition();

  const unread = list.filter((c) => !c.read).length;

  const handleMarkRead = (id: string) => {
    startTransition(async () => {
      await markReadAction(id);
      setList((prev) => prev.map((c) => (c.id === id ? { ...c, read: true } : c)));
    });
  };

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 3, md: 6 }, py: { xs: 6, md: 8 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mb: 6, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography
            sx={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.65rem', color: '#4ade80', mb: 1, letterSpacing: '0.05em' }}
          >
            // contact submissions
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
            Contacts
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography sx={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.7rem', color: 'text.secondary' }}>
            total: {list.length}
          </Typography>
          {unread > 0 && (
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                backgroundColor: '#4ade8020',
                border: '1px solid #4ade80',
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '0.65rem',
                color: '#4ade80',
              }}
            >
              {unread} unread
            </Box>
          )}
        </Box>
      </Box>

      {/* List */}
      {list.length === 0 ? (
        <Box sx={{ py: 16, textAlign: 'center' }}>
          <Typography sx={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.75rem', color: 'text.secondary' }}>
            // no contacts yet
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {list.map((contact, i) => (
            <Box
              key={contact.id}
              sx={{
                borderTop: i === 0 ? '1px solid' : 'none',
                borderBottom: '1px solid',
                borderColor: 'divider',
                py: 3,
                px: 2,
                display: 'flex',
                gap: 3,
                alignItems: 'flex-start',
                backgroundColor: contact.read ? 'transparent' : 'background.paper',
                transition: 'background-color 0.2s',
                '&:hover': { backgroundColor: 'background.paper' },
              }}
            >
              {/* Unread dot */}
              <Box sx={{ mt: '6px', flexShrink: 0, width: 6, height: 6 }}>
                {!contact.read && (
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
                )}
              </Box>

              {/* Content */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.85rem', color: 'text.primary', fontWeight: 500 }}>
                    {contact.name}
                  </Typography>
                  <Typography
                    component="a"
                    href={`mailto:${contact.email}`}
                    sx={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.7rem', color: '#4ade80', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                  >
                    {contact.email}
                  </Typography>
                  {contact.phone && (
                    <Typography sx={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.7rem', color: 'text.secondary' }}>
                      {contact.phone}
                    </Typography>
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 1.5, whiteSpace: 'pre-wrap' }}>
                  {contact.message}
                </Typography>
                <Typography sx={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.6rem', color: 'text.secondary', opacity: 0.5 }}>
                  {new Date(contact.createdAt).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}
                </Typography>
              </Box>

              {/* Actions */}
              {!contact.read && (
                <Tooltip title="mark as read" placement="top">
                  <IconButton
                    size="small"
                    onClick={() => handleMarkRead(contact.id)}
                    sx={{
                      color: 'text.secondary',
                      borderRadius: 0,
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': { borderColor: '#4ade80', color: '#4ade80' },
                      transition: 'all 0.15s',
                      flexShrink: 0,
                    }}
                  >
                    <DoneAllIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
}
