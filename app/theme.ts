'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      main: '#1a1a1a',
      light: '#3d3d3d',
      dark: '#000000',
    },
    secondary: {
      main: '#c9a96e',
      light: '#e8c99e',
      dark: '#a07840',
    },
    background: {
      default: '#fafaf8',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#6b6b6b',
    },
    divider: '#e8e4df',
  },
  typography: {
    fontFamily: '"Cormorant Garamond", Georgia, serif',
    h1: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 300,
      fontSize: '5rem',
      letterSpacing: '-0.02em',
      lineHeight: 1.05,
    },
    h2: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 300,
      fontSize: '3rem',
      letterSpacing: '-0.01em',
      lineHeight: 1.15,
    },
    h3: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 400,
      fontSize: '1.75rem',
      letterSpacing: '0.01em',
    },
    h4: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 500,
      fontSize: '1.25rem',
      letterSpacing: '0.05em',
    },
    h5: {
      fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
    },
    h6: {
      fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
      fontWeight: 500,
      fontSize: '0.75rem',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
    },
    body1: {
      fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
      fontWeight: 400,
      fontSize: '0.9375rem',
      lineHeight: 1.75,
      letterSpacing: '0.01em',
    },
    body2: {
      fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
      fontWeight: 400,
      fontSize: '0.8125rem',
      lineHeight: 1.6,
      letterSpacing: '0.02em',
    },
    caption: {
      fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
      fontSize: '0.6875rem',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
    },
    button: {
      fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
      fontWeight: 400,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 0,
  },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*, *::before, *::after': {
          boxSizing: 'border-box',
        },
        html: {
          scrollBehavior: 'smooth',
        },
        '::selection': {
          backgroundColor: '#c9a96e',
          color: '#ffffff',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: '12px 32px',
          fontSize: '0.6875rem',
          letterSpacing: '0.15em',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#333333',
          },
        },
        outlined: {
          borderColor: '#1a1a1a',
          color: '#1a1a1a',
          borderWidth: '1px',
          '&:hover': {
            borderWidth: '1px',
            backgroundColor: 'transparent',
            borderColor: '#c9a96e',
            color: '#c9a96e',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
          fontSize: '0.625rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fontWeight: 500,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#e8e4df',
        },
      },
    },
  },
});

export default theme;
