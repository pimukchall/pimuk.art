'use client';

import { useState } from 'react';
import type { Note, Milestone, Prisma } from '@prisma/client';
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
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import PageHeader from '../_components/PageHeader';
import EmptyState from '../_components/EmptyState';
import FormDialog from '../_components/FormDialog';
import AdminCard from '../_components/AdminCard';
import NotesPanel from './NotesPanel';

type TaskWithRelations = Prisma.TaskGetPayload<{ include: { milestone: true; subtasks: true } }>;
type Subtask = TaskWithRelations['subtasks'][number];

const PRIORITY_LABEL: Record<string, string> = {
  URGENT_IMPORTANT: 'ด่วน + สำคัญ',
  NOT_URGENT_IMPORTANT: 'ไม่ด่วน + สำคัญ',
  URGENT_NOT_IMPORTANT: 'ด่วน + ไม่สำคัญ',
  NOT_URGENT_NOT_IMPORTANT: 'ไม่ด่วน + ไม่สำคัญ',
};
const PRIORITY_COLOR: Record<string, string> = {
  URGENT_IMPORTANT: '#f87171',
  NOT_URGENT_IMPORTANT: '#4ade80',
  URGENT_NOT_IMPORTANT: '#facc15',
  NOT_URGENT_NOT_IMPORTANT: '#94a3b8',
};
const PRIORITY_ORDER = ['URGENT_IMPORTANT', 'NOT_URGENT_IMPORTANT', 'URGENT_NOT_IMPORTANT', 'NOT_URGENT_NOT_IMPORTANT'];
const STATUS_LABEL: Record<string, string> = { TODO: 'ยังไม่เริ่ม', IN_PROGRESS: 'กำลังทำ', DONE: 'เสร็จแล้ว' };

const toDateInput = (d: Date | string | null) => (d ? new Date(d).toISOString().slice(0, 10) : '');

const emptyForm = {
  title: '',
  description: '',
  priority: 'NOT_URGENT_NOT_IMPORTANT',
  status: 'TODO',
  dueDate: '',
  milestoneId: '',
};

