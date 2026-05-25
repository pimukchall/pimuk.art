'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

const skills = [
  { category: 'Visual Design', items: ['Brand Identity', 'Art Direction', 'Typography', 'Illustration'] },
  { category: 'Digital', items: ['UI / UX Design', 'Web Design', 'Motion Graphics', 'Interactive Design'] },
  { category: 'Strategy', items: ['Creative Direction', 'Brand Strategy', 'Visual Consulting', 'Workshop Facilitation'] },
];

export default function AboutSection() {
  return (
    <Box
      component="section"
      id="about"
      sx={{
        py: { xs: 12, md: 18 },
        backgroundColor: '#f2ede7',
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 4, md: 10 } }}>
        <Grid container spacing={{ xs: 6, md: 10 }} sx={{ alignItems: 'flex-start' }}>
          {/* Left: About text */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography
              variant="h6"
              sx={{
                color: 'secondary.main',
                mb: 2,
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
              About
            </Typography>

            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
                mb: 4,
              }}
            >
              Crafting beauty{' '}
              <Box component="span" sx={{ fontStyle: 'italic', color: 'secondary.main' }}>
                with intention
              </Box>
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              I&apos;m Pimuk — an art director and visual designer with over seven years of experience
              creating thoughtful, refined work for brands that value craft and clarity.
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              My practice sits at the intersection of art and strategy. I believe the most
              enduring design is not just beautiful — it speaks clearly, feels honest, and
              earns quiet attention rather than demanding it.
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
              When not designing, I explore ceramics, Thai contemporary poetry, and the
              slow art of analog photography.
            </Typography>

            {/* Signature-style accent */}
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: '2rem',
                fontWeight: 400,
                fontStyle: 'italic',
                color: 'text.primary',
                borderTop: '1px solid',
                borderColor: 'divider',
                pt: 3,
              }}
            >
              Pimuk A.
            </Typography>
          </Grid>

          {/* Right: Skills + Image placeholder */}
          <Grid size={{ xs: 12, md: 7 }}>
            {/* Decorative image block */}
            <Box
              sx={{
                height: { xs: 240, md: 320 },
                backgroundColor: '#e8e0d4',
                mb: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: { xs: '6rem', md: '10rem' },
                  fontWeight: 300,
                  color: 'rgba(201,169,110,0.15)',
                  userSelect: 'none',
                }}
              >
                PA
              </Typography>
              {/* Corner accents */}
              {[
                { top: 16, left: 16 },
                { top: 16, right: 16 },
                { bottom: 16, left: 16 },
                { bottom: 16, right: 16 },
              ].map((pos, i) => (
                <Box
                  key={i}
                  sx={{
                    position: 'absolute',
                    width: 20,
                    height: 20,
                    borderTop: i < 2 ? '1px solid' : 'none',
                    borderBottom: i >= 2 ? '1px solid' : 'none',
                    borderLeft: i % 2 === 0 ? '1px solid' : 'none',
                    borderRight: i % 2 === 1 ? '1px solid' : 'none',
                    borderColor: 'rgba(201,169,110,0.4)',
                    ...pos,
                  }}
                />
              ))}
            </Box>

            {/* Skills grid */}
            <Grid container spacing={0} sx={{ alignItems: 'flex-start' }}>
              {skills.map((skillGroup, i) => (
                <Grid key={skillGroup.category} size={{ xs: 12, sm: 4 }}>
                  <Box
                    sx={{
                      pl: i > 0 ? { sm: 4 } : 0,
                      borderLeft: i > 0 ? { sm: '1px solid' } : 'none',
                      borderColor: 'divider',
                      pb: { xs: i < skills.length - 1 ? 4 : 0, sm: 0 },
                      mb: { xs: i < skills.length - 1 ? 4 : 0, sm: 0 },
                      borderBottom: { xs: i < skills.length - 1 ? '1px solid' : 'none', sm: 'none' },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ mb: 2.5, color: 'secondary.main' }}
                    >
                      {skillGroup.category}
                    </Typography>
                    {skillGroup.items.map((item) => (
                      <Typography
                        key={item}
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1.5 }}
                      >
                        {item}
                      </Typography>
                    ))}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
