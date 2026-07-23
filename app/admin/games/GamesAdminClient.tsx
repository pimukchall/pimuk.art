'use client';

import { useState, useRef, useEffect } from 'react';
import type { Game, Dlc } from '@prisma/client';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';

const STATUS_COLOR: Record<string, string> = {
  playing: '#38bdf8',
  completed: '#38bdf8',
  backlog: '#a78bfa',
  dropped: '#f87171',
};

const emptyForm = {
  title: '',
  coverUrl: '',
  platform: '',
  genre: '',
  status: 'backlog',
  rating: '' as string | number,
  hoursPlayed: '' as string | number,
  completedYear: '' as string | number,
  notes: '',
  order: 0,
};

const emptyDlcInput = { name: '', status: 'not_owned' };

export default function GamesAdminClient({ games: initial }: { games: Game[] }) {
  const [games, setGames] = useState(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Game | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [dlcs, setDlcs] = useState<Dlc[]>([]);
  const [dlcInput, setDlcInput] = useState(emptyDlcInput);
  const [dlcSaving, setDlcSaving] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDlcs([]);
    setDlcInput(emptyDlcInput);
    setOpen(true);
  };

  const openEdit = (g: Game) => {
    setEditing(g);
    setForm({
      title: g.title,
      coverUrl: g.coverUrl ?? '',
      platform: g.platform,
      genre: g.genre,
      status: g.status,
      rating: g.rating ?? '',
      hoursPlayed: g.hoursPlayed ?? '',
      completedYear: g.completedYear ?? '',
      notes: g.notes ?? '',
      order: g.order,
    });
    setDlcs([]);
    setDlcInput(emptyDlcInput);
    setOpen(true);
  };

  useEffect(() => {
    if (!open || !editing) return;
    fetch(`/api/games/${editing.id}/dlc`)
      .then((r) => r.ok ? r.json() : [])
      .then(setDlcs)
      .catch(() => {});
  }, [open, editing]);

  const f = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', 'pimuk_art_unsigned');
      fd.append('folder', 'pimuk-art/games');
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: fd }
      );
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
      const data = await res.json();
      if (!data.secure_url) throw new Error('No URL returned from Cloudinary');
      f('coverUrl', data.secure_url);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'อัปโหลดไม่สำเร็จ');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const toNullableNumber = (v: string | number) => {
    const n = Number(v);
    return v === '' || isNaN(n) ? null : n;
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      title: form.title,
      coverUrl: form.coverUrl || null,
      platform: form.platform,
      genre: form.genre,
      status: form.status,
      rating: toNullableNumber(form.rating),
      hoursPlayed: toNullableNumber(form.hoursPlayed),
      completedYear: toNullableNumber(form.completedYear),
      notes: form.notes || null,
      order: Number(form.order) || 0,
    };

    try {
      if (editing) {
        const res = await fetch(`/api/games/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`บันทึกไม่สำเร็จ (${res.status})`);
        const updated = await res.json();
        setGames((prev) => prev.map((g) => (g.id === editing.id ? updated : g)));
      } else {
        const res = await fetch('/api/games', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`บันทึกไม่สำเร็จ (${res.status})`);
        const created = await res.json();
        setGames((prev) => [...prev, created]);
      }
      setOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ลบเกมนี้?')) return;
    const res = await fetch(`/api/games/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert(`ลบไม่สำเร็จ (${res.status})`);
      return;
    }
    setGames((prev) => prev.filter((g) => g.id !== id));
  };

  const addDlc = async () => {
    if (!dlcInput.name.trim() || !editing) return;
    setDlcSaving(true);
    try {
      const res = await fetch(`/api/games/${editing.id}/dlc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: dlcInput.name.trim(), status: dlcInput.status, order: dlcs.length }),
      });
      if (!res.ok) throw new Error(`เพิ่ม DLC ไม่สำเร็จ (${res.status})`);
      const created = await res.json();
      setDlcs((prev) => [...prev, created]);
      setDlcInput(emptyDlcInput);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    }
    setDlcSaving(false);
  };

  const updateDlc = async (dlc: Dlc, patch: Partial<Pick<Dlc, 'name' | 'status'>>) => {
    try {
      const res = await fetch(`/api/games/${dlc.gameId}/dlc/${dlc.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: patch.name ?? dlc.name, status: patch.status ?? dlc.status, completedYear: dlc.completedYear, notes: dlc.notes, order: dlc.order }),
      });
      if (!res.ok) throw new Error(`อัปเดต DLC ไม่สำเร็จ (${res.status})`);
      const updated = await res.json();
      setDlcs((prev) => prev.map((d) => (d.id === dlc.id ? updated : d)));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    }
  };

  const deleteDlc = async (dlc: Dlc) => {
    try {
      const res = await fetch(`/api/games/${dlc.gameId}/dlc/${dlc.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`ลบ DLC ไม่สำเร็จ (${res.status})`);
      setDlcs((prev) => prev.filter((d) => d.id !== dlc.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 3, md: 6 }, py: { xs: 6, md: 8 } }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mb: 6 }}>
        <Box>
          <Typography variant="caption" sx={{ color: '#38bdf8', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
            // admin
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 300 }}>Games</Typography>
        </Box>
        <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={openCreate}
          sx={{ borderColor: '#e2e8f0', color: '#0f172a', '&:hover': { borderColor: '#38bdf8' } }}>
          Add Game
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {games.map((g) => (
          <Box key={g.id} sx={{ border: '1px solid', borderColor: 'divider', p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
            {g.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={g.coverUrl} alt={g.title} style={{ width: 56, height: 75, objectFit: 'cover', flexShrink: 0, borderRadius: 2 }} />
            ) : (
              <Box sx={{ width: 56, height: 75, backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ImageIcon sx={{ color: '#94a3b8' }} />
              </Box>
            )}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                <Typography variant="body1" sx={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.title}</Typography>
                <Chip label={g.status} size="small" sx={{ height: 18, fontSize: '0.6rem', color: STATUS_COLOR[g.status] ?? '#888', backgroundColor: `${STATUS_COLOR[g.status] ?? '#888'}18`, border: `1px solid ${STATUS_COLOR[g.status] ?? '#888'}44` }} />
              </Box>
              <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace' }}>
                {[g.platform, g.genre, g.rating != null && `★ ${g.rating}/10`, `order: ${g.order}`].filter(Boolean).join(' · ')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton size="small" onClick={() => openEdit(g)} sx={{ color: '#64748b', '&:hover': { color: '#0f172a' } }}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => handleDelete(g.id)} sx={{ color: '#64748b', '&:hover': { color: '#f87171' } }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}
        {games.length === 0 && (
          <Typography variant="body2" sx={{ color: '#94a3b8', py: 8, textAlign: 'center' }}>
            ยังไม่มีเกม — กด Add Game เพื่อเริ่ม
          </Typography>
        )}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth
        slotProps={{ paper: { sx: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0' } } }}>
        <DialogTitle sx={{ fontWeight: 300, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editing ? 'Edit Game' : 'Add Game'}
          <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: '#64748b' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          {/* Cover upload */}
          <Box>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box
                onClick={() => fileRef.current?.click()}
                sx={{
                  width: 80, height: 107, flexShrink: 0,
                  border: '1px dashed #e2e8f0', borderRadius: 1, cursor: 'pointer', overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: '#f8fafc',
                  '&:hover': { borderColor: '#38bdf8' },
                  transition: 'border-color 0.15s',
                }}
              >
                {form.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.coverUrl} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : uploading ? (
                  <CircularProgress size={18} />
                ) : (
                  <Box sx={{ textAlign: 'center' }}>
                    <ImageIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                    <Typography sx={{ fontSize: '0.55rem', color: '#94a3b8', mt: 0.5 }}>Cover</Typography>
                  </Box>
                )}
              </Box>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <TextField label="ชื่อเกม *" value={form.title} onChange={(e) => f('title', e.target.value)} size="small" />
                <FormControl size="small">
                  <InputLabel>Status</InputLabel>
                  <Select value={form.status} label="Status" onChange={(e) => f('status', e.target.value)}>
                    <MenuItem value="backlog">Backlog</MenuItem>
                    <MenuItem value="playing">Playing</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="dropped">Dropped</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <TextField label="Platform" value={form.platform} onChange={(e) => f('platform', e.target.value)} size="small" placeholder="PC, PS5, Switch…" />
            <TextField label="Genre" value={form.genre} onChange={(e) => f('genre', e.target.value)} size="small" placeholder="RPG, Action…" />
            <TextField label="Rating (1–10)" value={form.rating} onChange={(e) => f('rating', e.target.value)} size="small" type="number" slotProps={{ htmlInput: { min: 1, max: 10 } }} />
            <TextField label="Hours Played" value={form.hoursPlayed} onChange={(e) => f('hoursPlayed', e.target.value)} size="small" type="number" />
            <TextField label="Completed Year" value={form.completedYear} onChange={(e) => f('completedYear', e.target.value)} size="small" type="number" placeholder="2025" />
            <TextField label="ลำดับ (Order)" value={form.order} onChange={(e) => f('order', Number(e.target.value))} size="small" type="number" />
          </Box>

          <TextField label="Notes" value={form.notes} onChange={(e) => f('notes', e.target.value)} size="small" multiline rows={3} />

          <Divider sx={{ borderColor: '#e2e8f0' }} />

          {/* DLC section */}
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', letterSpacing: '0.08em', display: 'block', mb: 1.5 }}>DLC</Typography>

            {!editing ? (
              <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                บันทึกเกมก่อน แล้วค่อยเพิ่ม DLC
              </Typography>
            ) : (
              <>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1.5 }}>
                  {dlcs.map((dlc) => (
                    <Box key={dlc.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TextField
                        defaultValue={dlc.name}
                        size="small"
                        onBlur={(e) => {
                          const name = e.target.value.trim();
                          if (name && name !== dlc.name) updateDlc(dlc, { name });
                        }}
                        sx={{ flex: 1 }}
                        slotProps={{ htmlInput: { style: { fontSize: '0.78rem' } } }}
                      />
                      <FormControl size="small" sx={{ minWidth: 110 }}>
                        <Select
                          value={dlc.status}
                          onChange={(e) => updateDlc(dlc, { status: e.target.value })}
                          sx={{ fontSize: '0.72rem' }}
                        >
                          <MenuItem value="not_owned">Not Owned</MenuItem>
                          <MenuItem value="owned">Owned</MenuItem>
                          <MenuItem value="completed">Completed</MenuItem>
                        </Select>
                      </FormControl>
                      <IconButton size="small" onClick={() => deleteDlc(dlc)} sx={{ color: '#94a3b8', '&:hover': { color: '#f87171' }, flexShrink: 0 }}>
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  ))}
                  {dlcs.length === 0 && (
                    <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>ยังไม่มี DLC</Typography>
                  )}
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    value={dlcInput.name}
                    onChange={(e) => setDlcInput((p) => ({ ...p, name: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addDlc(); } }}
                    size="small"
                    placeholder="ชื่อ DLC"
                    sx={{ flex: 1 }}
                    slotProps={{ htmlInput: { style: { fontSize: '0.78rem' } } }}
                  />
                  <FormControl size="small" sx={{ minWidth: 110 }}>
                    <Select
                      value={dlcInput.status}
                      onChange={(e) => setDlcInput((p) => ({ ...p, status: e.target.value }))}
                      sx={{ fontSize: '0.72rem' }}
                    >
                      <MenuItem value="not_owned">Not Owned</MenuItem>
                      <MenuItem value="owned">Owned</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                  <IconButton size="small" onClick={addDlc} disabled={dlcSaving || !dlcInput.name.trim()}
                    sx={{ border: '1px solid #e2e8f0', borderRadius: 0, color: '#64748b', '&:hover': { color: '#38bdf8', borderColor: '#38bdf8' }, flexShrink: 0 }}>
                    {dlcSaving ? <CircularProgress size={14} /> : <AddIcon fontSize="small" />}
                  </IconButton>
                </Box>
              </>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: '#64748b' }}>ยกเลิก</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving || !form.title}
            sx={{ backgroundColor: '#38bdf8', color: '#fff', '&:hover': { backgroundColor: '#0ea5e9' }, minWidth: 100 }}>
            {saving ? <CircularProgress size={18} /> : 'บันทึก'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
