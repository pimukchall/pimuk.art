'use client';

import { useEffect, useState } from 'react';
import type { License, LicenseSeat, ITAsset, Prisma } from '@prisma/client';
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
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import PageHeader from '../_components/PageHeader';
import EmptyState from '../_components/EmptyState';
import FormDialog from '../_components/FormDialog';
import AdminCard from '../_components/AdminCard';

type LicenseWithSeats = Prisma.LicenseGetPayload<{ include: { seats: true } }>;
type SeatWithAsset = Prisma.LicenseSeatGetPayload<{ include: { itAsset: true } }>;

const BILLING_LABEL: Record<string, string> = { ONE_TIME: 'จ่ายครั้งเดียว', MONTHLY: 'รายเดือน', YEARLY: 'รายปี' };

const emptyForm = {
  name: '',
  vendor: '',
  licenseKey: '',
  seatsTotal: 1 as string | number,
  cost: '' as string | number,
  billingCycle: 'YEARLY',
  purchaseDate: '',
  renewalDate: '',
  autoRenew: false,
  note: '',
  order: 0,
};

const toDateInput = (d: Date | string | null) => (d ? new Date(d).toISOString().slice(0, 10) : '');
const daysUntil = (d: Date | string) => Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000);
const fmt = (n: number) => n.toLocaleString('th-TH', { maximumFractionDigits: 0 });

function RenewalChip({ renewalDate }: { renewalDate: Date | string | null }) {
  if (!renewalDate) return null;
  const days = daysUntil(renewalDate);
  if (days < 0) return <Chip label="เลยกำหนดต่ออายุ" size="small" sx={{ height: 18, fontSize: '0.6rem', color: '#f87171', backgroundColor: '#f8717118', border: '1px solid #f8717144' }} />;
  if (days <= 30) return <Chip label={`ต่ออายุใน ${days} วัน`} size="small" sx={{ height: 18, fontSize: '0.6rem', color: '#facc15', backgroundColor: '#facc1518', border: '1px solid #facc1544' }} />;
  return null;
}

