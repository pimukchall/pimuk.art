'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useMemo } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeContextProvider, useThemeMode } from './ThemeContext';
import { buildTheme } from './theme';

function MuiThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeMode();
  const theme = useMemo(() => buildTheme(mode), [mode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <ThemeContextProvider>
          <MuiThemeProvider>{children}</MuiThemeProvider>
        </ThemeContextProvider>
      </AppRouterCacheProvider>
    </SessionProvider>
  );
}
