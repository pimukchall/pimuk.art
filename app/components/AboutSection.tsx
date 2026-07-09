'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Image from 'next/image';

const techStack = [
  {
    category: 'Frontend',
    items: ['Next.js 15–16 (App Router)', 'Nuxt 4 / Vue 3', 'React 19 / TypeScript', 'Tailwind CSS v4 / MUI'],
  },
  {
    category: 'Backend & DB',
    items: ['Node.js / NestJS', 'Prisma ORM / Raw MySQL', 'RESTful API Design', 'JWT · RBAC · Auth'],
  },
  {
    category: 'Infra & AI',
    items: ['Vercel · Railway · PM2', 'VMware ESXi · Ubuntu', 'Microsoft Entra ID · AD', 'Claude · Gemini · Copilot'],
  },
];

export default function AboutSection() {
  return (
    <Box
      component="section"
      id="about"
      sx={{
        py: { xs: 12, md: 18 },
        backgroundColor: 'background.default',
        borderTop: '1px solid', borderTopColor: 'divider',
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 4, md: 10 } }}>
        <Grid container spacing={{ xs: 6, md: 10 }} sx={{ alignItems: 'flex-start' }}>
          {/* Left: Bio */}
          <Grid size={{ xs: 12, md: 5 }}>
            {/* Section label */}
            <Typography
              sx={{
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '0.7rem',
                color: '#4ade80',
                mb: 3,
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box component="span" sx={{ color: '#333' }}>//</Box> 02_about
            </Typography>

            <Typography
              variant="h2"
              sx={{ fontSize: { xs: '2rem', md: '2.5rem', lg: '2.75rem' }, mb: 4, color: 'text.primary' }}
            >
              Enterprise systems,{' '}
              <Box component="span" sx={{ color: '#4ade80' }}>
                built to last
              </Box>
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Full-Stack Developer &amp; System Architect ผู้เชี่ยวชาญการสร้าง Enterprise Solutions
              ตั้งแต่ศูนย์ (Zero to Production) ด้วยแนวคิด Clean Architecture, Modularity
              และ Scalability เป็นหัวใจหลัก
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              มีประสบการณ์พัฒนาระบบ ERP และ ISO Digital Transformation
              เลือก Tech Stack ที่เหมาะสมทั้งบน On-premise และ Hybrid Cloud
              เพื่อตอบโจทย์ธุรกิจอย่างมีประสิทธิภาพสูงสุด
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
              ประยุกต์ใช้ Advanced AI Tools (Claude, Gemini, GitHub Copilot)
              เพื่อเร่ง Development Velocity และควบคุมคุณภาพในการพัฒนาระบบซับซ้อน
            </Typography>

            {/* Achievements */}
            {[
              'Inventory Real-time 100% — Zero to One',
              'Module-Based Refactor: Monolith → Clean Architecture',
              'Tree Structure Data Model — i18n / Multilingual Ready',
              'Enterprise SSO: AD + Microsoft 365 OAuth 2.0',
            ].map((ach, i) => (
              <Box
                key={ach}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  mb: 1.5,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'var(--font-geist-mono), monospace',
                    fontSize: '0.65rem',
                    color: '#4ade80',
                    mt: '3px',
                    flexShrink: 0,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {ach}
                </Typography>
              </Box>
            ))}

            <Box
              sx={{
                borderTop: '1px solid', borderTopColor: 'divider',
                pt: 3,
                mt: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: '1.5rem',
                  fontWeight: 300,
                  color: 'text.primary',
                }}
              >
                Pimuk A.
              </Typography>
              <Box
                sx={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: '0.65rem',
                  color: '#333',
                  letterSpacing: '0.05em',
                }}
              >
                // nonthaburi, th
              </Box>
            </Box>
          </Grid>

          {/* Right: Photo + Stack */}
          <Grid size={{ xs: 12, md: 7 }}>
            {/* Profile photo */}
            <Box
              sx={{
                height: { xs: 320, md: 420 },
                mb: 6,
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid', borderColor: 'divider',
              }}
            >
              <Image
                src="/profile.jpg"
                alt="Pimuk Artharnnarong"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center top', filter: 'grayscale(30%)' }}
                sizes="(max-width: 900px) 100vw, 58vw"
                priority
              />
              {/* Corner accents */}
              {[
                { top: 12, left: 12 },
                { top: 12, right: 12 },
                { bottom: 12, left: 12 },
                { bottom: 12, right: 12 },
              ].map((pos, i) => (
                <Box
                  key={i}
                  sx={{
                    position: 'absolute',
                    width: 20,
                    height: 20,
                    borderTop: i < 2 ? '1px solid #4ade80' : 'none',
                    borderBottom: i >= 2 ? '1px solid #4ade80' : 'none',
                    borderLeft: i % 2 === 0 ? '1px solid #4ade80' : 'none',
                    borderRight: i % 2 === 1 ? '1px solid #4ade80' : 'none',
                    zIndex: 1,
                    ...pos,
                  }}
                />
              ))}
              {/* Scanline overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              />
            </Box>

            {/* Tech stack grid */}
            <Grid container spacing={0} sx={{ alignItems: 'flex-start' }}>
              {techStack.map((group, i) => (
                <Grid key={group.category} size={{ xs: 12, sm: 4 }}>
                  <Box
                    sx={{
                      pl: i > 0 ? { sm: 4 } : 0,
                      borderLeft: i > 0 ? { sm: '1px solid' } : 'none', borderLeftColor: i > 0 ? 'divider' : undefined,
                      pb: { xs: i < techStack.length - 1 ? 4 : 0, sm: 0 },
                      mb: { xs: i < techStack.length - 1 ? 4 : 0, sm: 0 },
                      borderBottom: {
                        xs: i < techStack.length - 1 ? '1px solid' : 'none',
                        sm: 'none',
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-geist-mono), monospace',
                        fontSize: '0.65rem',
                        color: '#4ade80',
                        mb: 2.5,
                        letterSpacing: '0.05em',
                      }}
                    >
                      {group.category}
                    </Typography>
                    {group.items.map((item) => (
                      <Typography key={item} variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
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
