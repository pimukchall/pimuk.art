'use client';

import Box from '@mui/material/Box';
import type { ReactNode } from 'react';

export default function AdminCard({
  children,
  faded,
  sx,
}: {
  children: ReactNode;
  faded?: boolean;
  sx?: object;
}) {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        p: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        opacity: faded ? 0.5 : 1,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
