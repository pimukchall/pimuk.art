'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';

const projects = [
  {
    id: '01',
    title: 'Maison Lumière',
    category: 'Brand Identity',
    tags: ['Branding', 'Typography', 'Print'],
    description: 'A complete visual identity system for a high-end Parisian furniture boutique, blending classic elegance with contemporary minimalism.',
    color: '#f5f0e8',
    accent: '#c9a96e',
    year: '2024',
  },
  {
    id: '02',
    title: 'Aura Digital',
    category: 'UI / UX Design',
    tags: ['Web', 'Mobile', 'Research'],
    description: 'Redesigning the digital experience for a wellness tech platform — creating calm, intentional interfaces that guide users through mindfulness journeys.',
    color: '#eef0f5',
    accent: '#8a97b8',
    year: '2024',
  },
  {
    id: '03',
    title: 'Verde Collection',
    category: 'Editorial & Art Direction',
    tags: ['Art Direction', 'Photography', 'Editorial'],
    description: 'Art direction for a seasonal lookbook celebrating slow fashion — each frame a meditation on texture, light, and the beauty of restraint.',
    color: '#edf0ed',
    accent: '#7a9b7a',
    year: '2023',
  },
  {
    id: '04',
    title: 'Nakara Spa',
    category: 'Brand & Digital',
    tags: ['Branding', 'Web', 'Motion'],
    description: 'Full-spectrum creative direction for a luxury Thai spa concept — from brand philosophy to website to the ambient motion graphics inside the space.',
    color: '#f0ece8',
    accent: '#b89a7a',
    year: '2023',
  },
];

export default function WorkSection() {
  return (
    <Box
      component="section"
      id="work"
      sx={{
        py: { xs: 12, md: 18 },
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 4, md: 10 } }}>
        {/* Section header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'flex-end' },
            mb: { xs: 8, md: 12 },
            gap: 4,
          }}
        >
          <Box>
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
              Selected Work
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
              Recent Projects
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280 }}>
            A curated selection of projects across branding, digital design, and art direction.
          </Typography>
        </Box>

        {/* Project grid */}
        <Grid container spacing={{ xs: 4, md: 3 }}>
          {projects.map((project, i) => (
            <Grid key={project.id} size={{ xs: 12, md: i % 3 === 0 ? 8 : 4 }}>
              <Box
                sx={{
                  position: 'relative',
                  cursor: 'pointer',
                  '&:hover .project-overlay': {
                    opacity: 1,
                  },
                  '&:hover .project-image': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                {/* Project visual */}
                <Box
                  className="project-image"
                  sx={{
                    height: { xs: 280, md: i % 3 === 0 ? 480 : 360 },
                    backgroundColor: project.color,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Decorative inner element */}
                  <Box
                    sx={{
                      width: '40%',
                      height: '40%',
                      border: '1px solid',
                      borderColor: project.accent + '40',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: '"Cormorant Garamond", Georgia, serif',
                        fontSize: i % 3 === 0 ? '5rem' : '3.5rem',
                        fontWeight: 300,
                        color: project.accent + '60',
                        lineHeight: 1,
                      }}
                    >
                      {project.id}
                    </Typography>
                  </Box>

                  {/* Hover overlay */}
                  <Box
                    className="project-overlay"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(26,26,26,0.75)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.4s ease',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: 'rgba(255,255,255,0.9)', letterSpacing: '0.2em' }}
                    >
                      View Project
                    </Typography>
                  </Box>
                </Box>

                {/* Project info */}
                <Box sx={{ mt: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography
                      variant="h4"
                      sx={{ fontSize: '1.1rem', fontWeight: 500, letterSpacing: '0.03em' }}
                    >
                      {project.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {project.year}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="secondary.main" sx={{ display: 'block', mb: 1.5 }}>
                    {project.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: { xs: 'none', md: 'block' } }}>
                    {project.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {project.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: 'divider',
                          color: 'text.secondary',
                          fontSize: '0.6rem',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
