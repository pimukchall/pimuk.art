'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';

export default function HeroSection() {
  return (
    <Box
      component="section"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 10, md: 0 },
      }}
    >
      {/* Decorative vertical line */}
      <Box
        sx={{
          position: 'absolute',
          left: { xs: 32, md: 80 },
          top: 0,
          bottom: 0,
          width: '1px',
          backgroundColor: 'divider',
          display: { xs: 'none', lg: 'block' },
        }}
      />

      {/* Decorative number */}
      <Typography
        sx={{
          position: 'absolute',
          top: { xs: 100, md: '50%' },
          right: { xs: 32, md: 80 },
          transform: { md: 'translateY(-50%)' },
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontSize: { xs: '8rem', md: '16rem' },
          fontWeight: 300,
          color: 'rgba(201,169,110,0.06)',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        01
      </Typography>

      <Container maxWidth="xl" sx={{ px: { xs: 4, md: 10 } }}>
        <Grid container spacing={4} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Box>
              {/* Eyebrow */}
              <Typography
                variant="h6"
                sx={{
                  color: 'secondary.main',
                  mb: { xs: 3, md: 4 },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  '&::before': {
                    content: '""',
                    display: 'block',
                    width: 40,
                    height: '1px',
                    backgroundColor: 'secondary.main',
                  },
                }}
              >
                Creative Portfolio
              </Typography>

              {/* Main heading */}
              <Typography
                variant="h1"
                sx={{
                  mb: { xs: 3, md: 4 },
                  fontSize: { xs: '3rem', sm: '4rem', md: '5.5rem', lg: '7rem' },
                }}
              >
                Art &amp;{' '}
                <Box
                  component="span"
                  sx={{
                    fontStyle: 'italic',
                    color: 'secondary.main',
                  }}
                >
                  Design
                </Box>
                <br />
                with Purpose
              </Typography>

              {/* Subtext */}
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  maxWidth: 480,
                  mb: { xs: 5, md: 7 },
                  fontSize: { xs: '0.9375rem', md: '1.0625rem' },
                }}
              >
                I create visual experiences that bridge aesthetics and meaning —
                from brand identities to digital interfaces. Based in Bangkok,
                working worldwide.
              </Typography>

              {/* CTAs */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  href="#work"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  sx={{ alignSelf: { xs: 'flex-start' } }}
                >
                  View My Work
                </Button>
                <Button
                  variant="outlined"
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  sx={{ alignSelf: { xs: 'flex-start' } }}
                >
                  Get in Touch
                </Button>
              </Stack>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            {/* Stats */}
            <Box
              sx={{
                display: { xs: 'flex', md: 'block' },
                gap: 4,
                mt: { xs: 6, md: 0 },
              }}
            >
              {[
                { number: '7+', label: 'Years Experience' },
                { number: '80+', label: 'Projects Delivered' },
                { number: '30+', label: 'Happy Clients' },
              ].map((stat) => (
                <Box
                  key={stat.label}
                  sx={{
                    mb: { xs: 0, md: 5 },
                    pl: { md: 4 },
                    borderLeft: { md: '1px solid' },
                    borderColor: { md: 'divider' },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"Cormorant Garamond", Georgia, serif',
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      fontWeight: 300,
                      color: 'text.primary',
                      lineHeight: 1,
                      mb: 0.5,
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Scroll indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Scroll
        </Typography>
        <Box
          sx={{
            width: '1px',
            height: 48,
            backgroundColor: 'divider',
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '50%',
              backgroundColor: 'secondary.main',
              animation: 'scrollLine 1.5s ease-in-out infinite',
            },
            '@keyframes scrollLine': {
              '0%': { transform: 'translateY(-100%)' },
              '100%': { transform: 'translateY(200%)' },
            },
          }}
        />
      </Box>
    </Box>
  );
}
