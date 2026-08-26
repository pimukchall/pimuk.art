'use client';

import { useMemo, useRef, useState } from 'react';
import type { Asset, Category, Prisma } from '@prisma/client';
import RecurringRulesPanel from './RecurringRulesPanel';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PageHeader from '../_components/PageHeader';
import EmptyState from '../_components/EmptyState';
import FormDialog from '../_components/FormDialog';
import AdminCard from '../_components/AdminCard';

type TransactionWithRelations = Prisma.TransactionGetPayload<{
  include: { category: true; fromAsset: true; toAsset: true };
}>;

const TYPE_LABEL: Record<string, string> = { INCOME: 'รายรับ', EXPENSE: 'รายจ่าย', TRANSFER: 'โอนเงิน' };
const TYPE_COLOR: Record<string, string> = { INCOME: '#4ade80', EXPENSE: '#f87171', TRANSFER: '#38bdf8' };

const fmt = (n: number) => n.toLocaleString('th-TH', { maximumFractionDigits: 0 });
const toDateInput = (d: Date | string) => new Date(d).toISOString().slice(0, 10);

const emptyForm = {
  type: 'EXPENSE',
  amount: '' as string | number,
  categoryId: '',
  fromAssetId: '',
  toAssetId: '',
  note: '',
  receiptUrl: '',
  occurredAt: toDateInput(new Date()),
};

type RecurringRuleWithRelations = Prisma.RecurringRuleGetPayload<{
  include: { category: true; fromAsset: true; toAsset: true };
}>;

