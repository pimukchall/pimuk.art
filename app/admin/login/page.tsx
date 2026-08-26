'use client';

import { useState, useTransition } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { fieldSx } from '../_components/fieldSx';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get('email') as string;
    const password = form.get('password') as string;

    startTransition(async () => {
      setError('');
      const res = await signIn('credentials', { email, password, redirect: false });
      if (res?.error) {
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      } else {
        router.push('/admin/contacts');
        router.refresh();
      }
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        {/* Header */}
        <Box sx={{ mb: 8 }}>
          <Typography
            sx={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '0.65rem',
              color: '#38bdf8',
              mb: 2,
              letterSpacing: '0.05em',
            }}
          >
            ~/pimuk.art/admin
          </Typography>
          <Typography
            variant="h2"
            sx={{ fontSize: '2rem', mb: 1 }}
          >
            Sign In
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Admin access only
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && (
            <Alert
              severity="error"
              sx={{
                borderRadius: 0,
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '0.75rem',
                backgroundColor: 'transparent',
                border: '1px solid',
                borderColor: '#ef4444',
                color: '#ef4444',
                '& .MuiAlert-icon': { color: '#ef4444' },
              }}
            >
              {error}
            </Alert>
          )}

          <TextField
            name="email"
            type="email"
            label="Email"
            required
            autoComplete="email"
            autoFocus
            fullWidth
            variant="outlined"
            sx={fieldSx}
          />

          <TextField
            name="password"
            type="password"
            label="Password"
            required
            autoComplete="current-password"
            fullWidth
            variant="outlined"
            sx={fieldSx}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={isPending}
            fullWidth
            sx={{ mt: 1, py: 1.5 }}
          >
            {isPending ? 'signing in...' : 'sign_in()'}
          </Button>
        </Box>

        <Typography
          component="a"
          href="/"
          sx={{
            display: 'block',
            mt: 6,
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '0.65rem',
            color: 'text.secondary',
            textDecoration: 'none',
            letterSpacing: '0.05em',
            '&:hover': { color: '#38bdf8' },
            transition: 'color 0.2s',
          }}
        >
          ← cd /home
        </Typography>
      </Box>
    </Box>
  );
}
