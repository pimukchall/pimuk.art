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
    accent: '#4ade80',
    deployLabel: 'Vercel + Railway',
    deployDetail: 'Custom Domain · Auto CI/CD',
    description:
      'ออกแบบและพัฒนาเว็บไซต์เต็มรูปแบบสำหรับธุรกิจรับเหมาก่อสร้างและรีโนเวท ครอบคลุมตั้งแต่ Landing Page จนถึง Backend API และ Database ด้วยตนเองทั้งหมด พร้อม Admin Dashboard สำหรับจัดการ Portfolio Content',
    stack: [
      { group: 'Frontend', items: ['Next.js 15', 'App Router', 'Tailwind CSS v4', 'Framer Motion'] },
      { group: 'Backend', items: ['Express.js 5', 'Prisma ORM', 'MySQL 8', 'RESTful API'] },
      { group: 'Infra', items: ['Vercel', 'Railway', 'Cloudinary', 'Auto Deploy'] },
    ],
    modules: ['Landing Page', 'Project Gallery', 'Design Showcase', 'Furniture Catalog', 'News & Articles', 'Contact & Inquiry', 'Admin Dashboard', 'SEO Optimisation'],
  },
  {
    id: '02',
    title: 'Emperor ERP',
    url: null,
    category: 'Internal Enterprise Platform',
    type: 'Intranet · On-premise',
    year: '2024–Present',
    accent: '#a78bfa',
    deployLabel: 'PM2 + VMware ESXi',
    deployDetail: 'Office Server · Intranet Only',
    description:
      'พัฒนาและขยายระบบ ERP ภายในองค์กรอย่างต่อเนื่อง ครอบคลุม Multi-Auth (Local / AD / Microsoft 365 OAuth 2.0), Employee Evaluation, IT Service Desk, Training Assessment, Meeting Room Booking, Supply Requisition บน Nuxt 4 + Node.js / Raw MySQL เพื่อควบคุม Performance เต็มที่',
    stack: [
      { group: 'Frontend', items: ['Nuxt 4', 'Vue 3', 'Vuetify', 'Pinia'] },
      { group: 'Backend', items: ['Node.js / Express', 'Raw MySQL', 'JWT', 'RBAC'] },
      { group: 'Infra', items: ['PM2', 'VMware ESXi', 'Ubuntu Linux', 'Windows Server'] },
    ],
    modules: ['Multi-Auth (Local / AD / M365)', 'Employee Evaluation', 'IT Service Desk', 'Org Structure Chart', 'Internal Training', 'Meeting Room Booking', 'Supply Requisition', 'Network Health Monitor'],
  },
  {
    id: '03',
    title: 'Mavixtech',
    url: 'https://mavixtech.vercel.app',
    category: 'Tech Company Website + CMS',
    type: 'Public · Commercial',
    year: '2025',
    accent: '#38bdf8',
    deployLabel: 'Vercel + Railway',
    deployDetail: 'Serverless · Auto Deploy',
    description:
      'เว็บไซต์บริษัทเทคโนโลยีพร้อม Admin CMS เต็มรูปแบบ ออกแบบ UI ที่ทันสมัยด้วย Framer Motion Animation รองรับการจัดการ Projects, News และ Contact Submissions ผ่าน Dashboard พร้อม NextAuth Authentication',
    stack: [
      { group: 'Frontend', items: ['Next.js App Router', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
      { group: 'Backend', items: ['Next.js API Routes', 'Prisma ORM', 'MySQL', 'NextAuth v4'] },
      { group: 'Media', items: ['Cloudinary', 'Image Optimization', 'Sharp'] },
    ],
    modules: ['Home · About · Services', 'Projects Portfolio', 'News & Articles', 'Contact Form', 'Admin Dashboard', 'Project CMS', 'News CMS', 'Contact Management'],
  },
  {
    id: '04',
    title: 'Leo Furniture',
    url: 'https://leo-project-ruby.vercel.app',
    category: 'Multilingual Brand Website + CMS',
    type: 'Public · i18n · Multi-lang',
    year: '2025',
    accent: '#fb923c',
    deployLabel: 'Vercel',
    deployDetail: 'Serverless · Global CDN',
    description:
      'เว็บไซต์แบรนด์เฟอร์นิเจอร์คลาสสิกรองรับหลายภาษา (next-intl) พร้อม Product Catalog, Project Portfolio และ Admin CMS ออกแบบ Tree Structure Data Model สำหรับ i18n ที่ Scalable และ Admin Dashboard สำหรับจัดการ Products, Projects และ Inquiries',
    stack: [
      { group: 'Frontend', items: ['Next.js App Router', 'next-intl (i18n)', 'Tailwind CSS v4', 'Framer Motion'] },
      { group: 'Backend', items: ['Next.js API Routes', 'Prisma ORM', 'MySQL', 'NextAuth v4'] },
      { group: 'Infra', items: ['Vercel', 'Cloudinary', 'Sharp', 'SEO + Sitemap'] },
    ],
    modules: ['Multi-language (TH / EN)', 'Collections Catalog', 'Project Portfolio', 'About & Contact', 'Inquiry Form', 'Admin: Products', 'Admin: Projects', 'Admin: Inquiries'],
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
        borderTop: '1px solid', borderTopColor: 'divider',
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
              sx={{
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '0.7rem',
                color: '#4ade80',
                mb: 2,
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box component="span" sx={{ color: '#333' }}>//</Box> 03_work
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
              Selected Work
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
            ระบบ Production จริง — ออกแบบและพัฒนาเองทั้งหมดตั้งแต่ Database Schema จนถึง Deployment
          </Typography>
        </Box>

        {/* Project cards */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 2 } }}>
          {projects.map((project) => (
            <Box
              key={project.id}
              sx={{
                border: '1px solid', borderColor: 'divider',
                overflow: 'hidden',
                transition: 'border-color 0.25s ease',
                '&:hover': { borderColor: project.accent + '50' },
              }}
            >
              <Grid container>
                {/* Left: Visual panel */}
                <Grid size={{ xs: 12, md: 3 }}>
                  <Box
                    sx={{
                      minHeight: { xs: 'auto', md: 380 },
                      backgroundColor: 'background.default',
                      display: 'flex',
                      flexDirection: { xs: 'row', md: 'column' },
                      alignItems: 'center',
                      justifyContent: { xs: 'space-between', md: 'center' },
                      position: 'relative',
                      p: { xs: 3, md: 4 },
                      gap: { xs: 2, md: 0 },
                      borderRight: { md: '1px solid' }, borderRightColor: { md: 'divider' },
                    }}
                  >
                    {/* Number */}
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-geist-mono), monospace',
                        fontSize: { xs: '3rem', md: '7rem' },
                        fontWeight: 100,
                        color: project.accent + '15',
                        lineHeight: 1,
                        userSelect: 'none',
                        mb: { xs: 0, md: 2 },
                        flexShrink: 0,
                        letterSpacing: '-0.05em',
                      }}
                    >
                      {project.id}
                    </Typography>

                    <Box sx={{ textAlign: { xs: 'right', md: 'center' }, flex: 1 }}>
                      <Box
                        sx={{
                          px: 2,
                          py: 0.75,
                          border: '1px solid #222',
                          display: 'inline-block',
                          mb: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: 'var(--font-geist-mono), monospace',
                            fontSize: '0.6rem',
                            color: project.accent,
                            display: 'block',
                            letterSpacing: '0.08em',
                          }}
                        >
                          {project.deployLabel}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: 'var(--font-geist-mono), monospace',
                            fontSize: '0.55rem',
                            color: '#444',
                            letterSpacing: '0.05em',
                          }}
                        >
                          {project.deployDetail}
                        </Typography>
                      </Box>

                      {project.url ? (
                        <Typography
                          component="a"
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            display: 'block',
                            fontFamily: 'var(--font-geist-mono), monospace',
                            fontSize: '0.55rem',
                            color: '#444',
                            textDecoration: 'none',
                            letterSpacing: '0.05em',
                            transition: 'color 0.2s',
                            '&:hover': { color: project.accent },
                          }}
                        >
                          ↗ {project.url.replace('https://', '')}
                        </Typography>
                      ) : (
                        <Typography
                          sx={{
                            display: 'block',
                            fontFamily: 'var(--font-geist-mono), monospace',
                            fontSize: '0.55rem',
                            color: '#333',
                            letterSpacing: '0.05em',
                          }}
                        >
                          🔒 not public
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>

                {/* Right: Details panel */}
                <Grid size={{ xs: 12, md: 9 }}>
                  <Box
                    sx={{
                      p: { xs: 3, md: 5 },
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 3,
                    }}
                  >
                    {/* Header */}
                    <Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 0.75,
                        }}
                      >
                        <Typography
                          variant="h3"
                          sx={{ fontSize: { xs: '1.5rem', md: '1.875rem' } }}
                        >
                          {project.title}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: 'var(--font-geist-mono), monospace',
                            fontSize: '0.65rem',
                            color: '#444',
                            mt: 0.5,
                            flexShrink: 0,
                          }}
                        >
                          {project.year}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Typography
                          sx={{
                            fontFamily: 'var(--font-geist-mono), monospace',
                            fontSize: '0.65rem',
                            color: project.accent,
                            letterSpacing: '0.05em',
                          }}
                        >
                          {project.category}
                        </Typography>
                        <Box
                          sx={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: '#333' }}
                        />
                        <Typography
                          sx={{
                            fontFamily: 'var(--font-geist-mono), monospace',
                            fontSize: '0.6rem',
                            color: '#444',
                          }}
                        >
                          {project.type}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Description */}
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      {project.description}
                    </Typography>

                    <Divider sx={{ borderColor: 'divider' }} />

                    {/* Tech stack */}
                    <Grid container spacing={0}>
                      {project.stack.map((s, i) => (
                        <Grid key={s.group} size={{ xs: 12, sm: 4 }}>
                          <Box
                            sx={{
                              pl: i > 0 ? { sm: 3 } : 0,
                              borderLeft: i > 0 ? { sm: '1px solid' } : 'none', borderLeftColor: i > 0 ? 'divider' : undefined,
                              pb: { xs: i < project.stack.length - 1 ? 3 : 0, sm: 0 },
                              mb: { xs: i < project.stack.length - 1 ? 3 : 0, sm: 0 },
                              borderBottom: {
                                xs: i < project.stack.length - 1 ? '1px solid' : 'none',
                                sm: 'none',
                              },
                            }}
                          >
                            <Typography
                              sx={{
                                fontFamily: 'var(--font-geist-mono), monospace',
                                fontSize: '0.6rem',
                                color: project.accent,
                                display: 'block',
                                mb: 1.5,
                                letterSpacing: '0.05em',
                              }}
                            >
                              {s.group}
                            </Typography>
                            {s.items.map((item) => (
                              <Typography
                                key={item}
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.75, fontSize: '0.8rem' }}
                              >
                                {item}
                              </Typography>
                            ))}
                          </Box>
                        </Grid>
                      ))}
                    </Grid>

                    <Divider sx={{ borderColor: 'divider' }} />

                    {/* Modules */}
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-geist-mono), monospace',
                          fontSize: '0.6rem',
                          color: '#444',
                          display: 'block',
                          mb: 1.5,
                          letterSpacing: '0.05em',
                        }}
                      >
                        // modules
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {project.modules.map((mod) => (
                          <Chip
                            key={mod}
                            label={mod}
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: '0.58rem',
                              color: '#555',
                              '&:hover': { borderColor: project.accent + '50', color: project.accent },
                              transition: 'all 0.2s',
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
