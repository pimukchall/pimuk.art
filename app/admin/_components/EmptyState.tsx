'use client';

import Typography from '@mui/material/Typography';

export default function EmptyState({ message }: { message: string }) {
  return (
    <Typography
      sx={{
        fontFamily: 'var(--font-geist-mono), monospace',
        fontSize: '0.75rem',
        color: 'text.disabled',
        py: 8,
        textAlign: 'center',
      }}
    >
      {message}
    </Typography>
  );
}
