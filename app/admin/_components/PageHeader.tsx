'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export default function PageHeader({
  title,
  caption,
  action,
}: {
  title: string;
  caption?: string;
  action?: ReactNode;
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mb: 6, flexWrap: 'wrap', gap: 2 }}>
      <Box>
        <Typography sx={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.65rem', color: '#38bdf8', mb: 1, letterSpacing: '0.05em' }}>
          // {caption ?? title.toLowerCase()}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 300 }}>{title}</Typography>
      </Box>
      {action}
    </Box>
  );
}
