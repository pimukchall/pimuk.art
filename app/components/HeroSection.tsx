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
                Full-Stack Developer &amp; Enterprise Architect
              </Typography>

              {/* Main heading */}
              <Typography
                variant="h1"
                sx={{
                  mb: { xs: 3, md: 4 },
                  fontSize: { xs: '2.75rem', sm: '3.75rem', md: '5rem', lg: '6.5rem' },
                }}
              >
                Zero to{' '}
                <Box
                  component="span"
                  sx={{ fontStyle: 'italic', color: 'secondary.main' }}
                >
                  Production
                </Box>
                <br />
                Enterprise Systems
              </Typography>

              {/* Subtext */}
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  maxWidth: 520,
                  mb: { xs: 5, md: 7 },
                  fontSize: { xs: '0.9375rem', md: '1.0625rem' },
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
                  href="#work"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  sx={{ alignSelf: { xs: 'flex-start' } }}
                >
                  Selected Projects
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
            {/* Stats — row on md+, 3-col grid on xs */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(3, 1fr)', md: '1fr' },
                gap: { xs: 2, md: 0 },
                mt: { xs: 5, md: 0 },
              }}
            >
              {[
                { number: 'ERP', label: 'Zero to Production' },
                { number: 'ISO', label: 'Digital Transformation' },
                { number: 'SSO', label: 'Enterprise IAM' },
              ].map((stat) => (
                <Box
                  key={stat.label}
                  sx={{
                    mb: { xs: 0, md: 5 },
                    pl: { md: 4 },
                    pt: { xs: 2, md: 0 },
                    borderLeft: { md: '1px solid' },
                    borderTop: { xs: '1px solid', md: 'none' },
                    borderColor: 'divider',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"Cormorant Garamond", Georgia, serif',
                      fontSize: { xs: '1.75rem', md: '2.75rem' },
                      fontWeight: 300,
                      color: 'text.primary',
                      lineHeight: 1,
                      mb: 0.5,
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.55rem', md: '0.6875rem' }, lineHeight: 1.3 }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Scroll indicator — desktop only */}
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
