'use client';

import { useState, useTransition, useRef } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Collapse from '@mui/material/Collapse';
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import LockResetIcon from '@mui/icons-material/LockReset';
import AddIcon from '@mui/icons-material/Add';
import { createUserAction, deleteUserAction, changePasswordAction } from './actions';
import PageHeader from '../_components/PageHeader';
import FormDialog from '../_components/FormDialog';
import { fieldSx } from '../_components/fieldSx';

type User = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: Date;
};

function InlineMsg({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <Typography
      sx={{
        fontFamily: 'var(--font-geist-mono), monospace',
        fontSize: '0.7rem',
        color: ok ? '#38bdf8' : '#f87171',
        mt: 1,
      }}
    >
      {ok ? '✓' : '✗'} {msg}
    </Typography>
  );
}

// ── Create User Form ────────────────────────────────────
function CreateUserForm({ onCreated }: { onCreated: (u: User) => void }) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = () => {
    const fd = new FormData();
    fd.set('name', form.name);
    fd.set('email', form.email);
    fd.set('password', form.password);
    startTransition(async () => {
      const res = await createUserAction(fd);
      if (res.error) {
        setMsg({ text: res.error, ok: false });
      } else {
        setForm({ name: '', email: '', password: '' });
        setTimeout(() => { setOpen(false); setMsg(null); window.location.reload(); }, 400);
      }
    });
  };

  return (
    <Box>
      <Button
        variant="outlined"
        size="small"
        startIcon={<AddIcon sx={{ fontSize: 14 }} />}
        onClick={() => { setOpen(true); setMsg(null); }}
        sx={{ borderColor: 'divider', color: 'text.primary', '&:hover': { borderColor: '#38bdf8', color: '#38bdf8' } }}
      >
        Add User
      </Button>

      <FormDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Add User"
        onSave={handleSubmit}
        saving={isPending}
        saveDisabled={!form.email || form.password.length < 8}
      >
        <TextField label="Name (optional)" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} fullWidth size="small" sx={fieldSx} />
        <TextField label="Email *" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} fullWidth size="small" sx={fieldSx} />
        <TextField label="Password * (min 8)" type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} fullWidth size="small" sx={fieldSx} />
        {msg && <InlineMsg msg={msg.text} ok={msg.ok} />}
      </FormDialog>
    </Box>
  );
}

// ── Change Password Form (inline per row) ───────────────
function ChangePasswordRow({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await changePasswordAction(userId, fd);
      if (res.error) {
        setMsg({ text: res.error, ok: false });
      } else {
        setMsg({ text: 'เปลี่ยน password แล้ว', ok: true });
        formRef.current?.reset();
        setTimeout(() => { setOpen(false); setMsg(null); }, 1200);
      }
    });
  };

  return (
    <Box>
      <Tooltip title="change password" placement="top">
        <IconButton
          size="small"
          onClick={() => { setOpen((v) => !v); setMsg(null); }}
          sx={{
            borderRadius: 0,
            border: '1px solid',
            borderColor: open ? '#38bdf8' : 'divider',
            color: open ? '#38bdf8' : 'text.secondary',
            '&:hover': { borderColor: '#38bdf8', color: '#38bdf8' },
            transition: 'all 0.15s',
          }}
        >
          <LockResetIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Tooltip>

      <Collapse in={open}>
        <Box
          component="form"
          ref={formRef}
          onSubmit={handleSubmit}
          sx={{ mt: 1.5, display: 'flex', gap: 1.5, alignItems: 'flex-start', flexWrap: 'wrap' }}
        >
          <TextField
            name="newPassword"
            label="New password"
            type="password"
            size="small"
            required
            sx={{ ...fieldSx, width: 220 }}
          />
          <Button type="submit" variant="outlined" disabled={isPending} size="small" sx={{ fontSize: '0.6rem', py: 0.5, mt: 0.5 }}>
            {isPending ? '...' : 'save'}
          </Button>
          {msg && <InlineMsg msg={msg.text} ok={msg.ok} />}
        </Box>
      </Collapse>
    </Box>
  );
}

