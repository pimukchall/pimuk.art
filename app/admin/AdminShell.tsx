'use client';

import { type Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import type { ReactNode } from 'react';

const navItems = [
  { label: 'contacts', href: '/admin/contacts' },
  { label: 'users', href: '/admin/users' },
];

export default function AdminShell({ children, session }: { children: ReactNode; session: Session }) {
  const pathname = usePathname();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <Box
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          px: { xs: 3, md: 6 },
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          backgroundColor: 'background.paper',
        }}
      >
        <Typography
          component={Link}
          href="/admin/contacts"
          sx={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '0.75rem',
            color: '#4ade80',
            textDecoration: 'none',
            letterSpacing: '0.05em',
            mr: 2,
          }}
        >
          ~/admin
        </Typography>

        {navItems.map((item) => (
          <Typography
            key={item.href}
            component={Link}
            href={item.href}
            sx={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '0.7rem',
              color: pathname === item.href ? '#4ade80' : 'text.secondary',
              textDecoration: 'none',
              letterSpacing: '0.05em',
              borderBottom: pathname === item.href ? '1px solid #4ade80' : '1px solid transparent',
              pb: 0.25,
              transition: 'color 0.2s',
              '&:hover': { color: '#4ade80' },
            }}
          >
            {item.label}
          </Typography>
        ))}

        <Box sx={{ flex: 1 }} />

        <Typography
          sx={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '0.65rem',
            color: 'text.secondary',
          }}
        >
          {session.user?.email}
        </Typography>

        <Button
          size="small"
          variant="outlined"
          onClick={() => signOut({ callbackUrl: '/' })}
          sx={{ py: 0.5, px: 2, fontSize: '0.6rem', minHeight: 0 }}
        >
          sign_out()
        </Button>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {children}
      </Box>
    </Box>
  );
}
