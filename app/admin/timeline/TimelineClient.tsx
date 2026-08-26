'use client';

import { useEffect, useState } from 'react';
import type { Milestone, Task } from '@prisma/client';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PageHeader from '../_components/PageHeader';
import EmptyState from '../_components/EmptyState';
import FormDialog from '../_components/FormDialog';
import AdminCard from '../_components/AdminCard';

const STATUS_LABEL: Record<string, string> = { PLANNED: 'วางแผน', IN_PROGRESS: 'กำลังทำ', DONE: 'เสร็จแล้ว' };
const STATUS_COLOR: Record<string, string> = { PLANNED: '#94a3b8', IN_PROGRESS: '#facc15', DONE: '#4ade80' };

const toDateInput = (d: Date | string | null) => (d ? new Date(d).toISOString().slice(0, 10) : '');

const emptyForm = { title: '', description: '', targetDate: '', status: 'PLANNED' };

function MilestoneTasks({ milestoneId }: { milestoneId: string }) {
  const [tasks, setTasks] = useState<Task[] | null>(null);

  useEffect(() => {
    fetch(`/api/tasks?milestoneId=${milestoneId}`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setTasks)
      .catch(() => setTasks([]));
  }, [milestoneId]);

  if (tasks === null) {
    return <CircularProgress size={14} sx={{ mt: 1 }} />;
  }

  if (tasks.length === 0) {
    return <Typography sx={{ fontSize: '0.7rem', color: 'text.disabled', mt: 1 }}>ยังไม่มี task ที่ผูกกับเป้าหมายนี้</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mt: 1.5, pl: 1 }}>
      {tasks.map((t) => (
        <Box key={t.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: t.status === 'DONE' ? '#4ade80' : 'text.disabled' }} />
          <Typography sx={{ fontSize: '0.75rem', textDecoration: t.status === 'DONE' ? 'line-through' : 'none', color: t.status === 'DONE' ? 'text.disabled' : 'text.primary' }}>
            {t.title}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export default function TimelineClient({ milestones: initial }: { milestones: Milestone[] }) {
  const [milestones, setMilestones] = useState(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Milestone | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const f = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (m: Milestone) => {
    setEditing(m);
    setForm({ title: m.title, description: m.description ?? '', targetDate: toDateInput(m.targetDate), status: m.status });
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      description: form.description || null,
      targetDate: form.targetDate || null,
      status: form.status,
    };

    try {
      if (editing) {
        const res = await fetch(`/api/milestones/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`บันทึกไม่สำเร็จ (${res.status})`);
        const updated = await res.json();
        setMilestones((prev) => prev.map((m) => (m.id === editing.id ? updated : m)));
      } else {
        const res = await fetch('/api/milestones', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`บันทึกไม่สำเร็จ (${res.status})`);
        const created = await res.json();
        setMilestones((prev) => [...prev, created]);
      }
      setOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ลบเป้าหมายนี้?')) return;
    const res = await fetch(`/api/milestones/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert(`ลบไม่สำเร็จ (${res.status})`);
      return;
    }
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const sorted = [...milestones].sort((a, b) => {
    if (!a.targetDate) return 1;
    if (!b.targetDate) return -1;
    return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
  });

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 3, md: 6 }, py: { xs: 6, md: 8 } }}>
      <PageHeader
        title="Timeline"
        caption="milestone roadmap"
        action={
          <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={openCreate}
            sx={{ borderColor: 'divider', color: 'text.primary', '&:hover': { borderColor: '#38bdf8', color: '#38bdf8' } }}>
            Add Milestone
          </Button>
        }
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {sorted.map((m) => {
          const isExpanded = expanded === m.id;
          return (
            <AdminCard key={m.id} sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, width: '100%' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{m.title}</Typography>
                    <Chip label={STATUS_LABEL[m.status]} size="small"
                      sx={{ height: 18, fontSize: '0.6rem', color: STATUS_COLOR[m.status], backgroundColor: `${STATUS_COLOR[m.status]}18`, border: `1px solid ${STATUS_COLOR[m.status]}44` }} />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                    {m.targetDate ? toDateInput(m.targetDate) : 'ไม่ระบุวันที่'}
                  </Typography>
                </Box>
                <IconButton size="small" onClick={() => setExpanded(isExpanded ? null : m.id)} sx={{ color: 'text.secondary' }}>
                  {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                </IconButton>
                <IconButton size="small" onClick={() => openEdit(m)} sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(m.id)} sx={{ color: 'text.secondary', '&:hover': { color: '#f87171' } }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
              {isExpanded && <MilestoneTasks milestoneId={m.id} />}
            </AdminCard>
          );
        })}
        {sorted.length === 0 && <EmptyState message="ยังไม่มีเป้าหมาย — กด Add Milestone เพื่อเริ่ม" />}
      </Box>

      <FormDialog open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Milestone' : 'Add Milestone'}
        onSave={handleSave} saving={saving} saveDisabled={!form.title.trim()}>
        <TextField label="ชื่อเป้าหมาย *" value={form.title} onChange={(e) => f('title', e.target.value)} size="small" />
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <TextField label="วันที่เป้าหมาย" value={form.targetDate} onChange={(e) => f('targetDate', e.target.value)} size="small" type="date" slotProps={{ inputLabel: { shrink: true } }} />
          <FormControl size="small">
            <InputLabel>สถานะ</InputLabel>
            <Select value={form.status} label="สถานะ" onChange={(e) => f('status', e.target.value)}>
              {Object.entries(STATUS_LABEL).map(([value, label]) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <TextField label="รายละเอียด" value={form.description} onChange={(e) => f('description', e.target.value)} size="small" multiline rows={3} />
      </FormDialog>
    </Container>
  );
}
