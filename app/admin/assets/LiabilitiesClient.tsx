'use client';

import { useState } from 'react';
import type { Liability } from '@prisma/client';
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
  CREDIT_CARD: 'บัตรเครดิต',
  LOAN: 'สินเชื่อ',
  INSTALLMENT: 'ผ่อนชำระ',
  OTHER: 'อื่นๆ',
};

const emptyForm = {
  name: '',
  type: 'LOAN',
  originalAmount: '' as string | number,
  currentBalance: '' as string | number,
  interestRate: '' as string | number,
  dueDay: '' as string | number,
  note: '',
  order: 0,
};

const fmt = (n: number) => n.toLocaleString('th-TH', { maximumFractionDigits: 0 });

export default function LiabilitiesClient({ liabilities, setLiabilities }: { liabilities: Liability[]; setLiabilities: React.Dispatch<React.SetStateAction<Liability[]>> }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Liability | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const f = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toNullableNumber = (v: string | number) => {
    const n = Number(v);
    return v === '' || isNaN(n) ? null : n;
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (l: Liability) => {
    setEditing(l);
    setForm({
      name: l.name,
      type: l.type,
      originalAmount: l.originalAmount,
      currentBalance: l.currentBalance,
      interestRate: l.interestRate ?? '',
      dueDay: l.dueDay ?? '',
      note: l.note ?? '',
      order: l.order,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      name: form.name,
      type: form.type,
      originalAmount: Number(form.originalAmount) || 0,
      currentBalance: Number(form.currentBalance) || 0,
      interestRate: toNullableNumber(form.interestRate),
      dueDay: toNullableNumber(form.dueDay),
      note: form.note || null,
      order: Number(form.order) || 0,
      archived: editing?.archived ?? false,
    };

    try {
      if (editing) {
        const res = await fetch(`/api/liabilities/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`บันทึกไม่สำเร็จ (${res.status})`);
        const updated = await res.json();
        setLiabilities((prev) => prev.map((l) => (l.id === editing.id ? updated : l)));
      } else {
        const res = await fetch('/api/liabilities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`บันทึกไม่สำเร็จ (${res.status})`);
        const created = await res.json();
        setLiabilities((prev) => [...prev, created]);
      }
      setOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ลบหนี้สินนี้?')) return;
    const res = await fetch(`/api/liabilities/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert(`ลบไม่สำเร็จ (${res.status})`);
      return;
    }
    setLiabilities((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={openCreate}
          sx={{ borderColor: 'divider', color: 'text.primary', '&:hover': { borderColor: '#38bdf8', color: '#38bdf8' } }}>
          Add Liability
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {liabilities.map((l) => (
          <AdminCard key={l.id} faded={l.archived}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{l.name}</Typography>
                <Chip label={TYPE_LABEL[l.type] ?? l.type} size="small" sx={{ height: 18, fontSize: '0.6rem', color: '#f87171', backgroundColor: '#f8717118', border: '1px solid #f8717144' }} />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                ฿{fmt(l.currentBalance)}{l.dueDay ? ` · ครบกำหนดวันที่ ${l.dueDay}` : ''}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton size="small" onClick={() => openEdit(l)} sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => handleDelete(l.id)} sx={{ color: 'text.secondary', '&:hover': { color: '#f87171' } }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </AdminCard>
        ))}
        {liabilities.length === 0 && <EmptyState message="ยังไม่มีหนี้สิน — กด Add Liability เพื่อเริ่ม" />}
      </Box>

      <FormDialog open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Liability' : 'Add Liability'}
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
            <TextField label="ยอดเริ่มต้น" value={form.originalAmount} onChange={(e) => f('originalAmount', e.target.value)} size="small" type="number" />
            <TextField label="ยอดคงเหลือ" value={form.currentBalance} onChange={(e) => f('currentBalance', e.target.value)} size="small" type="number" />
            <TextField label="ดอกเบี้ย (%)" value={form.interestRate} onChange={(e) => f('interestRate', e.target.value)} size="small" type="number" />
            <TextField label="วันครบกำหนด (1-31)" value={form.dueDay} onChange={(e) => f('dueDay', e.target.value)} size="small" type="number" slotProps={{ htmlInput: { min: 1, max: 31 } }} />
          </Box>
          <TextField label="หมายเหตุ" value={form.note} onChange={(e) => f('note', e.target.value)} size="small" multiline rows={2} />
          <TextField label="ลำดับ (Order)" value={form.order} onChange={(e) => f('order', Number(e.target.value))} size="small" type="number" />
      </FormDialog>
    </Box>
  );
}
