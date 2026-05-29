'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

const categories = [
  {
    label: 'Languages',
    items: [
      { name: 'TypeScript', note: 'Primary' },
      { name: 'JavaScript (ES2022+)', note: '' },
      { name: 'SQL', note: 'MySQL · Schema Design' },
      { name: 'Bash / Shell', note: 'Scripting & Automation' },
    ],
  },
  {
    label: 'Frontend',
    items: [
      { name: 'Next.js 15–16', note: 'App Router · RSC' },
      { name: 'Nuxt 4 / Vue 3', note: 'Composition API' },
      { name: 'React 19', note: '' },
      { name: 'Tailwind CSS v4', note: '' },
      { name: 'MUI v6 / Vuetify', note: 'Component Systems' },
    ],
  },
  {
    label: 'Backend & API',
    items: [
      { name: 'Node.js', note: 'Primary Runtime' },
      { name: 'NestJS', note: 'Module-Based' },
      { name: 'Prisma ORM', note: '' },
      { name: 'Raw MySQL Driver', note: 'Performance-critical' },
      { name: 'RESTful API Design', note: '' },
      { name: 'JWT · RBAC', note: 'Auth & Access Control' },
    ],
  },
  {
    label: 'Infrastructure & DevOps',
    items: [
      { name: 'Vercel', note: 'Frontend · Serverless' },
      { name: 'Railway', note: 'Backend · Database' },
      { name: 'PM2', note: 'Process Management' },
      { name: 'VMware ESXi', note: 'Virtualisation' },
      { name: 'Ubuntu Linux', note: 'Server Administration' },
      { name: 'Windows Server', note: '' },
      { name: 'CI/CD (GitHub Actions)', note: 'Auto Deploy' },
    ],
  },
  {
    label: 'IAM & Network Security',
    items: [
      { name: 'Microsoft Entra ID', note: 'SSO · Conditional Access' },
      { name: 'Active Directory', note: 'On-premise' },
      { name: 'FortiGate', note: 'Firewall · VPN Policy' },
      { name: 'Ubiquiti UniFi', note: 'Network Management' },
      { name: 'RBAC Design', note: 'Enterprise Access Model' },
    ],
  },
  {
    label: 'AI & Tooling',
    items: [
      { name: 'Claude (Anthropic)', note: 'Primary AI Co-pilot' },
      { name: 'Google Gemini', note: '' },
      { name: 'GitHub Copilot', note: 'IDE Integration' },
      { name: 'Git / GitHub', note: '' },
      { name: 'Microsoft Visio', note: 'Flow & Architecture' },
      { name: 'Figma', note: 'UI Design' },
    ],
  },
];

const capabilities = [
  {
    title: 'Full-Stack Development',
    detail: 'ออกแบบและพัฒนาระบบตั้งแต่ Database Schema → API → UI → Deployment ด้วยตัวคนเดียว ครอบคลุมทุก Layer',
  },
  {
    title: 'Clean Architecture & Refactoring',
    detail: 'แบ่งเลเยอร์ชัดเจน (Repositories / Services / Controllers / Routes) ลด Coupling เพิ่ม Testability และ Scalability',
  },
  {
    title: 'Enterprise ERP Design',
    detail: 'ออกแบบ Module-Based ERP ตั้งแต่ศูนย์ — Auth, RBAC, Workflow, Evaluation, Service Desk บน Production จริง',
  },
  {
    title: 'ISO Digital Transformation',
    detail: 'เปลี่ยนผ่านกระบวนการ Paper-based สู่ Digital 100% พร้อม Traceability, Audit Log และ Compliance Design',
  },
  {
    title: 'Identity & Access Management',
    detail: 'วาง Enterprise IAM ด้วย Microsoft Entra ID / Active Directory, SSO, Conditional Access และ RBAC',
  },
  {
    title: 'AI-Augmented Engineering',
    detail: 'ประยุกต์ใช้ Advanced AI (Claude · Gemini · Copilot) เพื่อเร่ง Velocity โดยไม่เสียคุณภาพของ Architecture',
  },
];

export default function TechStackSection() {
  return (
    <Box
      component="section"
      id="tech-stack"
      sx={{ py: { xs: 12, md: 18 }, backgroundColor: '#f2ede7' }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 4, md: 10 } }}>
        {/* Header */}
        <Box sx={{ mb: { xs: 8, md: 12 } }}>
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
            Stack & Capabilities
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'flex-end' },
              gap: 4,
            }}
          >
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
              Technology &{' '}
              <Box component="span" sx={{ fontStyle: 'italic', color: 'secondary.main' }}>
                Expertise
              </Box>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320 }}>
              เครื่องมือและความสามารถที่ใช้จริงในงาน Production — ไม่ใช่แค่รู้จัก
            </Typography>
          </Box>
        </Box>

        {/* Tech Stack Grid */}
        <Grid container spacing={0} sx={{ mb: { xs: 10, md: 14 } }}>
          {categories.map((cat, i) => (
            <Grid key={cat.label} size={{ xs: 12, sm: 6, md: 4 }}>
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  borderTop: '1px solid',
                  borderRight: { md: (i + 1) % 3 !== 0 ? '1px solid' : 'none' },
                  borderColor: 'divider',
                  height: '100%',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 3, color: 'secondary.main', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}
                >
                  {cat.label}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {cat.items.map((item) => (
                    <Box key={item.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 2 }}>
                      <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 400 }}>
                        {item.name}
                      </Typography>
                      {item.note && (
                        <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap', fontSize: '0.65rem' }}>
                          {item.note}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          ))}
          {/* Bottom border for last row */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }} />
          </Grid>
        </Grid>

        {/* Capabilities */}
        <Box>
          <Typography
            variant="h3"
            sx={{ mb: { xs: 6, md: 8 }, fontSize: { xs: '1.5rem', md: '2rem' } }}
          >
            Core Capabilities
          </Typography>

          <Box>
            {capabilities.map((cap, i) => (
              <Box key={cap.title}>
                <Box
                  sx={{
                    py: { xs: 4, md: 5 },
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: { xs: 2, md: 8 },
                    alignItems: { md: 'flex-start' },
                    '&:hover .cap-index': { color: 'secondary.main' },
                  }}
                >
                  <Typography
                    className="cap-index"
                    sx={{
                      fontFamily: '"Cormorant Garamond", Georgia, serif',
                      fontSize: '1.1rem',
                      color: 'divider',
                      minWidth: { md: 32 },
                      transition: 'color 0.3s ease',
                      pt: { md: '2px' },
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </Typography>
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 1.5, md: 6 } }}>
                    <Typography
                      variant="h6"
                      sx={{ minWidth: { md: 280 }, fontSize: { xs: '1rem', md: '1.1rem' }, fontWeight: 500 }}
                    >
                      {cap.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, flex: 1 }}>
                      {cap.detail}
                    </Typography>
                  </Box>
                </Box>
                {i < capabilities.length - 1 && <Divider />}
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
