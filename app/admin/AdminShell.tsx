'use client';

import { type Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MenuIcon from '@mui/icons-material/Menu';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutlineOutlined';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import DevicesOutlinedIcon from '@mui/icons-material/DevicesOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import type { ReactNode, ComponentType } from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import { useState } from 'react';
import { useThemeMode } from '@/app/ThemeContext';

const SIDEBAR_WIDTH = 200;

const navGroups: { label: string | null; items: { label: string; href: string; icon: ComponentType<SvgIconProps> }[] }[] = [
  {
    label: null,
    items: [{ label: 'dashboard', href: '/admin', icon: SpaceDashboardOutlinedIcon }],
  },
  {
    label: 'content',
    items: [
      { label: 'contacts', href: '/admin/contacts', icon: ContactsOutlinedIcon },
      { label: 'projects', href: '/admin/projects', icon: WorkOutlineIcon },
      { label: 'games', href: '/admin/games', icon: SportsEsportsOutlinedIcon },
    ],
  },
  {
    label: 'planning',
    items: [
      { label: 'tasks', href: '/admin/tasks', icon: ChecklistOutlinedIcon },
      { label: 'calendar', href: '/admin/calendar', icon: CalendarMonthOutlinedIcon },
      { label: 'timeline', href: '/admin/timeline', icon: TimelineOutlinedIcon },
    ],
  },
  {
    label: 'finance',
    items: [
      { label: 'assets', href: '/admin/assets', icon: AccountBalanceWalletOutlinedIcon },
      { label: 'transactions', href: '/admin/transactions', icon: ReceiptLongOutlinedIcon },
    ],
  },
  {
    label: 'it',
    items: [
      { label: 'it-assets', href: '/admin/it-assets', icon: DevicesOutlinedIcon },
      { label: 'licenses', href: '/admin/licenses', icon: VpnKeyOutlinedIcon },
    ],
  },
  {
    label: 'system',
    items: [
      { label: 'users', href: '/admin/users', icon: PeopleOutlinedIcon },
      { label: 'audit-log', href: '/admin/audit-log', icon: HistoryOutlinedIcon },
    ],
  },
];

export default function AdminShell({ children, session }: { children: ReactNode; session: Session }) {
  const pathname = usePathname();
  const { mode, toggleMode } = useThemeMode();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (isMobile: boolean) => (
    <>
      {/* Logo */}
      <Box sx={{ px: isMobile ? 2.5 : { xs: 1.5, md: 2.5 }, py: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography
          component={Link}
          href="/admin"
          onClick={() => setMobileOpen(false)}
          sx={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '0.7rem',
            color: '#38bdf8',
            textDecoration: 'none',
            letterSpacing: '0.05em',
            display: isMobile ? 'block' : { xs: 'none', md: 'block' },
            textAlign: isMobile ? 'left' : undefined,
          }}
        >
          ~/admin
        </Typography>
        {!isMobile && (
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
        )}
      </Box>

      {/* Nav items */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 1.5 }}>
        {navGroups.map((group, gi) => (
          <Box key={group.label ?? `group-${gi}`} sx={{ mb: 1 }}>
            {group.label && (
              <Typography
                sx={{
                  display: isMobile ? 'block' : { xs: 'none', md: 'block' },
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
              const Icon = item.icon;
              return (
                <Typography
                  key={item.href}
                  component={Link}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    fontFamily: 'var(--font-geist-mono), monospace',
                    fontSize: '0.7rem',
                    color: isActive ? '#38bdf8' : 'text.secondary',
                    textDecoration: 'none',
                    letterSpacing: '0.04em',
                    px: isMobile ? 2.5 : { xs: 1.5, md: 2.5 },
                    py: 1.2,
                    borderLeft: '2px solid',
                    borderColor: isActive ? '#38bdf8' : 'transparent',
                    backgroundColor: isActive ? 'action.hover' : 'transparent',
                    transition: 'color 0.15s, border-color 0.15s',
                    justifyContent: isMobile ? 'flex-start' : { xs: 'center', md: 'flex-start' },
                    '&:hover': { color: '#38bdf8' },
                  }}
                >
                  <Icon sx={{ fontSize: '1.05rem', flexShrink: 0 }} />
                  <Box
                    component="span"
                    sx={{ display: isMobile ? 'inline' : { xs: 'none', md: 'inline' } }}
                  >
                    {item.label}
                  </Box>
                </Typography>
              );
            })}
          </Box>
        ))}
      </Box>

      {/* Footer: theme toggle, view site, email, sign out */}
      <Box sx={{ borderTop: '1px solid', borderColor: 'divider', px: isMobile ? 2 : { xs: 1, md: 2 }, py: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'} placement="right">
          <IconButton size="small" onClick={toggleMode} sx={{ color: 'text.secondary', alignSelf: isMobile ? 'flex-start' : { xs: 'center', md: 'flex-start' } }}>
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
            textAlign: isMobile ? 'left' : { xs: 'center', md: 'left' },
            '&:hover': { color: '#38bdf8' },
          }}
        >
          <Box component="span" sx={{ display: isMobile ? 'inline' : { xs: 'none', md: 'inline' } }}>↗ site</Box>
          {!isMobile && <Box component="span" sx={{ display: { xs: 'inline', md: 'none' } }}>↗</Box>}
        </Typography>

        <Typography
          sx={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '0.58rem',
            color: 'text.disabled',
            letterSpacing: '0.03em',
            display: isMobile ? 'block' : { xs: 'none', md: 'block' },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {session.user?.email}
        </Typography>

        <Box
          onClick={() => {
            setMobileOpen(false);
            signOut({ callbackUrl: '/' });
          }}
          sx={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '0.62rem',
            color: 'text.disabled',
            letterSpacing: '0.04em',
            cursor: 'pointer',
            transition: 'color 0.2s',
            textAlign: isMobile ? 'left' : { xs: 'center', md: 'left' },
            '&:hover': { color: '#f87171' },
          }}
        >
          <Box component="span" sx={{ display: isMobile ? 'inline' : { xs: 'none', md: 'inline' } }}>sign_out()</Box>
          {!isMobile && <Box component="span" sx={{ display: { xs: 'inline', md: 'none' } }}>⏻</Box>}
        </Box>
      </Box>
    </>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', display: 'flex' }}>
      {/* Mobile top bar with hamburger toggle */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 48,
          alignItems: 'center',
          px: 1,
          gap: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.default',
          zIndex: 1301,
        }}
      >
        <IconButton size="small" onClick={() => setMobileOpen(true)} sx={{ color: 'text.secondary' }} aria-label="open menu">
          <MenuIcon fontSize="small" />
        </IconButton>
        <Typography
          component={Link}
          href="/admin"
          sx={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '0.7rem',
            color: '#38bdf8',
            textDecoration: 'none',
            letterSpacing: '0.05em',
          }}
        >
          ~/admin
        </Typography>
      </Box>

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {sidebarContent(true)}
      </Drawer>

      {/* Desktop sidebar */}
      <Box
        component="nav"
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          borderRight: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.default',
          flexDirection: 'column',
          zIndex: 1300,
        }}
      >
        {sidebarContent(false)}
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, mt: { xs: '48px', md: 0 }, ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` } }}>
        {children}
      </Box>
    </Box>
  );
}
