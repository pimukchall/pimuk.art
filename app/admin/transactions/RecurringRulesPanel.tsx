'use client';

import { useState } from 'react';
import type { Asset, Category, Prisma } from '@prisma/client';
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
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EmptyState from '../_components/EmptyState';
import FormDialog from '../_components/FormDialog';
import AdminCard from '../_components/AdminCard';

type RecurringRuleWithRelations = Prisma.RecurringRuleGetPayload<{
  include: { category: true; fromAsset: true; toAsset: true };
}>;

const TYPE_LABEL: Record<string, string> = { INCOME: 'รายรับ', EXPENSE: 'รายจ่าย', TRANSFER: 'โอนเงิน' };
const TYPE_COLOR: Record<string, string> = { INCOME: '#4ade80', EXPENSE: '#f87171', TRANSFER: '#38bdf8' };
const FREQ_LABEL: Record<string, string> = { DAILY: 'รายวัน', WEEKLY: 'รายสัปดาห์', MONTHLY: 'รายเดือน', YEARLY: 'รายปี' };

const fmt = (n: number) => n.toLocaleString('th-TH', { maximumFractionDigits: 0 });
const toDateInput = (d: Date | string) => new Date(d).toISOString().slice(0, 10);
const daysUntil = (d: Date | string) => Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000);

function NextRunChip({ nextRunAt }: { nextRunAt: Date | string }) {
  const days = daysUntil(nextRunAt);
  if (days < 0) return <Chip label="เลยกำหนดตัดเงิน" size="small" sx={{ height: 18, fontSize: '0.6rem', color: '#f87171', backgroundColor: '#f8717118', border: '1px solid #f8717144' }} />;
  if (days <= 7) return <Chip label={days === 0 ? 'ตัดเงินวันนี้' : `ตัดเงินใน ${days} วัน`} size="small" sx={{ height: 18, fontSize: '0.6rem', color: '#facc15', backgroundColor: '#facc1518', border: '1px solid #facc1544' }} />;
  return null;
}

const emptyForm = {
  title: '',
  type: 'EXPENSE',
  amount: '' as string | number,
  categoryId: '',
  fromAssetId: '',
  toAssetId: '',
  note: '',
  frequency: 'MONTHLY',
  interval: 1,
  startDate: toDateInput(new Date()),
  endDate: '',
  nextRunAt: toDateInput(new Date()),
  active: true,
};

