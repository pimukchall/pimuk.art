'use client';

import { useState, useTransition } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

const socials = [
  { label: 'github', href: 'https://github.com/pimukchall' },
  { label: 'instagram', href: 'https://instagram.com/pimuk.muk' },
  { label: 'linkedin', href: '#' },
];

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 0,
    fontFamily: '"Noto Sans Thai", var(--font-geist-sans), system-ui, sans-serif',
    fontSize: '0.875rem',
    '& fieldset': { borderColor: '#2a2a2a' },
    '&:hover fieldset': { borderColor: '#4ade80' },
    '&.Mui-focused fieldset': { borderColor: '#4ade80', borderWidth: '1px' },
    '& input, & textarea': { color: '#f0f0f0' },
  },
  '& .MuiInputLabel-root': {
    fontFamily: '"Noto Sans Thai", var(--font-geist-sans), system-ui, sans-serif',
    fontSize: '0.8rem',
    color: '#555',
    '&.Mui-focused': { color: '#4ade80' },
  },
};

type FormState = 'idle' | 'sending' | 'success' | 'error';

export default function ContactSection() {
  const [state, setState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get('name') as string,
      email: form.get('email') as string,
      phone: form.get('phone') as string,
      message: form.get('message') as string,
    };

    startTransition(async () => {
      setState('sending');
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? 'Error');
        setState('success');
        (e.target as HTMLFormElement).reset();
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
        setState('error');
      }
    });
  };

  return (
    <Box
      component="section"
      id="contact"
      sx={{
        py: { xs: 12, md: 18 },
        backgroundColor: 'background.default',
        borderTop: '1px solid',
        borderTopColor: 'divider',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorative text */}
      <Typography
        sx={{
          position: 'absolute',
          bottom: -20,
          left: -10,
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: { xs: '6rem', md: '14rem' },
          fontWeight: 100,
          color: 'rgba(74,222,128,0.03)',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          letterSpacing: '-0.05em',
        }}
      >
        ./contact
      </Typography>

      <Container maxWidth="xl" sx={{ px: { xs: 4, md: 10 }, position: 'relative' }}>
        <Grid container spacing={{ xs: 6, md: 10 }} sx={{ alignItems: 'flex-start' }}>
          {/* Left: info */}
          <Grid size={{ xs: 12, md: 5 }}>
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
              <Box component="span" sx={{ color: '#333' }}>//</Box> 06_contact
            </Typography>

            <Typography
              variant="h2"
              sx={{ color: 'text.primary', fontSize: { xs: '2rem', md: '2.75rem' }, mb: 4 }}
            >
              Let&apos;s build something{' '}
              <Box component="span" sx={{ color: '#4ade80' }}>
                production-grade
              </Box>{' '}
              together
            </Typography>

            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 6, maxWidth: 400 }}>
              พร้อมรับโปรเจ็คใหม่ — Enterprise ERP, System Architecture, IT Infrastructure
              และ Full-Stack Web Development
            </Typography>

            {/* Meta info */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Box>
                <Typography sx={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.6rem', color: '#333', mb: 1, letterSpacing: '0.05em' }}>
                  // location
                </Typography>
                <Typography variant="body2" color="text.secondary">Nonthaburi, Thailand</Typography>
              </Box>

              <Box>
                <Typography sx={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.6rem', color: '#333', mb: 1, letterSpacing: '0.05em' }}>
                  // status
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 6, height: 6, borderRadius: '50%', backgroundColor: '#4ade80',
                      boxShadow: '0 0 8px #4ade80',
                      animation: 'pulse 2s ease-in-out infinite',
                      '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.4 } },
                    }}
                  />
                  <Typography sx={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.75rem', color: '#4ade80' }}>
                    available
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography sx={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.6rem', color: '#333', mb: 2, letterSpacing: '0.05em' }}>
                  // links
                </Typography>
                <Stack spacing={1.5}>
                  {socials.map((s) => (
                    <Typography
                      key={s.label}
                      component="a"
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        fontFamily: 'var(--font-geist-mono), monospace',
                        fontSize: '0.75rem',
                        color: '#444',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        transition: 'color 0.2s',
                        '&:hover': { color: '#4ade80' },
                      }}
                    >
                      <Box component="span" sx={{ color: '#2a2a2a' }}>↗</Box>
                      {s.label}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Grid>

          {/* Right: form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                p: { xs: 3, md: 5 },
              }}
            >
              <Typography
                sx={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.7rem', color: '#4ade80', mb: 4, letterSpacing: '0.05em' }}
              >
                // send message
              </Typography>

              {state === 'success' ? (
                <Box sx={{ py: 6, textAlign: 'center' }}>
                  <Typography sx={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.85rem', color: '#4ade80', mb: 1 }}>
                    ✓ ส่งข้อความเรียบร้อยแล้ว
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    จะติดต่อกลับภายใน 1–2 วัน
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => setState('idle')}
                    sx={{ mt: 4, fontSize: '0.65rem' }}
                  >
                    send another
                  </Button>
                </Box>
              ) : (
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
                >
                  {state === 'error' && (
                    <Alert severity="error" sx={{ borderRadius: 0, fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.75rem' }}>
                      {errorMsg}
                    </Alert>
                  )}

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField name="name" label="ชื่อ *" fullWidth variant="outlined" required sx={fieldSx} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField name="phone" label="เบอร์โทร" fullWidth variant="outlined" sx={fieldSx} />
                    </Grid>
                  </Grid>

                  <TextField name="email" label="อีเมล *" type="email" fullWidth variant="outlined" required sx={fieldSx} />

                  <TextField
                    name="message"
                    label="ข้อความ *"
                    fullWidth
                    multiline
                    rows={5}
                    variant="outlined"
                    required
                    sx={fieldSx}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isPending || state === 'sending'}
                    sx={{ alignSelf: 'flex-start', px: 5 }}
                  >
                    {state === 'sending' ? 'sending...' : 'send_message()'}
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