// ── Main Component ──────────────────────────────────────
export default function UsersClient({ users: initial, currentUserId }: { users: User[]; currentUserId: string }) {
  const [users, setUsers] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (!confirm('ลบ user นี้?')) return;
    setDeletingId(id);
    startTransition(async () => {
      const res = await deleteUserAction(id);
      if (res.error) {
        alert(res.error);
      } else {
        setUsers((prev) => prev.filter((u) => u.id !== id));
      }
      setDeletingId(null);
    });
  };

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 3, md: 6 }, py: { xs: 6, md: 8 } }}>
      <PageHeader
        title="Users"
        caption="user management"
        action={
          <Typography sx={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.7rem', color: 'text.secondary' }}>
            total: {users.length}
          </Typography>
        }
      />

      {/* Create form */}
      <Box sx={{ mb: 6 }}>
        <CreateUserForm onCreated={(u) => setUsers((prev) => [...prev, u])} />
      </Box>

      {/* Users table */}
      <Box>
        {/* Table header */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr auto', md: '1fr 160px 120px auto' },
            gap: 2,
            px: 2,
            py: 1,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          {['user', 'role', 'created', ''].map((h) => (
            <Typography
              key={h}
              sx={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.6rem', color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}
            >
              {h}
            </Typography>
          ))}
        </Box>

        {users.map((user, i) => {
          const isMe = user.id === currentUserId;
          return (
            <Box
              key={user.id}
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                px: 2,
                py: 2.5,
                backgroundColor: isMe ? 'background.paper' : 'transparent',
                '&:hover': { backgroundColor: 'background.paper' },
                transition: 'background-color 0.15s',
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr auto', md: '1fr 160px 120px auto' },
                  gap: 2,
                  alignItems: 'center',
                }}
              >
                {/* User info */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                    <Typography sx={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.85rem', color: 'text.primary' }}>
                      {user.email}
                    </Typography>
                    {isMe && (
                      <Box sx={{ px: 1, border: '1px solid #38bdf850', fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.55rem', color: '#38bdf8', lineHeight: '18px' }}>
                        you
                      </Box>
                    )}
                  </Box>
                  {user.name && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      {user.name}
                    </Typography>
                  )}
                  {/* Password change (mobile: ใต้ชื่อ) */}
                  <Box sx={{ mt: 1.5, display: { xs: 'block', md: 'none' } }}>
                    <ChangePasswordRow userId={user.id} />
                  </Box>
                </Box>

                {/* Role */}
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Box
                    sx={{
                      display: 'inline-block',
                      px: 1.5,
                      py: 0.25,
                      border: '1px solid #e2e8f0',
                      fontFamily: 'var(--font-geist-mono), monospace',
                      fontSize: '0.6rem',
                      color: '#888',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {user.role.toLowerCase()}
                  </Box>
                </Box>

                {/* Created */}
                <Typography
                  sx={{ display: { xs: 'none', md: 'block' }, fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.65rem', color: '#64748b' }}
                >
                  {new Date(user.createdAt).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: '2-digit' })}
                </Typography>

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                  {/* Password change (desktop) */}
                  <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <ChangePasswordRow userId={user.id} />
                  </Box>

                  {/* Delete */}
                  <Tooltip title={isMe ? 'ไม่สามารถลบตัวเองได้' : 'delete user'} placement="top">
                    <span>
                      <IconButton
                        size="small"
                        disabled={isMe || deletingId === user.id}
                        onClick={() => handleDelete(user.id)}
                        sx={{
                          borderRadius: 0,
                          border: '1px solid',
                          borderColor: 'divider',
                          color: 'text.secondary',
                          '&:hover:not(:disabled)': { borderColor: '#f87171', color: '#f87171' },
                          '&:disabled': { opacity: 0.3 },
                          transition: 'all 0.15s',
                        }}
                      >
                        <DeleteOutlineIcon sx={{ fontSize: 15 }} />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              </Box>

              {/* Password change row (desktop: full width below row) */}
              <Box sx={{ display: { xs: 'none', md: 'block' } }} />
            </Box>
          );
        })}
      </Box>
    </Container>
  );
}
