'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';

const relevantCourses = [
  'Object Oriented Programming',
  'Computer Architecture',
  'Design & Analysis Algorithms',
  'Information System Analysis',
  'Web Programming',
  'Computer Network Systems',
  'Operating Systems',
  'Software Engineering',
  'Artificial Intelligence',
  'Cyber Security Techniques',
  'Internet of Things',
  'Big Data Analytics',
  'Image Processing & Computer Vision',
  'Introduction to Blockchain',
  'Co-operative Education',
  'Computer School Project',
];

export default function EducationSection() {
  return (
    <Box
      component="section"
      id="education"
      sx={{
        py: { xs: 12, md: 18 },
        backgroundColor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background text */}
      <Typography
        sx={{
          position: 'absolute',
          top: { xs: -20, md: -40 },
          right: -20,
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: { xs: '6rem', md: '14rem' },
          fontWeight: 300,
          color: 'rgba(201,169,110,0.05)',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        Education
      </Typography>

      <Container maxWidth="xl" sx={{ px: { xs: 4, md: 10 }, position: 'relative' }}>
        {/* Section header */}
        <Box sx={{ mb: { xs: 8, md: 12 } }}>
          <Typography
            variant="h6"
            sx={{
              color: '#4ade80',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              '&::before': {
                content: '""',
                display: 'block',
                width: 40,
                height: '1px',
                backgroundColor: '#4ade80',
              },
            }}
          >
            Education
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
            Academic Background
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 6, md: 10 }} sx={{ alignItems: 'flex-start' }}>
          {/* Left: Degree info */}
          <Grid size={{ xs: 12, md: 5 }}>
            {/* University */}
            <Box sx={{ mb: 5 }}>
              <Typography
                sx={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: { xs: '2rem', md: '2.75rem' },
                  fontWeight: 400,
                  lineHeight: 1.15,
                  mb: 1,
                }}
              >
                Rangsit University
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Pathum Thani, Thailand
              </Typography>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Degree details */}
            {[
              { label: 'Degree', value: 'Bachelor of Science' },
              { label: 'Major', value: 'Computer Science' },
              { label: 'Faculty', value: 'College of Digital Innovation Technology' },
              { label: 'Distinction', value: 'Second Class Honors' },
              { label: 'GPA', value: '3.44 / 4.00' },
              { label: 'Total Credits', value: '126 Credits' },
              { label: 'Graduated', value: 'June 2024' },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  py: 1.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  gap: 2,
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                  {item.label}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: 'right',
                    color: item.label === 'GPA' || item.label === 'Distinction'
                      ? 'secondary.main'
                      : 'text.primary',
                    fontWeight: item.label === 'GPA' ? 500 : 400,
                  }}
                >
                  {item.value}
                </Typography>
              </Box>
            ))}

          </Grid>

          {/* Right: Relevant courses */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              sx={{
                pl: { md: 6 },
                borderLeft: { md: '1px solid' },
                borderColor: { md: 'divider' },
              }}
            >
              <Typography variant="h6" sx={{ mb: 1, color: '#4ade80' }}>
                Relevant Coursework
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                วิชาที่เกี่ยวข้องกับสายงาน Software Development &amp; Computer Science
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, mb: 6 }}>
                {relevantCourses.map((course) => (
                  <Chip
                    key={course}
                    label={course}
                    size="small"
                    sx={{
                      borderRadius: 0,
                      backgroundColor: 'background.paper',
                      color: 'text.secondary',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.04em',
                      height: 28,
                      border: 'none',
                      '&:hover': {
                        backgroundColor: 'divider',
                      },
                    }}
                  />
                ))}
              </Box>

              <Divider sx={{ mb: 5 }} />

              {/* Highlights */}
              <Typography variant="h6" sx={{ mb: 3, color: '#4ade80' }}>
                Highlights
              </Typography>

              {[
                {
                  title: 'Co-operative Education (9 Credits)',
                  detail:
                    'ทำงานจริงในองค์กรในระหว่างเรียน — ประสบการณ์ที่ต่อยอดสู่การพัฒนา ERP ระดับ Enterprise เต็มรูปแบบ',
                },
                {
                  title: 'Second Class Honors',
                  detail:
                    'สำเร็จการศึกษาด้วยเกียรตินิยมอันดับสอง GPA 3.44 จาก Rangsit University',
                },
                {
                  title: 'Computer School Project',
                  detail:
                    'โปรเจ็คปิดการศึกษาระดับสถาบัน — ออกแบบและพัฒนาระบบซอฟต์แวร์จริงตั้งแต่วิเคราะห์ความต้องการจนถึง Deployment',
                },
              ].map((item, i) => (
                <Box
                  key={item.title}
                  sx={{
                    mb: i < 2 ? 3.5 : 0,
                    pl: 3,
                    borderLeft: '2px solid',
                    borderColor: '#4ade80',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: 'text.primary', mb: 0.75 }}
                  >
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                    {item.detail}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
