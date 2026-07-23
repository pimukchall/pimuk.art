'use client';

import { createTheme } from '@mui/material/styles';

export function buildTheme(mode: 'dark' | 'light') {
  const isDark = mode === 'dark';

  return createTheme({
    cssVariables: true,
    palette: {
      mode,
      primary: {
        main: isDark ? '#e2f3ff' : '#0f172a',
      },
      secondary: {
        main: '#38bdf8',
        light: '#7dd3fc',
        dark: '#0ea5e9',
      },
      background: {
        default: isDark ? '#05080f' : '#f8fafc',
        paper: isDark ? 'rgba(14,22,38,0.8)' : '#ffffff',
      },
      text: {
        primary: isDark ? '#e2f3ff' : '#0f172a',
        secondary: isDark ? '#64a5c8' : '#64748b',
      },
      divider: isDark ? 'rgba(125,211,252,0.1)' : '#e2e8f0',
    },
    typography: {
      fontFamily: 'var(--font-geist-mono), "Courier New", monospace',
      h1: {
        fontFamily: 'var(--font-geist-mono), "Courier New", monospace',
        fontWeight: 300,
        fontSize: '5rem',
        letterSpacing: '-0.03em',
        lineHeight: 1.05,
      },
      h2: {
        fontFamily: 'var(--font-geist-mono), "Courier New", monospace',
        fontWeight: 300,
        fontSize: '3rem',
        letterSpacing: '-0.02em',
        lineHeight: 1.15,
      },
      h3: {
        fontFamily: 'var(--font-geist-mono), "Courier New", monospace',
        fontWeight: 400,
        fontSize: '1.75rem',
        letterSpacing: '-0.01em',
      },
      h4: {
        fontFamily: 'var(--font-geist-mono), "Courier New", monospace',
        fontWeight: 400,
        fontSize: '1.25rem',
      },
      h5: {
        fontFamily: '"Noto Sans Thai", var(--font-geist-sans), system-ui, sans-serif',
        fontWeight: 400,
        fontSize: '1rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      },
      h6: {
        fontFamily: 'var(--font-geist-mono), "Courier New", monospace',
        fontWeight: 400,
        fontSize: '0.75rem',
        letterSpacing: '0.08em',
      },
      body1: {
        fontFamily: '"Noto Sans Thai", var(--font-geist-sans), system-ui, sans-serif',
        fontWeight: 400,
        fontSize: '0.9375rem',
        lineHeight: 1.75,
        letterSpacing: '0.01em',
      },
      body2: {
        fontFamily: '"Noto Sans Thai", var(--font-geist-sans), system-ui, sans-serif',
        fontWeight: 400,
        fontSize: '0.8125rem',
        lineHeight: 1.6,
        letterSpacing: '0.02em',
      },
      caption: {
        fontFamily: 'var(--font-geist-mono), "Courier New", monospace',
        fontSize: '0.6875rem',
        letterSpacing: '0.08em',
      },
      button: {
        fontFamily: 'var(--font-geist-mono), "Courier New", monospace',
        fontWeight: 400,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      },
    },
    shape: { borderRadius: 0 },
    spacing: 8,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*, *::before, *::after': { boxSizing: 'border-box' },
          html: { scrollBehavior: 'smooth' },
          '::selection': {
            backgroundColor: '#38bdf8',
            color: '#ffffff',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: isDark ? {
            background: 'rgba(14,22,38,0.6)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(125,211,252,0.08)',
          } : {
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            padding: '12px 32px',
            fontSize: '0.6875rem',
            letterSpacing: '0.1em',
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          },
          contained: {
            backgroundColor: '#38bdf8',
            color: '#ffffff',
            '&:hover': { backgroundColor: '#0ea5e9' },
          },
          outlined: {
            borderColor: isDark ? 'rgba(125,211,252,0.2)' : '#e2e8f0',
            color: isDark ? '#e2f3ff' : '#0f172a',
            borderWidth: '1px',
            '&:hover': {
              borderWidth: '1px',
              backgroundColor: 'transparent',
              borderColor: '#38bdf8',
              color: '#38bdf8',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '0.625rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontWeight: 400,
            backgroundColor: isDark ? 'rgba(125,211,252,0.06)' : '#f1f5f9',
            color: isDark ? '#64a5c8' : '#64748b',
            border: `1px solid ${isDark ? 'rgba(125,211,252,0.15)' : '#e2e8f0'}`,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: isDark ? 'rgba(125,211,252,0.1)' : '#e2e8f0' },
        },
      },
    },
  });
}
