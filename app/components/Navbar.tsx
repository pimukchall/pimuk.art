'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useThemeMode } from '../ThemeContext';

const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Stack', href: '#tech-stack' },
  { label: 'Education', href: '#education' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
  { label: 'Setup Guide', href: '/guides/dev-setup' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { mode, toggleMode } = useThemeMode();
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (!href.startsWith('#')) return;
    setDrawerOpen(false);
    if (!isHome) return;
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const resolveHref = (href: string) => (href.startsWith('#') && !isHome ? `/${href}` : href);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: scrolled ? 'rgba(10,10,10,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: '1px solid',
          borderColor: scrolled ? 'divider' : 'transparent',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          color: 'text.primary',
        }}
      >
        <Toolbar
          sx={{
            maxWidth: 1280,
            mx: 'auto',
            width: '100%',
            px: { xs: 3, md: 6 },
            py: 2,
            minHeight: { xs: 64, md: 72 },
          }}
        >
          {/* Logo */}
          <Typography
            variant="h6"
            component="a"
            href="/"
            onClick={(e) => {
              if (!isHome) return;
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'text.primary',
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '0.75rem',
              fontWeight: 400,
              letterSpacing: '0.05em',
            }}
          >
            ~/pimuk
          </Typography>

          {/* Desktop Nav */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 5, alignItems: 'center' }}>
            {navLinks.map((link) => (
              <Typography
                key={link.label}
                component="a"
                href={resolveHref(link.href)}
                onClick={(e) => handleNavClick(e, link.href)}
                variant="caption"
                sx={{
                  textDecoration: 'none',
                  color: 'text.secondary',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  '&:hover': { color: '#4ade80' },
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Box>

          {/* Theme toggle */}
          <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'} placement="bottom">
            <IconButton
              onClick={toggleMode}
              aria-label="Toggle theme"
              size="small"
              sx={{
                ml: { xs: 1, md: 3 },
                color: 'text.secondary',
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '0.65rem',
                borderRadius: 0,
                px: 1,
                py: 0.5,
                border: '1px solid',
                borderColor: 'divider',
                gap: 0.75,
                '&:hover': { borderColor: '#4ade80', color: '#4ade80' },
                transition: 'all 0.2s',
              }}
            >
              {mode === 'dark' ? '☀' : '◐'}
              <Box
                component="span"
                sx={{ display: { xs: 'none', md: 'inline' }, fontSize: '0.6rem', letterSpacing: '0.05em' }}
              >
                {mode === 'dark' ? 'light' : 'dark'}
              </Box>
            </IconButton>
          </Tooltip>

          {/* Mobile menu */}
          <IconButton
            sx={{ display: { xs: 'flex', md: 'none' }, ml: 1 }}
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              backgroundColor: 'background.default',
              px: 4,
              py: 4,
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography
          sx={{ mb: 4, fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.8rem', letterSpacing: '0.05em', color: 'text.primary' }}
        >
          ~/pimuk.art
        </Typography>

        <Divider sx={{ mb: 4 }} />

        <Stack spacing={3}>
          {navLinks.map((link) => (
            <Typography
              key={link.label}
              component="a"
              href={resolveHref(link.href)}
              onClick={(e) => handleNavClick(e, link.href)}
              variant="caption"
              sx={{
                textDecoration: 'none',
                color: 'text.primary',
                cursor: 'pointer',
                fontSize: '0.8rem',
                letterSpacing: '0.15em',
                display: 'block',
                py: 0.5,
                transition: 'color 0.2s',
                '&:hover': { color: '#4ade80' },
              }}
            >
              {link.label}
            </Typography>
          ))}
        </Stack>
      </Drawer>
    </>
  );
}
