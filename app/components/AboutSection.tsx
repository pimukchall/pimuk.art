'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Image from 'next/image';

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
                color: '#38bdf8',
                mb: 3,
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box component="span" sx={{ color: '#94a3b8' }}>//</Box> 02_about
            </Typography>

            <Typography
              variant="h2"
              sx={{ fontSize: { xs: '2rem', md: '2.5rem', lg: '2.75rem' }, mb: 4, color: 'text.primary' }}
            >
              Enterprise systems,{' '}
              <Box component="span" sx={{ color: '#38bdf8' }}>
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
                    color: '#38bdf8',
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
                  color: '#94a3b8',
                  letterSpacing: '0.05em',
                }}
              >
                // nonthaburi, th
              </Box>
            </Box>
          </Grid>

          {/* Right: Photo */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              sx={{
                height: { xs: 320, md: 500 },
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
                    borderTop: i < 2 ? '1px solid #38bdf8' : 'none',
                    borderBottom: i >= 2 ? '1px solid #38bdf8' : 'none',
                    borderLeft: i % 2 === 0 ? '1px solid #38bdf8' : 'none',
                    borderRight: i % 2 === 1 ? '1px solid #38bdf8' : 'none',
                    zIndex: 1,
                    ...pos,
                  }}
                />
              ))}
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
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
