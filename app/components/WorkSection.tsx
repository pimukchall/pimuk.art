'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';

const projects = [
  {
    id: '01',
    title: 'Taurus Renovation',
    url: 'https://taurusrenovation.com',
    category: 'Commercial Web Application',
    type: 'Public · Custom Domain',
    year: '2024',
    color: '#f5f0e8',
    accent: '#c9a96e',
    deployLabel: 'Vercel + Railway',
    deployDetail: 'Custom Domain · Auto CI/CD',
    description:
      'ออกแบบและพัฒนาเว็บไซต์เต็มรูปแบบสำหรับธุรกิจรับเหมาก่อสร้างและรีโนเวท ครอบคลุมตั้งแต่ Landing Page จนถึง Backend API และ Database ด้วยตนเองทั้งหมด',
    stack: [
      { group: 'Frontend', items: ['Next.js 15', 'App Router', 'Tailwind CSS', 'TypeScript'] },
      { group: 'Backend', items: ['Node.js', 'Prisma ORM', 'MySQL', 'RESTful API'] },
      { group: 'Infra', items: ['Vercel', 'Railway', 'Custom Domain', 'Auto Deploy'] },
    ],
    modules: ['Landing Page', 'Service Showcase', 'Project Gallery', 'Contact & Inquiry', 'Admin Dashboard', 'SEO Optimisation'],
  },
  {
    id: '02',
    title: 'Enterprise ERP System',
    url: null,
    category: 'Internal Enterprise Platform',
    type: 'Intranet · On-premise',
    year: '2024',
    color: '#eef0f5',
    accent: '#8a97b8',
    deployLabel: 'PM2 + VMware',
    deployDetail: 'Office Server · Intranet Only',
    description:
      'พัฒนาระบบ ERP ภายในองค์กรตั้งแต่ศูนย์ ครอบคลุมระบบ Auth, การประเมิน, IT Service Desk และโครงสร้างองค์กร บน Nuxt 4 ด้วย Node.js raw MySQL ไม่ใช้ ORM เพื่อควบคุม Performance เต็มที่',
    stack: [
      { group: 'Frontend', items: ['Nuxt 4', 'Vue 3', 'JavaScript', 'Vuetify'] },
      { group: 'Backend', items: ['Node.js', 'Raw MySQL', 'JWT Auth', 'RBAC'] },
      { group: 'Infra', items: ['PM2', 'VMware ESXi', 'Windows Server', 'Ubuntu Linux', 'Intranet'] },
    ],
    modules: ['Authentication & SSO', 'Employee Evaluation', 'IT Service Desk', 'Org Structure Chart', 'Module-Based Architecture', 'Role-Based Access Control'],
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
              Key Projects
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
            ระบบ Production จริง — ออกแบบและพัฒนาเองทั้งหมดตั้งแต่ Database Schema จนถึง Deployment
          </Typography>
        </Box>

        {/* Project cards */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 4, md: 3 } }}>
          {projects.map((project) => (
            <Box
              key={project.id}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                transition: 'border-color 0.3s ease',
                '&:hover': { borderColor: project.accent + '80' },
              }}
            >
              <Grid container>
                {/* Left: Visual panel */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box
                    sx={{
                      minHeight: { xs: 'auto', md: 380 },
                      backgroundColor: project.color,
                      display: 'flex',
                      flexDirection: { xs: 'row', md: 'column' },
                      alignItems: 'center',
                      justifyContent: { xs: 'space-between', md: 'center' },
                      position: 'relative',
                      p: { xs: 3, md: 4 },
                      gap: { xs: 2, md: 0 },
                    }}
                  >
                    {/* Big number */}
                    <Typography
                      sx={{
                        fontFamily: '"Cormorant Garamond", Georgia, serif',
                        fontSize: { xs: '3.5rem', md: '8rem' },
                        fontWeight: 300,
                        color: project.accent + '30',
                        lineHeight: 1,
                        userSelect: 'none',
                        mb: { xs: 0, md: 2 },
                        flexShrink: 0,
                      }}
                    >
                      {project.id}
                    </Typography>

                    {/* Deploy badge + URL — inline on mobile */}
                    <Box sx={{ textAlign: { xs: 'right', md: 'center' }, flex: 1 }}>
                      <Box
                        sx={{
                          px: 2,
                          py: 0.75,
                          border: '1px solid',
                          borderColor: project.accent + '50',
                          display: 'inline-block',
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ color: project.accent, display: 'block', letterSpacing: '0.1em' }}
                        >
                          {project.deployLabel}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', fontSize: '0.58rem', letterSpacing: '0.06em' }}
                        >
                          {project.deployDetail}
                        </Typography>
                      </Box>

                      {/* URL / Intranet label */}
                      {project.url ? (
                        <Typography
                          component="a"
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="caption"
                          sx={{
                            display: 'block',
                            color: 'text.secondary',
                            textDecoration: 'none',
                            fontSize: '0.58rem',
                            letterSpacing: '0.08em',
                            transition: 'color 0.2s',
                            '&:hover': { color: project.accent },
                          }}
                        >
                          ↗ {project.url.replace('https://', '')}
                        </Typography>
                      ) : (
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            color: 'text.secondary',
                            fontSize: '0.58rem',
                            letterSpacing: '0.06em',
                          }}
                        >
                          🔒 Intranet — Not publicly accessible
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>

                {/* Right: Details panel */}
                <Grid size={{ xs: 12, md: 8 }}>
                  <Box sx={{ p: { xs: 3, md: 5 }, height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Header */}
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.75 }}>
                        <Typography
                          variant="h3"
                          sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
                        >
                          {project.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, flexShrink: 0 }}>
                          {project.year}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Typography variant="caption" sx={{ color: project.accent }}>
                          {project.category}
                        </Typography>
                        <Box sx={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: 'divider' }} />
                        <Typography variant="caption" color="text.secondary">
                          {project.type}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Description */}
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      {project.description}
                    </Typography>

                    <Divider />

                    {/* Tech stack — 3 columns */}
                    <Grid container spacing={0}>
                      {project.stack.map((s, i) => (
                        <Grid key={s.group} size={{ xs: 12, sm: 4 }}>
                          <Box
                            sx={{
                              pl: i > 0 ? { sm: 3 } : 0,
                              borderLeft: i > 0 ? { sm: '1px solid' } : 'none',
                              borderColor: 'divider',
                              pb: { xs: i < project.stack.length - 1 ? 3 : 0, sm: 0 },
                              mb: { xs: i < project.stack.length - 1 ? 3 : 0, sm: 0 },
                              borderBottom: { xs: i < project.stack.length - 1 ? '1px solid' : 'none', sm: 'none' },
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ color: project.accent, display: 'block', mb: 1.5, letterSpacing: '0.1em' }}
                            >
                              {s.group}
                            </Typography>
                            {s.items.map((item) => (
                              <Typography key={item} variant="body2" color="text.secondary" sx={{ mb: 0.75, fontSize: '0.8rem' }}>
                                {item}
                              </Typography>
                            ))}
                          </Box>
                        </Grid>
                      ))}
                    </Grid>

                    <Divider />

                    {/* Modules */}
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                        Modules / Features
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {project.modules.map((mod) => (
                          <Chip
                            key={mod}
                            label={mod}
                            size="small"
                            sx={{
                              borderRadius: 0,
                              backgroundColor: project.color,
                              color: 'text.secondary',
                              fontSize: '0.6rem',
                              letterSpacing: '0.08em',
                              border: 'none',
                              height: 22,
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
