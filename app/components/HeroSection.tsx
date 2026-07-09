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
      {/* Terminal grid overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
        }}
      />

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

      {/* Big background glyph */}
      <Typography
        sx={{
          position: 'absolute',
          top: { xs: 100, md: '50%' },
          right: { xs: 16, md: 80 },
          transform: { md: 'translateY(-50%)' },
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: { xs: '8rem', md: '18rem' },
          fontWeight: 100,
          color: 'rgba(74,222,128,0.04)',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          letterSpacing: '-0.05em',
        }}
      >
        &gt;_
      </Typography>

      <Container maxWidth="xl" sx={{ px: { xs: 4, md: 10 } }}>
        <Grid container spacing={4} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Box>
              {/* Terminal prompt eyebrow */}
              <Typography
                sx={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: '0.75rem',
                  color: '#4ade80',
                  mb: { xs: 3, md: 4 },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  letterSpacing: '0.05em',
                }}
              >
                <Box component="span" sx={{ color: '#333' }}>~/</Box>
                pimuk.art
                <Box component="span" sx={{ color: '#444' }}>$</Box>
                <Box
                  component="span"
                  sx={{
                    color: '#f0f0f0',
                    '&::after': {
                      content: '"▋"',
                      animation: 'blink 1s step-end infinite',
                      color: '#4ade80',
                      ml: 0.5,
                    },
                    '@keyframes blink': {
                      '0%, 100%': { opacity: 1 },
                      '50%': { opacity: 0 },
                    },
                  }}
                >
                  whoami
                </Box>
              </Typography>

              {/* Main heading */}
              <Typography
                variant="h1"
                sx={{
                  mb: { xs: 3, md: 4 },
                  fontSize: { xs: '2.5rem', sm: '3.25rem', md: '4.5rem', lg: '5.5rem' },
                  color: 'text.primary',
                  lineHeight: 1.08,
                }}
              >
                Full-Stack{' '}
                <Box component="span" sx={{ color: '#4ade80' }}>
                  Dev
                </Box>
                {' '}+
                <br />
                Enterprise{' '}
                <Box component="span" sx={{ color: 'text.secondary', fontWeight: 100 }}>
                  Architect
                </Box>
              </Typography>

              {/* Subtext */}
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  maxWidth: 520,
                  mb: { xs: 5, md: 7 },
                }}
              >
                ออกแบบและพัฒนาระบบ ERP &amp; ISO Digital Transformation ตั้งแต่ศูนย์
                ด้วย Clean Architecture, Modularity และ AI-Driven Development
                เพื่อตอบโจทย์ธุรกิจระดับ Enterprise อย่างแม่นยำ
              </Typography>

              {/* CTAs */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  onClick={() =>
                    document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' })
                  }
                >
                  ./projects
                </Button>
                <Button
                  variant="outlined"
                  onClick={() =>
                    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
                  }
                >
                  ./contact
                </Button>
              </Stack>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(3, 1fr)', md: '1fr' },
                gap: { xs: 2, md: 0 },
                mt: { xs: 5, md: 0 },
              }}
            >
              {[
                { label: 'ERP', sub: '// zero to production' },
                { label: 'SSO', sub: '// enterprise iam' },
                { label: 'AI', sub: '// driven development' },
              ].map((stat) => (
                <Box
                  key={stat.label}
                  sx={{
                    mb: { xs: 0, md: 5 },
                    pl: { md: 4 },
                    pt: { xs: 2, md: 0 },
                    borderLeft: { md: '1px solid #1e1e1e' },
                    borderTop: { xs: '1px solid #1e1e1e', md: 'none' },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-geist-mono), monospace',
                      fontSize: { xs: '1.75rem', md: '2.5rem' },
                      fontWeight: 300,
                      color: '#4ade80',
                      lineHeight: 1,
                      mb: 0.5,
                    }}
                  >
                    {stat.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-geist-mono), monospace',
                      fontSize: { xs: '0.5rem', md: '0.6rem' },
                      color: '#444',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {stat.sub}
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
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography
          sx={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '0.6rem',
            color: '#333',
            letterSpacing: '0.1em',
          }}
        >
          scroll
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
              backgroundColor: '#4ade80',
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