export default function LicensesClient({ licenses: initial }: { licenses: LicenseWithSeats[] }) {
  const [licenses, setLicenses] = useState(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<LicenseWithSeats | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [viewArchived, setViewArchived] = useState(false);

  const [seats, setSeats] = useState<SeatWithAsset[]>([]);
  const [seatInput, setSeatInput] = useState({ assignedTo: '', itAssetId: '' });
  const [seatSaving, setSeatSaving] = useState(false);
  const [itAssets, setItAssets] = useState<ITAsset[]>([]);

  const f = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    const params = new URLSearchParams();
    if (viewArchived) params.set('archived', 'true');
    fetch(`/api/licenses?${params.toString()}`)
      .then((r) => r.json())
      .then(setLicenses)
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewArchived]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setSeats([]);
    setSeatInput({ assignedTo: '', itAssetId: '' });
    setOpen(true);
  };

  const openEdit = (lic: LicenseWithSeats) => {
    setEditing(lic);
    setForm({
      name: lic.name,
      vendor: lic.vendor ?? '',
      licenseKey: lic.licenseKey ?? '',
      seatsTotal: lic.seatsTotal,
      cost: lic.cost ?? '',
      billingCycle: lic.billingCycle,
      purchaseDate: toDateInput(lic.purchaseDate),
      renewalDate: toDateInput(lic.renewalDate),
      autoRenew: lic.autoRenew,
      note: lic.note ?? '',
      order: lic.order,
    });
    setSeatInput({ assignedTo: '', itAssetId: '' });
    setOpen(true);
    fetch(`/api/licenses/${lic.id}/seats`).then((r) => (r.ok ? r.json() : [])).then(setSeats).catch(() => setSeats([]));
    if (itAssets.length === 0) {
      fetch('/api/it-assets').then((r) => (r.ok ? r.json() : [])).then(setItAssets).catch(() => {});
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      vendor: form.vendor || null,
      licenseKey: form.licenseKey || null,
      seatsTotal: Number(form.seatsTotal) || 1,
      cost: form.cost === '' ? null : Number(form.cost),
      billingCycle: form.billingCycle,
      purchaseDate: form.purchaseDate || null,
      renewalDate: form.renewalDate || null,
      autoRenew: form.autoRenew,
      note: form.note || null,
      order: Number(form.order) || 0,
      archived: editing?.archived ?? false,
    };

    try {
      if (editing) {
        const res = await fetch(`/api/licenses/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? `บันทึกไม่สำเร็จ (${res.status})`);
        }
        const updated = await res.json();
        setLicenses((prev) => prev.map((l) => (l.id === editing.id ? updated : l)));
      } else {
        const res = await fetch('/api/licenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? `บันทึกไม่สำเร็จ (${res.status})`);
        }
        const created = await res.json();
        setLicenses((prev) => [...prev, created]);
      }
      setOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    }
    setSaving(false);
  };

  const handleArchive = async (id: string) => {
    if (!confirm('ย้าย license นี้ไปเก็บถาวร (archive)?')) return;
    const res = await fetch(`/api/licenses/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert(`ทำรายการไม่สำเร็จ (${res.status})`);
      return;
    }
    setLicenses((prev) => prev.filter((l) => l.id !== id));
  };

  const handleUnarchive = async (lic: LicenseWithSeats) => {
    const res = await fetch(`/api/licenses/${lic.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: lic.name, vendor: lic.vendor, licenseKey: lic.licenseKey, seatsTotal: lic.seatsTotal,
        cost: lic.cost, billingCycle: lic.billingCycle, purchaseDate: toDateInput(lic.purchaseDate) || null,
        renewalDate: toDateInput(lic.renewalDate) || null, autoRenew: lic.autoRenew, note: lic.note,
        order: lic.order, archived: false,
      }),
    });
    if (!res.ok) {
      alert(`กู้คืนไม่สำเร็จ (${res.status})`);
      return;
    }
    setLicenses((prev) => prev.filter((l) => l.id !== lic.id));
  };

  const handlePermanentDelete = async (id: string) => {
    if (!confirm('ลบถาวร? ไม่สามารถกู้คืนได้')) return;
    const res = await fetch(`/api/licenses/${id}?permanent=true`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? `ลบไม่สำเร็จ (${res.status})`);
      return;
    }
    setLicenses((prev) => prev.filter((l) => l.id !== id));
  };

  const addSeat = async () => {
    if (!seatInput.assignedTo.trim() || !editing) return;
    setSeatSaving(true);
    try {
      const res = await fetch(`/api/licenses/${editing.id}/seats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedTo: seatInput.assignedTo.trim(), itAssetId: seatInput.itAssetId || null }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `เพิ่ม seat ไม่สำเร็จ (${res.status})`);
      }
      const created = await res.json();
      setSeats((prev) => [...prev, created]);
      setSeatInput({ assignedTo: '', itAssetId: '' });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    }
    setSeatSaving(false);
  };

  const removeSeat = async (seat: SeatWithAsset) => {
    if (!editing) return;
    try {
      const res = await fetch(`/api/licenses/${editing.id}/seats/${seat.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`ลบ seat ไม่สำเร็จ (${res.status})`);
      setSeats((prev) => prev.filter((s) => s.id !== seat.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    }
  };

  const visible = licenses.filter((l) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return l.name.toLowerCase().includes(q) || l.vendor?.toLowerCase().includes(q);
  });

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 3, md: 6 }, py: { xs: 6, md: 8 } }}>
      <PageHeader
        title="Licenses"
        caption="software license management"
        action={
          <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={openCreate}
            sx={{ borderColor: 'divider', color: 'text.primary', '&:hover': { borderColor: '#38bdf8', color: '#38bdf8' } }}>
            Add License
          </Button>
        }
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField value={search} onChange={(e) => setSearch(e.target.value)} size="small" placeholder="ค้นหาชื่อ / vendor" sx={{ minWidth: 220 }} />
        <FormControlLabel
          control={<Switch checked={viewArchived} onChange={(e) => setViewArchived(e.target.checked)} size="small" />}
          label={<Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>แสดงรายการที่ archive แล้ว</Typography>}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {visible.map((lic) => (
          <AdminCard key={lic.id}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{lic.name}</Typography>
                <Chip label={`${lic.seats.length}/${lic.seatsTotal} seats`} size="small" sx={{ height: 18, fontSize: '0.6rem' }} />
                <Chip label={BILLING_LABEL[lic.billingCycle] ?? lic.billingCycle} size="small" sx={{ height: 18, fontSize: '0.6rem' }} />
                <RenewalChip renewalDate={lic.renewalDate} />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                {[lic.vendor, lic.cost != null && `฿${fmt(lic.cost)}`].filter(Boolean).join(' · ')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {viewArchived ? (
                <>
                  <IconButton size="small" onClick={() => handleUnarchive(lic)} sx={{ color: 'text.secondary', '&:hover': { color: '#4ade80' } }} title="กู้คืน">
                    <UnarchiveIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handlePermanentDelete(lic.id)} sx={{ color: 'text.secondary', '&:hover': { color: '#f87171' } }} title="ลบถาวร">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton size="small" onClick={() => openEdit(lic)} sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleArchive(lic.id)} sx={{ color: 'text.secondary', '&:hover': { color: '#f87171' } }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </>
              )}
            </Box>
          </AdminCard>
        ))}
        {visible.length === 0 && <EmptyState message={viewArchived ? 'ไม่มีรายการที่ archive' : 'ยังไม่มี license — กด Add License เพื่อเริ่ม'} />}
      </Box>

      <FormDialog open={open} onClose={() => setOpen(false)} title={editing ? 'Edit License' : 'Add License'}
        onSave={handleSave} saving={saving} saveDisabled={!form.name.trim()}>
        <TextField label="ชื่อ License *" value={form.name} onChange={(e) => f('name', e.target.value)} size="small" />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <TextField label="Vendor" value={form.vendor} onChange={(e) => f('vendor', e.target.value)} size="small" />
          <TextField label="License Key" value={form.licenseKey} onChange={(e) => f('licenseKey', e.target.value)} size="small" />
          <TextField label="จำนวน Seat" value={form.seatsTotal} onChange={(e) => f('seatsTotal', e.target.value)} size="small" type="number" slotProps={{ htmlInput: { min: 1 } }} />
          <TextField label="ค่าใช้จ่าย" value={form.cost} onChange={(e) => f('cost', e.target.value)} size="small" type="number" slotProps={{ htmlInput: { min: 0 } }} />
          <FormControl size="small">
            <InputLabel>รอบการเรียกเก็บ</InputLabel>
            <Select value={form.billingCycle} label="รอบการเรียกเก็บ" onChange={(e) => f('billingCycle', e.target.value)}>
              {Object.entries(BILLING_LABEL).map(([value, label]) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel control={<Switch checked={form.autoRenew} onChange={(e) => f('autoRenew', e.target.checked)} size="small" />} label="ต่ออายุอัตโนมัติ" />
          <TextField label="วันที่ซื้อ" value={form.purchaseDate} onChange={(e) => f('purchaseDate', e.target.value)} size="small" type="date" slotProps={{ inputLabel: { shrink: true } }} />
          <TextField label="วันต่ออายุ" value={form.renewalDate} onChange={(e) => f('renewalDate', e.target.value)} size="small" type="date" slotProps={{ inputLabel: { shrink: true } }} />
        </Box>

        <TextField label="หมายเหตุ" value={form.note} onChange={(e) => f('note', e.target.value)} size="small" multiline rows={2} />
        <TextField label="ลำดับ (Order)" value={form.order} onChange={(e) => f('order', Number(e.target.value))} size="small" type="number" />

        {editing && (
          <>
            <Divider />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.08em', display: 'block', mb: 1.5 }}>
                SEATS ({seats.length}/{form.seatsTotal})
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1.5 }}>
                {seats.map((seat) => (
                  <Box key={seat.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ flex: 1, fontSize: '0.78rem' }}>
                      {seat.assignedTo}
                      {seat.itAsset && <Typography component="span" sx={{ fontSize: '0.68rem', color: 'text.secondary' }}> · {seat.itAsset.name}</Typography>}
                    </Typography>
                    <IconButton size="small" onClick={() => removeSeat(seat)} sx={{ color: 'text.disabled', '&:hover': { color: '#f87171' } }}>
                      <DeleteIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                ))}
                {seats.length === 0 && <Typography sx={{ fontSize: '0.7rem', color: 'text.disabled' }}>ยังไม่มี seat</Typography>}
              </Box>

              {seats.length < Number(form.seatsTotal) && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    value={seatInput.assignedTo}
                    onChange={(e) => setSeatInput((p) => ({ ...p, assignedTo: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSeat(); } }}
                    size="small" placeholder="ชื่อผู้ใช้ seat" sx={{ flex: 1 }}
                    slotProps={{ htmlInput: { style: { fontSize: '0.78rem' } } }}
                  />
                  <FormControl size="small" sx={{ minWidth: 160 }}>
                    <Select
                      value={seatInput.itAssetId}
                      displayEmpty
                      onChange={(e) => setSeatInput((p) => ({ ...p, itAssetId: e.target.value }))}
                      sx={{ fontSize: '0.72rem' }}
                    >
                      <MenuItem value="">— ไม่ผูกอุปกรณ์ —</MenuItem>
                      {itAssets.map((a) => <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <IconButton size="small" onClick={addSeat} disabled={seatSaving || !seatInput.assignedTo.trim()}
                    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 0, color: 'text.secondary', '&:hover': { color: '#38bdf8', borderColor: '#38bdf8' }, flexShrink: 0 }}>
                    {seatSaving ? <CircularProgress size={14} /> : <AddIcon fontSize="small" />}
                  </IconButton>
                </Box>
              )}
            </Box>
          </>
        )}
      </FormDialog>
    </Container>
  );
}
