'use client';

import { useState } from 'react';
import type { Category } from '@prisma/client';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmptyState from '../_components/EmptyState';
import FormDialog from '../_components/FormDialog';
import AdminCard from '../_components/AdminCard';

const TYPE_LABEL: Record<string, string> = {
  INCOME: 'รายรับ',
  EXPENSE: 'รายจ่าย',
  TRANSFER: 'โอนเงิน',
};

const TYPE_COLOR: Record<string, string> = {
  INCOME: '#4ade80',
  EXPENSE: '#f87171',
  TRANSFER: '#38bdf8',
};

const emptyForm = { name: '', type: 'EXPENSE', order: 0 };

export default function CategoriesClient({ categories, setCategories }: { categories: Category[]; setCategories: React.Dispatch<React.SetStateAction<Category[]>> }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const f = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setForm({ name: c.name, type: c.type, order: c.order });
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = { name: form.name, type: form.type, order: Number(form.order) || 0 };

    try {
      if (editing) {
        const res = await fetch(`/api/categories/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`บันทึกไม่สำเร็จ (${res.status})`);
        const updated = await res.json();
        setCategories((prev) => prev.map((c) => (c.id === editing.id ? updated : c)));
      } else {
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`บันทึกไม่สำเร็จ (${res.status})`);
        const created = await res.json();
        setCategories((prev) => [...prev, created]);
      }
      setOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ลบหมวดหมู่นี้?')) return;
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert(`ลบไม่สำเร็จ (${res.status})`);
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={openCreate}
          sx={{ borderColor: 'divider', color: 'text.primary', '&:hover': { borderColor: '#38bdf8', color: '#38bdf8' } }}>
          Add Category
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {categories.map((c) => (
          <AdminCard key={c.id}>
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{c.name}</Typography>
              <Chip label={TYPE_LABEL[c.type] ?? c.type} size="small" sx={{ height: 18, fontSize: '0.6rem', color: TYPE_COLOR[c.type] ?? '#888', backgroundColor: `${TYPE_COLOR[c.type] ?? '#888'}18`, border: `1px solid ${TYPE_COLOR[c.type] ?? '#888'}44` }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton size="small" onClick={() => openEdit(c)} sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => handleDelete(c.id)} sx={{ color: 'text.secondary', '&:hover': { color: '#f87171' } }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </AdminCard>
        ))}
        {categories.length === 0 && <EmptyState message="ยังไม่มีหมวดหมู่ — กด Add Category เพื่อเริ่ม" />}
      </Box>

      <FormDialog open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Category' : 'Add Category'}
        onSave={handleSave} saving={saving} saveDisabled={!form.name} maxWidth="xs">
          <TextField label="ชื่อ *" value={form.name} onChange={(e) => f('name', e.target.value)} size="small" />
          <FormControl size="small">
            <InputLabel>ประเภท</InputLabel>
            <Select value={form.type} label="ประเภท" onChange={(e) => f('type', e.target.value)}>
              {Object.entries(TYPE_LABEL).map(([value, label]) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField label="ลำดับ (Order)" value={form.order} onChange={(e) => f('order', Number(e.target.value))} size="small" type="number" />
      </FormDialog>
    </Box>
  );
}
