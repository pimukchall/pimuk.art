'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

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
          backgroundColor: scrolled ? 'rgba(250,250,248,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid' : '1px solid',
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
              fontFamily: '"Noto Sans Thai", var(--font-geist-sans), system-ui, sans-serif',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            Pimuk
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
                  '&:hover': { color: 'secondary.main' },
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Box>

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
          variant="h6"
          sx={{ mb: 4, fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1rem', letterSpacing: '0.2em' }}
        >
          Pimuk
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
                '&:hover': { color: 'secondary.main' },
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
