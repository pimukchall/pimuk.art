'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

const services = [
  {
    number: '01',
    title: 'Enterprise ERP Development',
    description:
      'พัฒนาระบบ ERP ขององค์กรตั้งแต่ศูนย์ด้วย Module-Based Clean Architecture ครอบคลุม Inventory Management, HR Tools, Employee Evaluation, Service Desk และระบบ Workflow อื่นๆ ตามความต้องการของธุรกิจ',
    deliverables: ['System Architecture Design', 'Module-Based Development', 'Database Schema', 'API Design (REST)'],
  },
  {
    number: '02',
    title: 'ISO Digital Transformation',
    description:
      'เปลี่ยนผ่านกระบวนการ Paper-based สู่ Digital 100% ตามมาตรฐาน ISO ออกแบบระบบ Traceability, Audit Log และ Log Management เพื่อสร้างความโปร่งใส ป้องกันการทุจริต และเร่งความเร็ว Audit',
    deliverables: ['Traceability System', 'Audit Log Design', 'QP / Workflow Design', 'Microsoft Visio Flow'],
  },
  {
    number: '03',
    title: 'System Architecture & Modernisation',
    description:
      'Refactor ระบบจาก Monolith ไปสู่ Module-Based Architecture แบ่งเลเยอร์ชัดเจน (Repositories, Services, Controllers, Routes) รองรับ Scalability ลด Technical Debt และ Migrate สู่ Modern Stack',
    deliverables: ['Architecture Review', 'Monolith → Module Refactor', 'Clean Code Consulting', 'Next.js / Nuxt Migration'],
  },
  {
    number: '04',
    title: 'IT Infrastructure & IAM',
    description:
      'วางระบบ Enterprise Identity & Access Management เชื่อมต่อ SSO กับ Microsoft Entra ID / Active Directory บริหาร Infrastructure ทั้ง On-premise และ Hybrid Cloud พร้อม Network Security (FortiGate, UniFi)',
    deliverables: ['Microsoft Entra ID / SSO', 'RBAC Design', 'FortiGate / Network Policy', 'Vercel · Railway · PM2'],
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
        borderTop: '1px solid', borderTopColor: 'divider',
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
              <Box component="span" sx={{ color: '#333' }}>//</Box> 05_services
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
              What I Do
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
            End-to-end enterprise development — from architecture design to production deployment.
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
                '&:hover .service-number': { color: '#4ade80' },
              }}
            >
              {/* Number */}
              <Typography
                className="service-number"
                sx={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  fontWeight: 300,
                  color: '#222',
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
                  sx={{ mb: 2, fontSize: { xs: '1.4rem', md: '1.875rem' } }}
                >
                  {service.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 580 }}>
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
                          backgroundColor: '#4ade80',
                        },
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Box>
              </Box>

              {/* Arrow */}
              <Box
                sx={{
                  alignSelf: { md: 'center' },
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
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
