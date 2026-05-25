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
        backgroundColor: '#111111',
        py: 4,
        borderTop: '1px solid rgba(255,255,255,0.06)',
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
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: '0.9rem',
              letterSpacing: '0.15em',
              color: 'rgba(250,250,248,0.3)',
              textTransform: 'uppercase',
            }}
          >
            Pimuk
          </Typography>

          <Typography variant="caption" sx={{ color: 'rgba(250,250,248,0.2)' }}>
            © {new Date().getFullYear()} Pimuk Artharnnarong. All rights reserved.
          </Typography>

          <Typography variant="caption" sx={{ color: 'rgba(250,250,248,0.2)' }}>
            Bangkok, Thailand
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
