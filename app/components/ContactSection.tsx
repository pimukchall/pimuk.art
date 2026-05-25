'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

const socials = [
  { label: 'GitHub', href: 'https://github.com/pimukchall' },
  { label: 'Instagram', href: 'https://instagram.com/pimuk.muk' },
  { label: 'LinkedIn', href: '#' },
];

export default function ContactSection() {
  return (
    <Box
      component="section"
      id="contact"
      sx={{
        py: { xs: 12, md: 18 },
        backgroundColor: '#1a1a1a',
        color: '#fafaf8',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorative text */}
      <Typography
        sx={{
          position: 'absolute',
          bottom: -40,
          left: -20,
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontSize: { xs: '8rem', md: '18rem' },
          fontWeight: 300,
          color: 'rgba(255,255,255,0.03)',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        Contact
      </Typography>

      <Container maxWidth="xl" sx={{ px: { xs: 4, md: 10 }, position: 'relative' }}>
        <Grid container spacing={{ xs: 6, md: 10 }} sx={{ alignItems: 'flex-start' }}>
          {/* Left */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography
              variant="h6"
              sx={{
                color: '#c9a96e',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                '&::before': {
                  content: '""',
                  display: 'block',
                  width: 40,
                  height: '1px',
                  backgroundColor: '#c9a96e',
                },
              }}
            >
              Get in Touch
            </Typography>

            <Typography
              variant="h2"
              sx={{
                color: '#fafaf8',
                fontSize: { xs: '2rem', md: '3rem', lg: '3.5rem' },
                mb: 4,
              }}
            >
              Let&apos;s create something{' '}
              <Box component="span" sx={{ fontStyle: 'italic', color: '#c9a96e' }}>
                exceptional
              </Box>{' '}
              together
            </Typography>

            <Typography
              variant="body1"
              sx={{ color: 'rgba(250,250,248,0.6)', mb: 5, maxWidth: 480 }}
            >
              I&apos;m currently available for new projects — brand identities, art direction,
              and digital design. Whether you have a clear brief or a half-formed idea,
              I&apos;d love to explore it with you.
            </Typography>

            <Button
              variant="outlined"
              href="mailto:pimuk.artharnnarong@gmail.com"
              sx={{
                borderColor: 'rgba(250,250,248,0.3)',
                color: '#fafaf8',
                mb: 6,
                '&:hover': {
                  borderColor: '#c9a96e',
                  color: '#c9a96e',
                  backgroundColor: 'transparent',
                },
              }}
            >
              Send an Email
            </Button>

            {/* Email display */}
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(250,250,248,0.3)', display: 'block', mb: 1 }}>
                Or reach me directly at
              </Typography>
              <Typography
                component="a"
                href="mailto:pimuk.artharnnarong@gmail.com"
                sx={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  color: 'rgba(250,250,248,0.7)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  '&:hover': { color: '#c9a96e' },
                }}
              >
                pimuk.artharnnarong@gmail.com
              </Typography>
            </Box>
          </Grid>

          {/* Right */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                pl: { md: 6 },
                borderLeft: { md: '1px solid rgba(250,250,248,0.1)' },
                pt: { md: 6 },
              }}
            >
              {/* Location */}
              <Box sx={{ mb: 6 }}>
                <Typography variant="caption" sx={{ color: 'rgba(250,250,248,0.3)', display: 'block', mb: 1 }}>
                  Location
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(250,250,248,0.8)' }}>
                  Nonthaburi, Thailand
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(250,250,248,0.4)', mt: 0.5 }}>
                  Available for remote & travel projects worldwide
                </Typography>
              </Box>

              {/* Availability */}
              <Box sx={{ mb: 6 }}>
                <Typography variant="caption" sx={{ color: 'rgba(250,250,248,0.3)', display: 'block', mb: 1 }}>
                  Current Availability
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#7ab87a',
                      boxShadow: '0 0 8px #7ab87a',
                    }}
                  />
                  <Typography variant="body1" sx={{ color: 'rgba(250,250,248,0.8)' }}>
                    Open to new projects
                  </Typography>
                </Box>
              </Box>

              {/* Socials */}
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(250,250,248,0.3)', display: 'block', mb: 2 }}>
                  Follow
                </Typography>
                <Stack spacing={1.5}>
                  {socials.map((social) => (
                    <Typography
                      key={social.label}
                      component="a"
                      href={social.href}
                      variant="body2"
                      sx={{
                        color: 'rgba(250,250,248,0.5)',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        transition: 'color 0.2s',
                        '&:hover': { color: '#c9a96e' },
                        '&:hover span': { width: '24px' },
                        cursor: 'pointer',
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          height: '1px',
                          width: 16,
                          backgroundColor: 'currentColor',
                          display: 'inline-block',
                          transition: 'width 0.3s ease',
                        }}
                      />
                      {social.label}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
