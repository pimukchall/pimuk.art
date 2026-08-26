'use client';

import { type Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import type { ReactNode } from 'react';
import { useThemeMode } from '@/app/ThemeContext';

const SIDEBAR_WIDTH = 200;
const SIDEBAR_WIDTH_COLLAPSED = 64;

const navGroups = [
  {
    label: null,
    items: [{ label: 'dashboard', href: '/admin' }],
  },
  {
    label: 'content',
    items: [
      { label: 'contacts', href: '/admin/contacts' },
      { label: 'projects', href: '/admin/projects' },
      { label: 'games', href: '/admin/games' },
    ],
  },
  {
    label: 'planning',
    items: [
      { label: 'tasks', href: '/admin/tasks' },
      { label: 'calendar', href: '/admin/calendar' },
      { label: 'timeline', href: '/admin/timeline' },
    ],
  },
  {
    label: 'finance',
    items: [
      { label: 'assets', href: '/admin/assets' },
      { label: 'transactions', href: '/admin/transactions' },
    ],
  },
  {
    label: 'it',
    items: [
      { label: 'it-assets', href: '/admin/it-assets' },
      { label: 'licenses', href: '/admin/licenses' },
    ],
  },
  {
    label: 'system',
    items: [
      { label: 'users', href: '/admin/users' },
      { label: 'audit-log', href: '/admin/audit-log' },
    ],
  },
];

export default function AdminShell({ children, session }: { children: ReactNode; session: Session }) {
  const pathname = usePathname();
  const { mode, toggleMode } = useThemeMode();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', display: 'flex' }}>
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { xs: SIDEBAR_WIDTH_COLLAPSED, md: SIDEBAR_WIDTH },
          flexShrink: 0,
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          borderRight: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1300,
        }}
      >
        {/* Logo */}
        <Box sx={{ px: { xs: 1.5, md: 2.5 }, py: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography
            component={Link}
            href="/admin"
            sx={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '0.7rem',
              color: '#38bdf8',
              textDecoration: 'none',
              letterSpacing: '0.05em',
              display: { xs: 'none', md: 'block' },
            }}
          >
            ~/admin
          </Typography>
          <Typography
            component={Link}
            href="/admin"
            sx={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '0.7rem',
              color: '#38bdf8',
              textDecoration: 'none',
              display: { xs: 'block', md: 'none' },
              textAlign: 'center',
            }}
          >
            ~
          </Typography>
        </Box>

        {/* Nav items */}
        <Box sx={{ flex: 1, overflowY: 'auto', py: 1.5 }}>
          {navGroups.map((group, gi) => (
            <Box key={group.label ?? `group-${gi}`} sx={{ mb: 1 }}>
              {group.label && (
                <Typography
                  sx={{
                    display: { xs: 'none', md: 'block' },
                    fontFamily: 'var(--font-geist-mono), monospace',
                    fontSize: '0.58rem',
                    color: 'text.disabled',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    px: 2.5,
                    pt: 1.5,
                    pb: 0.5,
                  }}
                >
                  {group.label}
                </Typography>
              )}
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Typography
                    key={item.href}
                    component={Link}
                    href={item.href}
                    sx={{
                      display: 'block',
                      fontFamily: 'var(--font-geist-mono), monospace',
                      fontSize: '0.7rem',
                      color: isActive ? '#38bdf8' : 'text.secondary',
                      textDecoration: 'none',
                      letterSpacing: '0.04em',
                      px: { xs: 1.5, md: 2.5 },
                      py: 1.2,
                      borderLeft: '2px solid',
                      borderColor: isActive ? '#38bdf8' : 'transparent',
                      backgroundColor: isActive ? 'action.hover' : 'transparent',
                      transition: 'color 0.15s, border-color 0.15s',
                      textAlign: { xs: 'center', md: 'left' },
                      '&:hover': { color: '#38bdf8' },
                    }}
                  >
                    <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>{item.label}</Box>
                    <Box component="span" sx={{ display: { xs: 'inline', md: 'none' } }}>{item.label[0].toUpperCase()}</Box>
                  </Typography>
                );
              })}
            </Box>
          ))}
        </Box>

        {/* Footer: theme toggle, view site, email, sign out */}
        <Box sx={{ borderTop: '1px solid', borderColor: 'divider', px: { xs: 1, md: 2 }, py: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'} placement="right">
            <IconButton size="small" onClick={toggleMode} sx={{ color: 'text.secondary', alignSelf: { xs: 'center', md: 'flex-start' } }}>
              {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          <Typography
            component="a"
            href="/"
            sx={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '0.62rem',
              color: 'text.disabled',
              textDecoration: 'none',
              letterSpacing: '0.04em',
              transition: 'color 0.2s',
              textAlign: { xs: 'center', md: 'left' },
              '&:hover': { color: '#38bdf8' },
            }}
          >
            <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>↗ site</Box>
            <Box component="span" sx={{ display: { xs: 'inline', md: 'none' } }}>↗</Box>
          </Typography>

          <Typography
            sx={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '0.58rem',
              color: 'text.disabled',
              letterSpacing: '0.03em',
              display: { xs: 'none', md: 'block' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {session.user?.email}
          </Typography>

          <Box
            onClick={() => signOut({ callbackUrl: '/' })}
            sx={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '0.62rem',
              color: 'text.disabled',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              transition: 'color 0.2s',
              textAlign: { xs: 'center', md: 'left' },
              '&:hover': { color: '#f87171' },
            }}
          >
            <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>sign_out()</Box>
            <Box component="span" sx={{ display: { xs: 'inline', md: 'none' } }}>⏻</Box>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, ml: { xs: `${SIDEBAR_WIDTH_COLLAPSED}px`, md: `${SIDEBAR_WIDTH}px` } }}>
        {children}
      </Box>
    </Box>
  );
}
