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
  { label: 'projects', href: '/admin/projects' },
  { label: 'games', href: '/admin/games' },
  { label: 'users', href: '/admin/users' },
];

export default function AdminShell({ children, session }: { children: ReactNode; session: Session }) {
  const pathname = usePathname();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      {/* Dynamic Island pill */}
      <Box sx={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 1300 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2.5,
            py: 1,
            borderRadius: '100px',
            backgroundColor: 'rgba(15,23,42,0.92)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
            whiteSpace: 'nowrap',
          }}
        >
          {/* Logo */}
          <Typography
            component={Link}
            href="/admin/contacts"
            sx={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '0.7rem',
              color: '#38bdf8',
              textDecoration: 'none',
              letterSpacing: '0.05em',
              flexShrink: 0,
            }}
          >
            ~/admin
          </Typography>

          <Box sx={{ width: '1px', height: 12, backgroundColor: 'rgba(255,255,255,0.12)', flexShrink: 0 }} />

          {/* Nav items */}
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Typography
                key={item.href}
                component={Link}
                href={item.href}
                sx={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: '0.68rem',
                  color: isActive ? '#7dd3fc' : 'rgba(255,255,255,0.45)',
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                  transition: 'color 0.2s',
                  '&:hover': { color: '#7dd3fc' },
                }}
              >
                {item.label}
              </Typography>
            );
          })}

          <Box sx={{ width: '1px', height: 12, backgroundColor: 'rgba(255,255,255,0.12)', flexShrink: 0 }} />

          {/* View site */}
          <Typography
            component="a"
            href="/"
            sx={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '0.62rem',
              color: 'rgba(255,255,255,0.25)',
              textDecoration: 'none',
              letterSpacing: '0.04em',
              transition: 'color 0.2s',
              '&:hover': { color: '#7dd3fc' },
            }}
          >
            ↗ site
          </Typography>

          {/* Email */}
          <Typography
            sx={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '0.6rem',
              color: 'rgba(255,255,255,0.2)',
              letterSpacing: '0.03em',
              display: { xs: 'none', md: 'block' },
            }}
          >
            {session.user?.email}
          </Typography>

          {/* Sign out */}
          <Box
            onClick={() => signOut({ callbackUrl: '/' })}
            sx={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '0.6rem',
              color: 'rgba(255,255,255,0.25)',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              transition: 'color 0.2s',
              '&:hover': { color: '#f87171' },
            }}
          >
            sign_out()
          </Box>
        </Box>
      </Box>

      {/* Content — offset for fixed pill */}
      <Box sx={{ flex: 1, overflow: 'auto', pt: '72px' }}>
        {children}
      </Box>
    </Box>
  );
}
