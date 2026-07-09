'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function AdminBarClient() {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        backgroundColor: '#0a0a0a',
        border: '1px solid #222',
        px: 3,
        py: 1.25,
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
      }}
    >
      <Typography
        sx={{
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: '0.6rem',
          color: '#4ade80',
          letterSpacing: '0.08em',
        }}
      >
        ~/admin
      </Typography>

      <Box sx={{ width: '1px', height: 12, backgroundColor: '#222' }} />

      <Typography
        component="a"
        href="/admin/contacts"
        sx={{
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: '0.6rem',
          color: '#555',
          textDecoration: 'none',
          letterSpacing: '0.05em',
          transition: 'color 0.2s',
          '&:hover': { color: '#fff' },
        }}
      >
        contacts
      </Typography>

      <Typography
        component="a"
        href="/admin/projects"
        sx={{
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: '0.6rem',
          color: '#555',
          textDecoration: 'none',
          letterSpacing: '0.05em',
          transition: 'color 0.2s',
          '&:hover': { color: '#fff' },
        }}
      >
        projects
      </Typography>

      <Typography
        component="a"
        href="/admin/users"
        sx={{
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: '0.6rem',
          color: '#555',
          textDecoration: 'none',
          letterSpacing: '0.05em',
          transition: 'color 0.2s',
          '&:hover': { color: '#fff' },
        }}
      >
        users
      </Typography>
    </Box>
  );
}
