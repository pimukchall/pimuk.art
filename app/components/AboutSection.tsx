'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Image from 'next/image';

const techStack = [
  {
    category: 'Frontend',
    items: ['Next.js 15 (App Router)', 'Nuxt 3 / Vue 3', 'React / TypeScript', 'Tailwind CSS / Vuetify'],
  },
  {
    category: 'Backend & DB',
    items: ['Node.js / NestJS', 'Prisma ORM', 'RESTful API Design', 'MySQL / Schema Design'],
  },
  {
    category: 'Infra & AI',
    items: ['Microsoft Entra ID', 'FortiGate / UniFi', 'Vercel / Railway / PM2', 'Claude · Gemini · Copilot'],
  },
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
          {/* Left: Bio */}
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
              sx={{ fontSize: { xs: '2rem', md: '2.5rem', lg: '2.75rem' }, mb: 4 }}
            >
              Enterprise systems,{' '}
              <Box component="span" sx={{ fontStyle: 'italic', color: 'secondary.main' }}>
                built to last
              </Box>
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Full-Stack Developer &amp; System Architect ผู้เชี่ยวชาญการสร้าง Enterprise Solutions
              ตั้งแต่ศูนย์ (Zero to Production) ด้วยแนวคิด Clean Architecture, Modularity
              และ Scalability เป็นหัวใจหลัก
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              มีประสบการณ์ในการพัฒนาระบบ ERP และ ISO Digital Transformation
              ตัดสินใจเลือก Tech Stack ที่เหมาะสมทั้งบน On-premise และ Hybrid Cloud
              เพื่อตอบโจทย์ธุรกิจอย่างมีประสิทธิภาพสูงสุด
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
              ประยุกต์ใช้ Advanced AI Tools (Claude, Gemini, GitHub Copilot)
              เพื่อเร่ง Development Velocity และควบคุมคุณภาพในการพัฒนาระบบซับซ้อน
              ตามมาตรฐานสากล
            </Typography>

            {/* Key achievements strip */}
            {[
              'Inventory Real-time 100% — Zero to One',
              'Module-Based Refactor: Monolith → Clean Architecture',
              'Tree Structure Data Model — i18n / Multilingual Ready',
            ].map((ach) => (
              <Box
                key={ach}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  mb: 1.5,
                  '&::before': {
                    content: '""',
                    display: 'block',
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    backgroundColor: 'secondary.main',
                    mt: '8px',
                    flexShrink: 0,
                  },
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {ach}
                </Typography>
              </Box>
            ))}

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
                mt: 4,
              }}
            >
              Pimuk A.
            </Typography>
          </Grid>

          {/* Right: Stack + visual */}
          <Grid size={{ xs: 12, md: 7 }}>
            {/* Profile photo */}
            <Box
              sx={{
                height: { xs: 320, md: 420 },
                mb: 6,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Image
                src="/profile.jpg"
                alt="Pimuk Artharnnarong"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
                sizes="(max-width: 900px) 100vw, 58vw"
                priority
              />
              {/* Corner accents overlay */}
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
                    width: 24,
                    height: 24,
                    borderTop: i < 2 ? '1px solid' : 'none',
                    borderBottom: i >= 2 ? '1px solid' : 'none',
                    borderLeft: i % 2 === 0 ? '1px solid' : 'none',
                    borderRight: i % 2 === 1 ? '1px solid' : 'none',
                    borderColor: 'rgba(255,255,255,0.6)',
                    zIndex: 1,
                    ...pos,
                  }}
                />
              ))}
            </Box>

            {/* Tech stack grid */}
            <Grid container spacing={0} sx={{ alignItems: 'flex-start' }}>
              {techStack.map((group, i) => (
                <Grid key={group.category} size={{ xs: 12, sm: 4 }}>
                  <Box
                    sx={{
                      pl: i > 0 ? { sm: 4 } : 0,
                      borderLeft: i > 0 ? { sm: '1px solid' } : 'none',
                      borderColor: 'divider',
                      pb: { xs: i < techStack.length - 1 ? 4 : 0, sm: 0 },
                      mb: { xs: i < techStack.length - 1 ? 4 : 0, sm: 0 },
                      borderBottom: { xs: i < techStack.length - 1 ? '1px solid' : 'none', sm: 'none' },
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 2.5, color: 'secondary.main' }}>
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
