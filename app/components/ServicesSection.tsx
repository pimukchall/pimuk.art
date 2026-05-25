'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

const services = [
  {
    number: '01',
    title: 'Brand Identity',
    description:
      'Complete visual identity systems — from logo and typography to colour palettes, brand guidelines, and all printed collateral. Built to last.',
    deliverables: ['Logo & Mark Design', 'Brand Guidelines', 'Print & Packaging', 'Brand Voice'],
  },
  {
    number: '02',
    title: 'Art Direction',
    description:
      'Concept-led art direction for campaigns, editorials, and lookbooks. I collaborate with photographers, stylists, and teams to realise a cohesive visual vision.',
    deliverables: ['Campaign Concepts', 'Photography Direction', 'Editorial Design', 'Mood & Vision'],
  },
  {
    number: '03',
    title: 'Digital Design',
    description:
      'Intentional UX/UI for websites and digital products — where every interaction is considered, every detail deliberate, and nothing is without reason.',
    deliverables: ['UI / UX Design', 'Web Design', 'Design Systems', 'Prototyping'],
  },
  {
    number: '04',
    title: 'Creative Consulting',
    description:
      'Strategic guidance for brands seeking clarity. I help teams define their visual language, align stakeholders, and build the creative frameworks to move forward with confidence.',
    deliverables: ['Brand Audit', 'Visual Strategy', 'Team Workshops', 'Creative Review'],
  },
];

export default function ServicesSection() {
  return (
    <Box
      component="section"
      id="services"
      sx={{
        py: { xs: 12, md: 18 },
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 4, md: 10 } }}>
        {/* Header */}
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
              Services
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
              What I Do
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280 }}>
            End-to-end creative services, from first concept to final delivery.
          </Typography>
        </Box>

        {/* Services list */}
        {services.map((service, i) => (
          <Box key={service.number}>
            <Box
              sx={{
                py: { xs: 5, md: 6 },
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: { xs: 3, md: 6 },
                alignItems: { md: 'flex-start' },
                cursor: 'default',
                transition: 'all 0.3s ease',
                '&:hover .service-number': {
                  color: 'secondary.main',
                },
              }}
            >
              {/* Number */}
              <Typography
                className="service-number"
                sx={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  fontWeight: 300,
                  color: 'divider',
                  minWidth: { md: 80 },
                  transition: 'color 0.3s ease',
                  lineHeight: 1,
                }}
              >
                {service.number}
              </Typography>

              {/* Content */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h3"
                  sx={{
                    mb: 2,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                  }}
                >
                  {service.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 560 }}>
                  {service.description}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {service.deliverables.map((item) => (
                    <Typography
                      key={item}
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        '&::before': {
                          content: '""',
                          display: 'block',
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          backgroundColor: 'secondary.main',
                        },
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Box>
              </Box>

              {/* Decorative arrow */}
              <Box
                sx={{
                  alignSelf: { md: 'center' },
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  gap: 1,
                  color: 'divider',
                  minWidth: 60,
                }}
              >
                <Box sx={{ height: '1px', width: 40, backgroundColor: 'currentColor' }} />
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderTop: '1px solid',
                    borderRight: '1px solid',
                    transform: 'rotate(45deg)',
                    borderColor: 'currentColor',
                    mr: '-3px',
                  }}
                />
              </Box>
            </Box>

            {i < services.length - 1 && <Divider />}
          </Box>
        ))}
      </Container>
    </Box>
  );
}
