'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
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
  const { mode, toggleMode } = useThemeMode();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const menuRef = useRef<HTMLDivElement>(null);

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
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

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
          <Box
            component="a"
            href="/admin"
            onClick={() => setMenuOpen(false)}
            sx={{
              display: 'block',
              px: 2,
              py: 1,
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'rgba(255,255,255,0.2)',
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.06em',
              transition: 'color 0.15s, background-color 0.15s',
              animation: menuOpen ? `${fadeSlideIn} 0.22s ease both` : 'none',
              animationDelay: menuOpen ? `${pageLinks.length * 35}ms` : '0ms',
              '&:hover': { color: '#7dd3fc', backgroundColor: 'rgba(125,211,252,0.08)' },
            }}
          >
            _login
          </Box>

          {/* Divider */}
          <Box sx={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', mx: 1, my: 0.5 }} />

          {/* Theme toggle */}
          <Box
            onClick={() => { toggleMode(); setMenuOpen(false); }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2,
              py: 1,
              borderRadius: '8px',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.35)',
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.04em',
              transition: 'color 0.15s, background-color 0.15s',
              animation: menuOpen ? `${fadeSlideIn} 0.22s ease both` : 'none',
              animationDelay: menuOpen ? `${(pageLinks.length + 1) * 35}ms` : '0ms',
              '&:hover': { color: '#7dd3fc', backgroundColor: 'rgba(125,211,252,0.08)' },
            }}
          >
            <Box component="span">{mode === 'dark' ? '☀' : '◐'}</Box>
            {mode === 'dark' ? 'light mode' : 'dark mode'}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