export default function TransactionsClient({
  transactions: initial,
  assets,
  categories,
  recurringRules,
}: {
  transactions: TransactionWithRelations[];
  assets: Asset[];
  categories: Category[];
  recurringRules: RecurringRuleWithRelations[];
}) {
  const [transactions, setTransactions] = useState(initial);
  const [view, setView] = useState<'list' | 'calendar' | 'recurring'>('list');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TransactionWithRelations | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const f = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (t: TransactionWithRelations) => {
    setEditing(t);
    setForm({
      type: t.type,
      amount: t.amount,
      categoryId: t.categoryId ?? '',
      fromAssetId: t.fromAssetId ?? '',
      toAssetId: t.toAssetId ?? '',
      note: t.note ?? '',
      receiptUrl: t.receiptUrl ?? '',
      occurredAt: toDateInput(t.occurredAt),
    });
    setOpen(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'pimuk-art/receipts');
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error(`อัปโหลดไม่สำเร็จ (${res.status})`);
      const data = await res.json();
      f('receiptUrl', data.url);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'อัปโหลดไม่สำเร็จ');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      type: form.type,
      amount: Number(form.amount) || 0,
      categoryId: form.categoryId || null,
      fromAssetId: form.fromAssetId || null,
      toAssetId: form.toAssetId || null,
      note: form.note || null,
      receiptUrl: form.receiptUrl || null,
      occurredAt: form.occurredAt,
    };

    try {
      if (editing) {
        const res = await fetch(`/api/transactions/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`บันทึกไม่สำเร็จ (${res.status})`);
        const updated = await res.json();
        setTransactions((prev) => prev.map((t) => (t.id === editing.id ? { ...t, ...updated } : t)));
      } else {
        const res = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`บันทึกไม่สำเร็จ (${res.status})`);
        const created = await res.json();
        setTransactions((prev) => [created, ...prev]);
      }
      setOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ลบรายการนี้?')) return;
    const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert(`ลบไม่สำเร็จ (${res.status})`);
      return;
    }
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const visibleTransactions = useMemo(() => {
    if (!selectedDay) return transactions;
    return transactions.filter((t) => toDateInput(t.occurredAt) === selectedDay);
  }, [transactions, selectedDay]);

  // Calendar: current month grid
  const [calMonth, setCalMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const dayTotals = useMemo(() => {
    const map = new Map<string, { income: number; expense: number }>();
    for (const t of transactions) {
      const key = toDateInput(t.occurredAt);
      const entry = map.get(key) ?? { income: 0, expense: 0 };
      if (t.type === 'INCOME') entry.income += t.amount;
      if (t.type === 'EXPENSE') entry.expense += t.amount;
      map.set(key, entry);
    }
    return map;
  }, [transactions]);

  const calendarDays = useMemo(() => {
    const first = new Date(calMonth.year, calMonth.month, 1);
    const startOffset = first.getDay();
    const daysInMonth = new Date(calMonth.year, calMonth.month + 1, 0).getDate();
    const cells: (string | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(toDateInput(new Date(calMonth.year, calMonth.month, d)));
    }
    return cells;
  }, [calMonth]);

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 3, md: 6 }, py: { xs: 6, md: 8 } }}>
      <PageHeader
        title="Transactions"
        action={
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <ToggleButtonGroup value={view} exclusive size="small" onChange={(_, v) => v && setView(v)}>
              <ToggleButton value="list" sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>List</ToggleButton>
              <ToggleButton value="calendar" sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>Calendar</ToggleButton>
              <ToggleButton value="recurring" sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>Recurring</ToggleButton>
            </ToggleButtonGroup>
            {view !== 'recurring' && (
              <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={openCreate}
                sx={{ borderColor: 'divider', color: 'text.primary', '&:hover': { borderColor: '#38bdf8', color: '#38bdf8' } }}>
                Add Transaction
              </Button>
            )}
          </Box>
        }
      />

      {view === 'recurring' && (
        <RecurringRulesPanel rules={recurringRules} assets={assets} categories={categories} />
      )}

      {view === 'calendar' && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <IconButton size="small" onClick={() => setCalMonth((m) => (m.month === 0 ? { year: m.year - 1, month: 11 } : { year: m.year, month: m.month - 1 }))}>‹</IconButton>
            <Typography sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
              {new Date(calMonth.year, calMonth.month).toLocaleDateString('th-TH', { year: 'numeric', month: 'long' })}
            </Typography>
            <IconButton size="small" onClick={() => setCalMonth((m) => (m.month === 11 ? { year: m.year + 1, month: 0 } : { year: m.year, month: m.month + 1 }))}>›</IconButton>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
            {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map((d) => (
              <Typography key={d} sx={{ fontSize: '0.65rem', color: 'text.disabled', textAlign: 'center', fontFamily: 'monospace' }}>{d}</Typography>
            ))}
            {calendarDays.map((day, i) => {
              const totals = day ? dayTotals.get(day) : null;
              const isSelected = day === selectedDay;
              return (
                <Box
                  key={i}
                  onClick={() => day && setSelectedDay(isSelected ? null : day)}
                  sx={{
                    minHeight: 56, p: 0.5, border: '1px solid', borderColor: isSelected ? '#38bdf8' : 'divider',
                    cursor: day ? 'pointer' : 'default', opacity: day ? 1 : 0.3,
                    '&:hover': day ? { borderColor: '#38bdf8' } : {},
                  }}
                >
                  {day && (
                    <>
                      <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>{Number(day.slice(-2))}</Typography>
                      {totals && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.2, mt: 0.3 }}>
                          {totals.income > 0 && <Typography sx={{ fontSize: '0.55rem', color: '#4ade80' }}>+{fmt(totals.income)}</Typography>}
                          {totals.expense > 0 && <Typography sx={{ fontSize: '0.55rem', color: '#f87171' }}>-{fmt(totals.expense)}</Typography>}
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              );
            })}
          </Box>
          {selectedDay && (
            <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', mt: 1.5, fontFamily: 'monospace' }}>
              กำลังกรอง: {selectedDay} · <Box component="span" sx={{ cursor: 'pointer', color: '#38bdf8' }} onClick={() => setSelectedDay(null)}>ล้าง</Box>
            </Typography>
          )}
        </Box>
      )}

      {view !== 'recurring' && (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {visibleTransactions.map((t) => (
          <AdminCard key={t.id}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
                <Chip label={TYPE_LABEL[t.type]} size="small" sx={{ height: 18, fontSize: '0.6rem', color: TYPE_COLOR[t.type], backgroundColor: `${TYPE_COLOR[t.type]}18`, border: `1px solid ${TYPE_COLOR[t.type]}44` }} />
                {t.category && <Typography variant="body2" sx={{ fontWeight: 500 }}>{t.category.name}</Typography>}
                {t.receiptUrl && <ReceiptIcon sx={{ fontSize: 14, color: 'text.disabled' }} />}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                {toDateInput(t.occurredAt)} · {t.fromAsset?.name ?? ''}{t.fromAsset && t.toAsset ? ' → ' : ''}{t.toAsset?.name ?? ''}{t.note ? ` · ${t.note}` : ''}
              </Typography>
            </Box>
            <Typography sx={{ fontWeight: 500, color: TYPE_COLOR[t.type], fontFamily: 'monospace' }}>
              {t.type === 'EXPENSE' ? '-' : t.type === 'INCOME' ? '+' : ''}฿{fmt(t.amount)}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton size="small" onClick={() => openEdit(t)} sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => handleDelete(t.id)} sx={{ color: 'text.secondary', '&:hover': { color: '#f87171' } }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </AdminCard>
        ))}
        {visibleTransactions.length === 0 && <EmptyState message="ยังไม่มีรายการ — กด Add Transaction เพื่อเริ่ม" />}
      </Box>
      )}

      <FormDialog open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Transaction' : 'Add Transaction'}
        onSave={handleSave} saving={saving} saveDisabled={!form.amount}>
          <FormControl size="small">
            <InputLabel>ประเภท</InputLabel>
            <Select value={form.type} label="ประเภท" onChange={(e) => f('type', e.target.value)}>
              {Object.entries(TYPE_LABEL).map(([value, label]) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <TextField label="จำนวนเงิน *" value={form.amount} onChange={(e) => f('amount', e.target.value)} size="small" type="number" />
            <TextField label="วันที่" value={form.occurredAt} onChange={(e) => f('occurredAt', e.target.value)} size="small" type="date" slotProps={{ inputLabel: { shrink: true } }} />
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

          <TextField label="หมายเหตุ" value={form.note} onChange={(e) => f('note', e.target.value)} size="small" multiline rows={2} />

          <Box>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
            <Button size="small" variant="outlined" onClick={() => fileRef.current?.click()} disabled={uploading}
              startIcon={uploading ? <CircularProgress size={14} /> : <ReceiptIcon />}
              sx={{ borderColor: 'divider', color: 'text.secondary' }}>
              {form.receiptUrl ? 'เปลี่ยนใบเสร็จ' : 'แนบใบเสร็จ'}
            </Button>
          </Box>
      </FormDialog>
    </Container>
  );
}
