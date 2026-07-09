'use client';

import { createTheme } from '@mui/material/styles';

export function buildTheme(mode: 'dark' | 'light') {
  const isDark = mode === 'dark';

  return createTheme({
    cssVariables: true,
    palette: {
      mode,
      primary: {
        main: isDark ? '#f0f0f0' : '#0a0a0a',
      },
      secondary: {
        main: '#4ade80',
        light: '#86efac',
        dark: '#22c55e',
      },
      background: {
        default: isDark ? '#0a0a0a' : '#f5f5f5',
        paper: isDark ? '#111111' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f0f0f0' : '#0a0a0a',
        secondary: isDark ? '#666666' : '#777777',
      },
      divider: isDark ? '#222222' : '#e0e0e0',
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
            backgroundColor: '#4ade80',
            color: isDark ? '#0a0a0a' : '#ffffff',
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
            backgroundColor: '#4ade80',
            color: '#0a0a0a',
            '&:hover': { backgroundColor: '#86efac' },
          },
          outlined: {
            borderColor: isDark ? '#333333' : '#cccccc',
            color: isDark ? '#f0f0f0' : '#0a0a0a',
            borderWidth: '1px',
            '&:hover': {
              borderWidth: '1px',
              backgroundColor: 'transparent',
              borderColor: '#4ade80',
              color: '#4ade80',
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
            backgroundColor: isDark ? '#1a1a1a' : '#ebebeb',
            color: isDark ? '#666666' : '#888888',
            border: `1px solid ${isDark ? '#222' : '#ddd'}`,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: isDark ? '#222222' : '#e0e0e0' },
        },
      },
    },
  });
}
