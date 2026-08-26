'use client';

import { useState } from 'react';
import type { Asset } from '@prisma/client';
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
  CASH: 'เงินสด',
  BANK: 'บัญชีธนาคาร',
  INVESTMENT: 'การลงทุน',
  PROPERTY: 'อสังหาฯ/ทรัพย์สิน',
  OTHER: 'อื่นๆ',
};

const TYPE_COLOR: Record<string, string> = {
  CASH: '#4ade80',
  BANK: '#38bdf8',
  INVESTMENT: '#a78bfa',
  PROPERTY: '#fb923c',
  OTHER: '#94a3b8',
};

const emptyForm = {
  name: '',
  type: 'BANK',
  initialValue: '' as string | number,
  currentValue: '' as string | number,
  note: '',
  order: 0,
};

const fmt = (n: number) => n.toLocaleString('th-TH', { maximumFractionDigits: 0 });

export default function AssetsClient({ assets, setAssets }: { assets: Asset[]; setAssets: React.Dispatch<React.SetStateAction<Asset[]>> }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Asset | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const f = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (a: Asset) => {
    setEditing(a);
    setForm({
      name: a.name,
      type: a.type,
      initialValue: a.initialValue,
      currentValue: a.currentValue,
      note: a.note ?? '',
      order: a.order,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      name: form.name,
      type: form.type,
      initialValue: Number(form.initialValue) || 0,
      currentValue: Number(form.currentValue) || 0,
      note: form.note || null,
      order: Number(form.order) || 0,
      archived: editing?.archived ?? false,
    };

    try {
      if (editing) {
        const res = await fetch(`/api/assets/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`บันทึกไม่สำเร็จ (${res.status})`);
        const updated = await res.json();
        setAssets((prev) => prev.map((a) => (a.id === editing.id ? updated : a)));
      } else {
        const res = await fetch('/api/assets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`บันทึกไม่สำเร็จ (${res.status})`);
        const created = await res.json();
        setAssets((prev) => [...prev, created]);
      }
      setOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ลบทรัพย์สินนี้?')) return;
    const res = await fetch(`/api/assets/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert(`ลบไม่สำเร็จ (${res.status})`);
      return;
    }
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={openCreate}
          sx={{ borderColor: 'divider', color: 'text.primary', '&:hover': { borderColor: '#38bdf8', color: '#38bdf8' } }}>
          Add Asset
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {assets.map((a) => (
          <AdminCard key={a.id} faded={a.archived}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{a.name}</Typography>
                <Chip label={TYPE_LABEL[a.type] ?? a.type} size="small" sx={{ height: 18, fontSize: '0.6rem', color: TYPE_COLOR[a.type] ?? '#888', backgroundColor: `${TYPE_COLOR[a.type] ?? '#888'}18`, border: `1px solid ${TYPE_COLOR[a.type] ?? '#888'}44` }} />
                {a.archived && <Chip label="archived" size="small" sx={{ height: 18, fontSize: '0.6rem' }} />}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                ฿{fmt(a.currentValue)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton size="small" onClick={() => openEdit(a)} sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => handleDelete(a.id)} sx={{ color: 'text.secondary', '&:hover': { color: '#f87171' } }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </AdminCard>
        ))}
        {assets.length === 0 && <EmptyState message="ยังไม่มีทรัพย์สิน — กด Add Asset เพื่อเริ่ม" />}
      </Box>

      <FormDialog open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Asset' : 'Add Asset'}
        onSave={handleSave} saving={saving} saveDisabled={!form.name}>
          <TextField label="ชื่อ *" value={form.name} onChange={(e) => f('name', e.target.value)} size="small" />
          <FormControl size="small">
            <InputLabel>ประเภท</InputLabel>
            <Select value={form.type} label="ประเภท" onChange={(e) => f('type', e.target.value)}>
              {Object.entries(TYPE_LABEL).map(([value, label]) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <TextField label="มูลค่าเริ่มต้น" value={form.initialValue} onChange={(e) => f('initialValue', e.target.value)} size="small" type="number" />
            <TextField label="มูลค่าปัจจุบัน" value={form.currentValue} onChange={(e) => f('currentValue', e.target.value)} size="small" type="number" />
          </Box>
          <TextField label="หมายเหตุ" value={form.note} onChange={(e) => f('note', e.target.value)} size="small" multiline rows={2} />
          <TextField label="ลำดับ (Order)" value={form.order} onChange={(e) => f('order', Number(e.target.value))} size="small" type="number" />
      </FormDialog>
    </Box>
  );
}