export default function RecurringRulesPanel({
  rules: initial,
  assets,
  categories,
}: {
  rules: RecurringRuleWithRelations[];
  assets: Asset[];
  categories: Category[];
}) {
  const [rules, setRules] = useState(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<RecurringRuleWithRelations | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);

  const f = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (r: RecurringRuleWithRelations) => {
    setEditing(r);
    setForm({
      title: r.title,
      type: r.type,
      amount: r.amount,
      categoryId: r.categoryId ?? '',
      fromAssetId: r.fromAssetId ?? '',
      toAssetId: r.toAssetId ?? '',
      note: r.note ?? '',
      frequency: r.frequency,
      interval: r.interval,
      startDate: toDateInput(r.startDate),
      endDate: r.endDate ? toDateInput(r.endDate) : '',
      nextRunAt: toDateInput(r.nextRunAt),
      active: r.active,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      type: form.type,
      amount: Number(form.amount) || 0,
      categoryId: form.categoryId || null,
      fromAssetId: form.fromAssetId || null,
      toAssetId: form.toAssetId || null,
      note: form.note || null,
      frequency: form.frequency,
      interval: Number(form.interval) || 1,
      startDate: form.startDate,
      endDate: form.endDate || null,
      nextRunAt: form.nextRunAt,
      active: form.active,
    };

    try {
      if (editing) {
        const res = await fetch(`/api/recurring-rules/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? `บันทึกไม่สำเร็จ (${res.status})`);
        }
        const updated = await res.json();
        setRules((prev) => prev.map((r) => (r.id === editing.id ? updated : r)));
      } else {
        const res = await fetch('/api/recurring-rules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? `บันทึกไม่สำเร็จ (${res.status})`);
        }
        const created = await res.json();
        setRules((prev) => [...prev, created]);
      }
      setOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ลบรายการประจำนี้?')) return;
    const res = await fetch(`/api/recurring-rules/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert(`ลบไม่สำเร็จ (${res.status})`);
      return;
    }
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRunNow = async () => {
    setRunning(true);
    try {
      const res = await fetch('/api/recurring-rules/run', { method: 'POST' });
      if (!res.ok) throw new Error(`รันไม่สำเร็จ (${res.status})`);
      const result = await res.json();
      alert(`ประมวลผล ${result.processed} รายการ สร้างธุรกรรม ${result.transactionsCreated} รายการ`);
      window.location.reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    }
    setRunning(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mb: 3 }}>
        <Button startIcon={running ? <CircularProgress size={14} /> : <PlayArrowIcon />} variant="outlined" size="small" onClick={handleRunNow} disabled={running}
          sx={{ borderColor: 'divider', color: 'text.secondary' }}>
          รันรายการที่ถึงกำหนด
        </Button>
        <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={openCreate}
          sx={{ borderColor: 'divider', color: 'text.primary', '&:hover': { borderColor: '#38bdf8', color: '#38bdf8' } }}>
          Add Recurring
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {rules.map((r) => (
          <AdminCard key={r.id} faded={!r.active}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{r.title}</Typography>
                <Chip label={TYPE_LABEL[r.type]} size="small" sx={{ height: 18, fontSize: '0.6rem', color: TYPE_COLOR[r.type], backgroundColor: `${TYPE_COLOR[r.type]}18`, border: `1px solid ${TYPE_COLOR[r.type]}44` }} />
                <Chip label={FREQ_LABEL[r.frequency]} size="small" sx={{ height: 18, fontSize: '0.6rem' }} />
                {r.active && <NextRunChip nextRunAt={r.nextRunAt} />}
                {!r.active && <Chip label="ปิดใช้งาน" size="small" sx={{ height: 18, fontSize: '0.6rem' }} />}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                ฿{fmt(r.amount)} · ครั้งถัดไป {toDateInput(r.nextRunAt)}{r.category ? ` · ${r.category.name}` : ''}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton size="small" onClick={() => openEdit(r)} sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => handleDelete(r.id)} sx={{ color: 'text.secondary', '&:hover': { color: '#f87171' } }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </AdminCard>
        ))}
        {rules.length === 0 && <EmptyState message="ยังไม่มีรายการประจำ — กด Add Recurring เพื่อเริ่ม" />}
      </Box>

      <FormDialog open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Recurring' : 'Add Recurring'}
        onSave={handleSave} saving={saving} saveDisabled={!form.title.trim() || !form.amount}>
        <TextField label="ชื่อรายการ *" value={form.title} onChange={(e) => f('title', e.target.value)} size="small" placeholder="เช่น ค่าเน็ต, iCloud, Netflix" />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <FormControl size="small">
            <InputLabel>ประเภท</InputLabel>
            <Select value={form.type} label="ประเภท" onChange={(e) => f('type', e.target.value)}>
              {Object.entries(TYPE_LABEL).map(([value, label]) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField label="จำนวนเงิน *" value={form.amount} onChange={(e) => f('amount', e.target.value)} size="small" type="number" />
        </Box>

        <FormControl size="small">
          <InputLabel>หมวดหมู่</InputLabel>
          <Select value={form.categoryId} label="หมวดหมู่" onChange={(e) => f('categoryId', e.target.value)}>
            <MenuItem value="">— ไม่ระบุ —</MenuItem>
            {categories.filter((c) => c.type === form.type).map((c) => (
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          {(form.type === 'EXPENSE' || form.type === 'TRANSFER') && (
            <FormControl size="small">
              <InputLabel>จากบัญชี</InputLabel>
              <Select value={form.fromAssetId} label="จากบัญชี" onChange={(e) => f('fromAssetId', e.target.value)}>
                <MenuItem value="">— ไม่ระบุ —</MenuItem>
                {assets.map((a) => <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>)}
              </Select>
            </FormControl>
          )}
          {(form.type === 'INCOME' || form.type === 'TRANSFER') && (
            <FormControl size="small">
              <InputLabel>เข้าบัญชี</InputLabel>
              <Select value={form.toAssetId} label="เข้าบัญชี" onChange={(e) => f('toAssetId', e.target.value)}>
                <MenuItem value="">— ไม่ระบุ —</MenuItem>
                {assets.map((a) => <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>)}
              </Select>
            </FormControl>
          )}
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <FormControl size="small">
            <InputLabel>ความถี่</InputLabel>
            <Select value={form.frequency} label="ความถี่" onChange={(e) => f('frequency', e.target.value)}>
              {Object.entries(FREQ_LABEL).map(([value, label]) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField label="ทุกกี่รอบ (interval)" value={form.interval} onChange={(e) => f('interval', Number(e.target.value))} size="small" type="number" slotProps={{ htmlInput: { min: 1 } }} />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <TextField label="ครั้งถัดไป (Next Run)" value={form.nextRunAt} onChange={(e) => f('nextRunAt', e.target.value)} size="small" type="date" slotProps={{ inputLabel: { shrink: true } }} />
          <TextField label="สิ้นสุด (ถ้ามี)" value={form.endDate} onChange={(e) => f('endDate', e.target.value)} size="small" type="date" slotProps={{ inputLabel: { shrink: true } }} />
        </Box>

        <TextField label="เริ่มตั้งแต่ (Start Date)" value={form.startDate} onChange={(e) => f('startDate', e.target.value)} size="small" type="date" slotProps={{ inputLabel: { shrink: true } }} />
        <TextField label="หมายเหตุ" value={form.note} onChange={(e) => f('note', e.target.value)} size="small" multiline rows={2} />
        <FormControlLabel control={<Switch checked={form.active} onChange={(e) => f('active', e.target.checked)} size="small" />} label="เปิดใช้งาน" />
      </FormDialog>
    </Box>
  );
}
