'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { keyframes } from '@mui/system';
import { useThemeMode } from '../ThemeContext';

const fadeSlideIn = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const spinIn = keyframes`
  from { transform: rotate(-90deg) scale(0.7); opacity: 0; }
  to   { transform: rotate(0deg) scale(1); opacity: 1; }
`;

const anchorLinks = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Stack', href: '#tech-stack' },
  { label: 'Education', href: '#education' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

const pageLinks = [
  { label: 'Games', href: '/games' },
  { label: 'Guide', href: '/guides/dev-setup' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const { mode, toggleMode } = useThemeMode();
  const { data: session } = useSession();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (!href.startsWith('#')) return;
    setMenuOpen(false);
    if (!isHome) return;
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const resolveHref = (href: string) => (href.startsWith('#') && !isHome ? `/${href}` : href);

  return (
    <Box
      ref={menuRef}
      sx={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1300,
        width: 'auto',
      }}
    >
      {/* Pill */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2.5,
          py: 1,
          borderRadius: '100px',
          backgroundColor: 'rgba(15,23,42,0.88)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: scrolled
            ? '0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.12)'
            : '0 4px 16px rgba(0,0,0,0.1)',
          transition: 'box-shadow 0.35s cubic-bezier(0.4,0,0.2,1)',
          gap: 2,
        }}
      >
        {/* Logo */}
        <Typography
          component="a"
          href="/"
          onClick={(e) => {
            if (!isHome) return;
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          sx={{
            textDecoration: 'none',
            color: '#e2f3ff',
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '0.7rem',
            letterSpacing: '0.06em',
            flexShrink: 0,
            '&:hover': { color: '#7dd3fc' },
            transition: 'color 0.2s',
          }}
        >
          ~/pimuk
        </Typography>

        {/* Divider */}
        <Box sx={{ width: '1px', height: 12, backgroundColor: 'rgba(255,255,255,0.12)', flexShrink: 0 }} />

        {/* Anchor links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2.5 }}>
          {anchorLinks.map((link) => (
            <Typography
              key={link.label}
              component="a"
              href={resolveHref(link.href)}
              onClick={(e) => handleNavClick(e, link.href)}
              sx={{
                textDecoration: 'none',
                color: 'rgba(255,255,255,0.55)',
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '0.68rem',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'color 0.2s',
                '&:hover': { color: '#7dd3fc' },
              }}
            >
              {link.label}
            </Typography>
          ))}
        </Box>

        {/* Divider */}
        <Box sx={{ width: '1px', height: 12, backgroundColor: 'rgba(255,255,255,0.12)', flexShrink: 0 }} />

        {/* Theme toggle */}
        <Box
          onClick={toggleMode}
          title={mode === 'dark' ? 'Light mode' : 'Dark mode'}
          sx={{
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.8rem',
            lineHeight: 1,
            flexShrink: 0,
            transition: 'color 0.2s',
            '&:hover': { color: '#7dd3fc' },
          }}
        >
          <Box
            key={mode}
            component="span"
            sx={{
              display: 'inline-block',
              animation: `${spinIn} 0.35s cubic-bezier(0.34,1.56,0.64,1) both`,
            }}
          >
            {mode === 'dark' ? '☀' : '◐'}
          </Box>
        </Box>

        {/* Login / User */}
        {session ? (
          <Box ref={userMenuRef} sx={{ position: 'relative', flexShrink: 0 }}>
            <Typography
              onClick={() => setUserMenuOpen((v) => !v)}
              sx={{
                cursor: 'pointer',
                color: '#7dd3fc',
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '0.65rem',
                letterSpacing: '0.06em',
                transition: 'color 0.2s',
                '&:hover': { color: '#e2f3ff' },
              }}
            >
              {session.user?.name ?? session.user?.email}
            </Typography>
            {/* User dropdown */}
            <Box
              sx={{
                position: 'absolute',
                top: 'calc(100% + 12px)',
                right: 0,
                minWidth: 140,
                borderRadius: '12px',
                backgroundColor: 'rgba(15,23,42,0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.24)',
                overflow: 'hidden',
                opacity: userMenuOpen ? 1 : 0,
                pointerEvents: userMenuOpen ? 'auto' : 'none',
                transform: userMenuOpen ? 'translateY(0)' : 'translateY(-6px)',
                transition: 'opacity 0.18s, transform 0.18s cubic-bezier(0.4,0,0.2,1)',
                p: 0.75,
              }}
            >
              <Box
                component="a"
                href="/admin"
                onClick={() => setUserMenuOpen(false)}
                sx={{
                  display: 'block', px: 2, py: 0.875, borderRadius: '8px',
                  textDecoration: 'none', color: 'rgba(255,255,255,0.45)',
                  fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.65rem',
                  letterSpacing: '0.04em', transition: 'color 0.15s, background-color 0.15s',
                  '&:hover': { color: '#7dd3fc', backgroundColor: 'rgba(125,211,252,0.08)' },
                }}
              >
                ~/admin
              </Box>
              <Box sx={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', mx: 1, my: 0.5 }} />
              <Box
                onClick={() => { setUserMenuOpen(false); setConfirmLogout(true); }}
                sx={{
                  display: 'block', px: 2, py: 0.875, borderRadius: '8px',
                  cursor: 'pointer', color: 'rgba(248,113,113,0.6)',
                  fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.65rem',
                  letterSpacing: '0.04em', transition: 'color 0.15s, background-color 0.15s',
                  '&:hover': { color: '#f87171', backgroundColor: 'rgba(248,113,113,0.08)' },
                }}
              >
                sign_out()
              </Box>
            </Box>
          </Box>
        ) : (
          <Typography
            component="a"
            href="/admin"
            sx={{
              textDecoration: 'none',
              color: 'rgba(255,255,255,0.3)',
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.06em',
              flexShrink: 0,
              transition: 'color 0.2s',
              '&:hover': { color: '#7dd3fc' },
            }}
          >
            _login
          </Typography>
        )}

        {/* Hamburger */}
        <IconButton
          onClick={() => setMenuOpen((v) => !v)}
          size="small"
          sx={{
            color: menuOpen ? '#7dd3fc' : 'rgba(255,255,255,0.6)',
            p: 0.5,
            '&:hover': { color: '#7dd3fc' },
            transition: 'color 0.2s',
          }}
          aria-label="Toggle menu"
        >
          <Box
            key={menuOpen ? 'close' : 'menu'}
            sx={{ display: 'flex', animation: `${spinIn} 0.2s ease both` }}
          >
            {menuOpen ? <CloseIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
          </Box>
        </IconButton>
      </Box>

      {/* Logout confirm dialog */}
      <Dialog
        open={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: 'rgba(15,23,42,0.97)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
              minWidth: 280,
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '0.8rem',
            color: '#e2f3ff',
            letterSpacing: '0.04em',
            pb: 1,
          }}
        >
          sign_out() ?
        </DialogTitle>
        <DialogActions sx={{ px: 2.5, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setConfirmLogout(false)}
            size="small"
            sx={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '0.65rem',
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.06em',
              '&:hover': { color: '#e2f3ff' },
            }}
          >
            cancel
          </Button>
          <Button
            onClick={() => { setConfirmLogout(false); signOut({ callbackUrl: '/' }); }}
            size="small"
            sx={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '0.65rem',
              color: '#f87171',
              letterSpacing: '0.06em',
              '&:hover': { color: '#fca5a5', backgroundColor: 'rgba(248,113,113,0.1)' },
            }}
          >
            confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dropdown */}
      <Box
        sx={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          minWidth: 200,
          borderRadius: '16px',
          backgroundColor: 'rgba(15,23,42,0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.24)',
          overflow: 'hidden',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transform: menuOpen ? 'translateY(0)' : 'translateY(-8px)',
          transition: 'opacity 0.2s, transform 0.2s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Page links + login */}
        <Box sx={{ p: 1 }}>
          {pageLinks.map((link, i) => {
            const isActive = pathname === link.href;
            return (
              <Box
                key={link.label}
                component="a"
                href={link.href}
                onClick={() => setMenuOpen(false)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 2,
                  py: 1,
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: isActive ? '#7dd3fc' : 'rgba(255,255,255,0.4)',
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: '0.68rem',
                  letterSpacing: '0.04em',
                  transition: 'color 0.15s, background-color 0.15s',
                  animation: menuOpen ? `${fadeSlideIn} 0.22s ease both` : 'none',
                  animationDelay: menuOpen ? `${i * 35}ms` : '0ms',
                  '&:hover': {
                    color: '#7dd3fc',
                    backgroundColor: 'rgba(125,211,252,0.08)',
                  },
                }}
              >
                {link.label}
                {!isActive && <Box component="span" sx={{ fontSize: '0.55rem', opacity: 0.5 }}>↗</Box>}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
