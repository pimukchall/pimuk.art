'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.default',
        py: 4,
        borderTop: '1px solid', borderTopColor: 'divider',
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 4, md: 10 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '0.7rem',
              letterSpacing: '0.05em',
              color: '#64748b',
            }}
          >
            ~/pimuk.art
          </Typography>

          <Typography
            sx={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '0.65rem',
              color: '#64748b',
            }}
          >
            © {new Date().getFullYear()} Pimuk Artharnnarong
          </Typography>

          <Typography
            sx={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '0.65rem',
              color: '#64748b',
            }}
          >
            Nonthaburi, TH
          </Typography>


        </Box>
      </Container>
    </Box>
  );
}