export default function TasksClient({
  tasks: initial,
  notes,
  milestones,
}: {
  tasks: TaskWithRelations[];
  notes: Note[];
  milestones: Milestone[];
}) {
  const [tasks, setTasks] = useState(initial);
  const [view, setView] = useState<'matrix' | 'done'>('matrix');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TaskWithRelations | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [subtaskInputs, setSubtaskInputs] = useState<Record<string, string>>({});
  const [dragId, setDragId] = useState<string | null>(null);

  const f = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const openCreate = (priority?: string) => {
    setEditing(null);
    setForm({ ...emptyForm, priority: priority ?? emptyForm.priority });
    setOpen(true);
  };

  const openEdit = (t: TaskWithRelations) => {
    setEditing(t);
    setForm({
      title: t.title,
      description: t.description ?? '',
      priority: t.priority,
      status: t.status,
      dueDate: toDateInput(t.dueDate),
      milestoneId: t.milestoneId ?? '',
    });
    setOpen(true);
  };

  const openFromNote = (note: Note) => {
    setEditing(null);
    setForm({ ...emptyForm, title: note.content });
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      description: form.description || null,
      priority: form.priority,
      status: form.status,
      dueDate: form.dueDate || null,
      milestoneId: form.milestoneId || null,
    };

    try {
      if (editing) {
        const res = await fetch(`/api/tasks/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`บันทึกไม่สำเร็จ (${res.status})`);
        const updated = await res.json();
        setTasks((prev) => prev.map((t) => (t.id === editing.id ? { ...t, ...updated, subtasks: t.subtasks } : t)));
      } else {
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`บันทึกไม่สำเร็จ (${res.status})`);
        const created = await res.json();
        setTasks((prev) => [...prev, { ...created, milestone: null, subtasks: [] }]);
      }
      setOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ลบ task นี้?')) return;
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert(`ลบไม่สำเร็จ (${res.status})`);
      return;
    }
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const setStatus = async (t: TaskWithRelations, status: string) => {
    const res = await fetch(`/api/tasks/${t.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: t.title, description: t.description, priority: t.priority, status,
        dueDate: toDateInput(t.dueDate) || null, milestoneId: t.milestoneId,
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setTasks((prev) => prev.map((x) => (x.id === t.id ? { ...x, ...updated, subtasks: x.subtasks } : x)));
    }
  };

  const cycleStatus = (t: TaskWithRelations) => {
    const order = ['TODO', 'IN_PROGRESS', 'DONE'];
    setStatus(t, order[(order.indexOf(t.status) + 1) % order.length]);
  };

  // ── Subtasks ─────────────────────────────────────────────
  const addSubtask = async (parent: TaskWithRelations) => {
    const title = (subtaskInputs[parent.id] ?? '').trim();
    if (!title) return;
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, priority: parent.priority, parentTaskId: parent.id, order: parent.subtasks.length }),
    });
    if (!res.ok) return;
    const created: Subtask = await res.json();
    setTasks((prev) => prev.map((t) => (t.id === parent.id ? { ...t, subtasks: [...t.subtasks, created] } : t)));
    setSubtaskInputs((prev) => ({ ...prev, [parent.id]: '' }));
  };

  const cycleSubtaskStatus = async (parent: TaskWithRelations, sub: Subtask) => {
    const order = ['TODO', 'IN_PROGRESS', 'DONE'];
    const status = order[(order.indexOf(sub.status) + 1) % order.length];
    const res = await fetch(`/api/tasks/${sub.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: sub.title, description: sub.description, priority: sub.priority, status, dueDate: toDateInput(sub.dueDate) || null, milestoneId: sub.milestoneId }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setTasks((prev) => prev.map((t) => (t.id === parent.id ? { ...t, subtasks: t.subtasks.map((s) => (s.id === sub.id ? updated : s)) } : t)));
  };

  const deleteSubtask = async (parent: TaskWithRelations, sub: Subtask) => {
    const res = await fetch(`/api/tasks/${sub.id}`, { method: 'DELETE' });
    if (!res.ok) return;
    setTasks((prev) => prev.map((t) => (t.id === parent.id ? { ...t, subtasks: t.subtasks.filter((s) => s.id !== sub.id) } : t)));
  };

  // ── Drag to reorder within a quadrant ───────────────────
  const handleDrop = async (priority: string, targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const items = tasks.filter((t) => t.priority === priority && t.status !== 'DONE' && !t.parentTaskId);
    const ids = items.map((t) => t.id);
    const fromIdx = ids.indexOf(dragId);
    const toIdx = ids.indexOf(targetId);
    if (fromIdx === -1 || toIdx === -1) return;
    ids.splice(toIdx, 0, ids.splice(fromIdx, 1)[0]);

    const orderMap = new Map(ids.map((id, i) => [id, i]));
    setTasks((prev) => prev.map((t) => (orderMap.has(t.id) ? { ...t, order: orderMap.get(t.id)! } : t)));
    setDragId(null);

    await fetch('/api/tasks/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
  };

  const doneTasks = tasks.filter((t) => t.status === 'DONE');

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 3, md: 6 }, py: { xs: 6, md: 8 } }}>
      <PageHeader
        title="Tasks"
        caption="eisenhower matrix"
        action={
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <ToggleButtonGroup value={view} exclusive size="small" onChange={(_, v) => v && setView(v)}>
              <ToggleButton value="matrix" sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>Matrix</ToggleButton>
              <ToggleButton value="done" sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>Done ({doneTasks.length})</ToggleButton>
            </ToggleButtonGroup>
            <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={() => openCreate()}
              sx={{ borderColor: 'divider', color: 'text.primary', '&:hover': { borderColor: '#38bdf8', color: '#38bdf8' } }}>
              Add Task
            </Button>
          </Box>
        }
      />

      <NotesPanel notes={notes} onConvertToTask={openFromNote} />

      {view === 'done' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {doneTasks.map((t) => (
            <AdminCard key={t.id}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                  <Typography sx={{ fontSize: '0.85rem', textDecoration: 'line-through', color: 'text.secondary' }}>{t.title}</Typography>
                  <Chip label={PRIORITY_LABEL[t.priority]} size="small"
                    sx={{ height: 18, fontSize: '0.6rem', color: PRIORITY_COLOR[t.priority], backgroundColor: `${PRIORITY_COLOR[t.priority]}18`, border: `1px solid ${PRIORITY_COLOR[t.priority]}44` }} />
                </Box>
                <Typography sx={{ fontSize: '0.65rem', color: 'text.disabled', fontFamily: 'monospace' }}>
                  {[t.dueDate && toDateInput(t.dueDate), t.milestone?.title].filter(Boolean).join(' · ')}
                </Typography>
              </Box>
              <IconButton size="small" onClick={() => setStatus(t, 'TODO')} title="เปิดใหม่" sx={{ color: 'text.secondary', '&:hover': { color: '#38bdf8' } }}>
                <RestartAltIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => handleDelete(t.id)} sx={{ color: 'text.secondary', '&:hover': { color: '#f87171' } }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </AdminCard>
          ))}
          {doneTasks.length === 0 && <EmptyState message="ยังไม่มีงานที่เสร็จแล้ว" />}
        </Box>
      )}

      {view === 'matrix' && (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
        {PRIORITY_ORDER.map((priority) => {
          const items = tasks.filter((t) => t.priority === priority && t.status !== 'DONE' && !t.parentTaskId);
          return (
            <Box key={priority} sx={{ border: '1px solid', borderColor: 'divider', p: 2, minHeight: 160 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Chip label={PRIORITY_LABEL[priority]} size="small"
                  sx={{ height: 20, fontSize: '0.65rem', color: PRIORITY_COLOR[priority], backgroundColor: `${PRIORITY_COLOR[priority]}18`, border: `1px solid ${PRIORITY_COLOR[priority]}44` }} />
                <IconButton size="small" onClick={() => openCreate(priority)} sx={{ color: 'text.disabled', '&:hover': { color: '#38bdf8' } }}>
                  <AddIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {items.map((t) => (
                  <Box
                    key={t.id}
                    draggable
                    onDragStart={() => setDragId(t.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(priority, t.id)}
                    sx={{ border: '1px solid', borderColor: 'divider', p: 1.5, opacity: dragId === t.id ? 0.4 : 1 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <DragIndicatorIcon sx={{ fontSize: 16, color: 'text.disabled', cursor: 'grab', mt: '2px' }} />
                      <Box
                        onClick={() => cycleStatus(t)}
                        title={STATUS_LABEL[t.status]}
                        sx={{
                          width: 10, height: 10, borderRadius: '50%', mt: '4px', flexShrink: 0, cursor: 'pointer',
                          backgroundColor: t.status === 'IN_PROGRESS' ? '#facc15' : 'transparent',
                          border: '1.5px solid', borderColor: t.status === 'IN_PROGRESS' ? '#facc15' : 'text.disabled',
                        }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: '0.8rem' }}>{t.title}</Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: 'text.disabled', fontFamily: 'monospace' }}>
                          {[t.dueDate && toDateInput(t.dueDate), t.milestone?.title].filter(Boolean).join(' · ')}
                        </Typography>
                      </Box>
                      <IconButton size="small" onClick={() => openEdit(t)} sx={{ color: 'text.disabled', '&:hover': { color: 'text.primary' } }}>
                        <EditIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(t.id)} sx={{ color: 'text.disabled', '&:hover': { color: '#f87171' } }}>
                        <DeleteIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>

                    {/* Subtasks */}
                    <Box sx={{ pl: 3, mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {t.subtasks.map((s) => (
                        <Box key={s.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            onClick={() => cycleSubtaskStatus(t, s)}
                            title={STATUS_LABEL[s.status]}
                            sx={{
                              width: 8, height: 8, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
                              backgroundColor: s.status === 'DONE' ? '#4ade80' : s.status === 'IN_PROGRESS' ? '#facc15' : 'transparent',
                              border: '1.5px solid', borderColor: s.status === 'DONE' ? '#4ade80' : s.status === 'IN_PROGRESS' ? '#facc15' : 'text.disabled',
                            }}
                          />
                          <Typography sx={{ fontSize: '0.72rem', flex: 1, textDecoration: s.status === 'DONE' ? 'line-through' : 'none', color: s.status === 'DONE' ? 'text.disabled' : 'text.primary' }}>
                            {s.title}
                          </Typography>
                          <IconButton size="small" onClick={() => deleteSubtask(t, s)} sx={{ color: 'text.disabled', '&:hover': { color: '#f87171' } }}>
                            <DeleteIcon sx={{ fontSize: 12 }} />
                          </IconButton>
                        </Box>
                      ))}
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                        <TextField
                          value={subtaskInputs[t.id] ?? ''}
                          onChange={(e) => setSubtaskInputs((prev) => ({ ...prev, [t.id]: e.target.value }))}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSubtask(t); } }}
                          size="small" placeholder="+ subtask"
                          variant="standard"
                          sx={{ flex: 1 }}
                          slotProps={{ htmlInput: { style: { fontSize: '0.7rem' } } }}
                        />
                      </Box>
                    </Box>
                  </Box>
                ))}
                {items.length === 0 && <Typography sx={{ fontSize: '0.7rem', color: 'text.disabled' }}>ไม่มีงาน</Typography>}
              </Box>
            </Box>
          );
        })}
      </Box>
      )}

      <FormDialog open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Task' : 'Add Task'}
        onSave={handleSave} saving={saving} saveDisabled={!form.title.trim()}>
        <TextField label="ชื่องาน *" value={form.title} onChange={(e) => f('title', e.target.value)} size="small" />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <FormControl size="small">
            <InputLabel>ความสำคัญ</InputLabel>
            <Select value={form.priority} label="ความสำคัญ" onChange={(e) => f('priority', e.target.value)}>
              {PRIORITY_ORDER.map((p) => <MenuItem key={p} value={p}>{PRIORITY_LABEL[p]}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel>สถานะ</InputLabel>
            <Select value={form.status} label="สถานะ" onChange={(e) => f('status', e.target.value)}>
              {Object.entries(STATUS_LABEL).map(([value, label]) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <TextField label="กำหนดเสร็จ (ถ้ามี)" value={form.dueDate} onChange={(e) => f('dueDate', e.target.value)} size="small" type="date" slotProps={{ inputLabel: { shrink: true } }} />
          <FormControl size="small">
            <InputLabel>Milestone</InputLabel>
            <Select value={form.milestoneId} label="Milestone" onChange={(e) => f('milestoneId', e.target.value)}>
              <MenuItem value="">— ไม่ระบุ —</MenuItem>
              {milestones.map((m) => <MenuItem key={m.id} value={m.id}>{m.title}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        <TextField label="รายละเอียด" value={form.description} onChange={(e) => f('description', e.target.value)} size="small" multiline rows={2} />
      </FormDialog>
    </Container>
  );
}
