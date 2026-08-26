'use client';

import { useEffect, useRef, useState } from 'react';
import type { ITAsset, ITAssetLog } from '@prisma/client';
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
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PageHeader from '../_components/PageHeader';
import EmptyState from '../_components/EmptyState';
import FormDialog from '../_components/FormDialog';
import AdminCard from '../_components/AdminCard';

const TYPE_LABEL: Record<string, string> = {
  LAPTOP: 'โน้ตบุ๊ก',
  DESKTOP: 'เดสก์ท็อป',
  MONITOR: 'จอมอนิเตอร์',
  PERIPHERAL: 'อุปกรณ์ต่อพ่วง',
  NETWORK_EQUIPMENT: 'อุปกรณ์เครือข่าย',
  SOFTWARE_LICENSE: 'ซอฟต์แวร์ไลเซนส์',
  OTHER: 'อื่นๆ',
};

const STATUS_LABEL: Record<string, string> = {
  IN_USE: 'กำลังใช้งาน',
  IN_STORAGE: 'ในคลัง',
  REPAIR: 'ซ่อมบำรุง',
  RETIRED: 'ปลดระวาง',
  LOST: 'สูญหาย',
};

const STATUS_COLOR: Record<string, string> = {
  IN_USE: '#4ade80',
  IN_STORAGE: '#38bdf8',
  REPAIR: '#facc15',
  RETIRED: '#94a3b8',
  LOST: '#f87171',
};

const emptyForm = {
  name: '',
  type: 'LAPTOP',
  status: 'IN_USE',
  serialNumber: '',
  assignedTo: '',
  vendor: '',
  purchaseDate: '',
  purchasePrice: '' as string | number,
  warrantyExpiry: '',
  attachmentUrl: '',
  note: '',
  order: 0,
};

const toDateInput = (d: Date | string | null) => (d ? new Date(d).toISOString().slice(0, 10) : '');
const daysUntil = (d: Date | string) => Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000);

function WarrantyChip({ warrantyExpiry }: { warrantyExpiry: Date | string | null }) {
  if (!warrantyExpiry) return null;
  const days = daysUntil(warrantyExpiry);
  if (days < 0) return <Chip label="หมดประกัน" size="small" sx={{ height: 18, fontSize: '0.6rem', color: '#f87171', backgroundColor: '#f8717118', border: '1px solid #f8717144' }} />;
  if (days <= 30) return <Chip label={`ประกันเหลือ ${days} วัน`} size="small" sx={{ height: 18, fontSize: '0.6rem', color: '#facc15', backgroundColor: '#facc1518', border: '1px solid #facc1544' }} />;
  return null;
}

export default function ITAssetsClient({ items: initial }: { items: ITAsset[] }) {
  const [items, setItems] = useState(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ITAsset | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [viewArchived, setViewArchived] = useState(false);
  const [logs, setLogs] = useState<ITAssetLog[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const f = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Refetch when the archived view toggles
  useEffect(() => {
    const params = new URLSearchParams();
    if (viewArchived) params.set('archived', 'true');
    fetch(`/api/it-assets?${params.toString()}`)
      .then((r) => r.json())
      .then(setItems)
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewArchived]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setLogs([]);
    setOpen(true);
  };

  const openEdit = (item: ITAsset) => {
    setEditing(item);
    setForm({
      name: item.name,
      type: item.type,
      status: item.status,
      serialNumber: item.serialNumber ?? '',
      assignedTo: item.assignedTo ?? '',
      vendor: item.vendor ?? '',
      purchaseDate: toDateInput(item.purchaseDate),
      purchasePrice: item.purchasePrice ?? '',
      warrantyExpiry: toDateInput(item.warrantyExpiry),
      attachmentUrl: item.attachmentUrl ?? '',
      note: item.note ?? '',
      order: item.order,
    });
    setOpen(true);
    fetch(`/api/it-assets/${item.id}/logs`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setLogs)
      .catch(() => setLogs([]));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'pimuk-art/it-assets');
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error(`อัปโหลดไม่สำเร็จ (${res.status})`);
      const data = await res.json();
      f('attachmentUrl', data.url);
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
      name: form.name.trim(),
      type: form.type,
      status: form.status,
      serialNumber: form.serialNumber.trim() || null,
      assignedTo: form.assignedTo || null,
      vendor: form.vendor || null,
      purchaseDate: form.purchaseDate || null,
      purchasePrice: form.purchasePrice === '' ? null : Number(form.purchasePrice),
      warrantyExpiry: form.warrantyExpiry || null,
      attachmentUrl: form.attachmentUrl || null,
      note: form.note || null,
      order: Number(form.order) || 0,
      archived: editing?.archived ?? false,
    };

    try {
      if (editing) {
        const res = await fetch(`/api/it-assets/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? `บันทึกไม่สำเร็จ (${res.status})`);
        }
        const updated = await res.json();
        setItems((prev) => prev.map((i) => (i.id === editing.id ? updated : i)));
      } else {
        const res = await fetch('/api/it-assets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? `บันทึกไม่สำเร็จ (${res.status})`);
        }
        const created = await res.json();
        setItems((prev) => [...prev, created]);
      }
      setOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    }
    setSaving(false);
  };

  const handleArchive = async (id: string) => {
    if (!confirm('ย้ายรายการนี้ไปเก็บถาวร (archive)?')) return;
    const res = await fetch(`/api/it-assets/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert(`ทำรายการไม่สำเร็จ (${res.status})`);
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleUnarchive = async (item: ITAsset) => {
    const res = await fetch(`/api/it-assets/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: item.name, type: item.type, status: item.status, serialNumber: item.serialNumber,
        assignedTo: item.assignedTo, vendor: item.vendor, purchaseDate: toDateInput(item.purchaseDate) || null,
        purchasePrice: item.purchasePrice, warrantyExpiry: toDateInput(item.warrantyExpiry) || null,
        attachmentUrl: item.attachmentUrl, note: item.note, order: item.order, archived: false,
      }),
    });
    if (!res.ok) {
      alert(`กู้คืนไม่สำเร็จ (${res.status})`);
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  const handlePermanentDelete = async (id: string) => {
    if (!confirm('ลบถาวร? ไม่สามารถกู้คืนได้')) return;
    const res = await fetch(`/api/it-assets/${id}?permanent=true`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? `ลบไม่สำเร็จ (${res.status})`);
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const visible = items
    .filter((i) => (statusFilter ? i.status === statusFilter : true))
    .filter((i) => {
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      return i.name.toLowerCase().includes(q) || i.serialNumber?.toLowerCase().includes(q) || i.assignedTo?.toLowerCase().includes(q);
    });

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 3, md: 6 }, py: { xs: 6, md: 8 } }}>
      <PageHeader
        title="IT Assets"
        caption="it equipment inventory"
        action={
          <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={openCreate}
            sx={{ borderColor: 'divider', color: 'text.primary', '&:hover': { borderColor: '#38bdf8', color: '#38bdf8' } }}>
            Add IT Asset
          </Button>
        }
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          placeholder="ค้นหาชื่อ / serial / ผู้ถือครอง"
          sx={{ minWidth: 220 }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>สถานะ</InputLabel>
          <Select value={statusFilter} label="สถานะ" onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="">ทั้งหมด</MenuItem>
            {Object.entries(STATUS_LABEL).map(([value, label]) => (
              <MenuItem key={value} value={value}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControlLabel
          control={<Switch checked={viewArchived} onChange={(e) => setViewArchived(e.target.checked)} size="small" />}
          label={<Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>แสดงรายการที่ archive แล้ว</Typography>}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {visible.map((item) => (
          <AdminCard key={item.id}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{item.name}</Typography>
                <Chip label={TYPE_LABEL[item.type] ?? item.type} size="small" sx={{ height: 18, fontSize: '0.6rem' }} />
                <Chip label={STATUS_LABEL[item.status] ?? item.status} size="small"
                  sx={{ height: 18, fontSize: '0.6rem', color: STATUS_COLOR[item.status], backgroundColor: `${STATUS_COLOR[item.status]}18`, border: `1px solid ${STATUS_COLOR[item.status]}44` }} />
                <WarrantyChip warrantyExpiry={item.warrantyExpiry} />
                {item.attachmentUrl && <AttachFileIcon sx={{ fontSize: 14, color: 'text.disabled' }} />}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                {[item.serialNumber && `S/N: ${item.serialNumber}`, item.assignedTo && `ผู้ถือครอง: ${item.assignedTo}`, item.vendor].filter(Boolean).join(' · ')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {viewArchived ? (
                <>
                  <IconButton size="small" onClick={() => handleUnarchive(item)} sx={{ color: 'text.secondary', '&:hover': { color: '#4ade80' } }} title="กู้คืน">
                    <UnarchiveIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handlePermanentDelete(item.id)} sx={{ color: 'text.secondary', '&:hover': { color: '#f87171' } }} title="ลบถาวร">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton size="small" onClick={() => openEdit(item)} sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleArchive(item.id)} sx={{ color: 'text.secondary', '&:hover': { color: '#f87171' } }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </>
              )}
            </Box>
          </AdminCard>
        ))}
        {visible.length === 0 && <EmptyState message={viewArchived ? 'ไม่มีรายการที่ archive' : 'ยังไม่มีรายการ IT Asset — กด Add IT Asset เพื่อเริ่ม'} />}
      </Box>

      <FormDialog open={open} onClose={() => setOpen(false)} title={editing ? 'Edit IT Asset' : 'Add IT Asset'}
        onSave={handleSave} saving={saving} saveDisabled={!form.name.trim()}>
        <TextField label="ชื่ออุปกรณ์ *" value={form.name} onChange={(e) => f('name', e.target.value)} size="small" />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <FormControl size="small">
            <InputLabel>ประเภท</InputLabel>
            <Select value={form.type} label="ประเภท" onChange={(e) => f('type', e.target.value)}>
              {Object.entries(TYPE_LABEL).map(([value, label]) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
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
          <TextField label="Serial Number" value={form.serialNumber} onChange={(e) => f('serialNumber', e.target.value)} size="small" />
          <TextField label="ผู้ถือครอง" value={form.assignedTo} onChange={(e) => f('assignedTo', e.target.value)} size="small" />
          <TextField label="ผู้จำหน่าย (Vendor)" value={form.vendor} onChange={(e) => f('vendor', e.target.value)} size="small" />
          <TextField label="ราคาซื้อ" value={form.purchasePrice} onChange={(e) => f('purchasePrice', e.target.value)} size="small" type="number" slotProps={{ htmlInput: { min: 0 } }} />
          <TextField label="วันที่ซื้อ" value={form.purchaseDate} onChange={(e) => f('purchaseDate', e.target.value)} size="small" type="date" slotProps={{ inputLabel: { shrink: true } }} />
          <TextField label="วันหมดประกัน" value={form.warrantyExpiry} onChange={(e) => f('warrantyExpiry', e.target.value)} size="small" type="date" slotProps={{ inputLabel: { shrink: true } }} />
        </Box>

        <Box>
          <input ref={fileRef} type="file" accept="image/*,application/pdf" style={{ display: 'none' }} onChange={handleUpload} />
          <Button size="small" variant="outlined" onClick={() => fileRef.current?.click()} disabled={uploading}
            startIcon={uploading ? <CircularProgress size={14} /> : <AttachFileIcon />}
            sx={{ borderColor: 'divider', color: 'text.secondary' }}>
            {form.attachmentUrl ? 'เปลี่ยนไฟล์แนบ' : 'แนบไฟล์ (ใบเสร็จ/รูป)'}
          </Button>
        </Box>

        <TextField label="หมายเหตุ" value={form.note} onChange={(e) => f('note', e.target.value)} size="small" multiline rows={2} />
        <TextField label="ลำดับ (Order)" value={form.order} onChange={(e) => f('order', Number(e.target.value))} size="small" type="number" />

        {editing && (
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.08em', display: 'block', mb: 1 }}>ประวัติสถานะ</Typography>
            {logs.length === 0 ? (
              <Typography sx={{ fontSize: '0.7rem', color: 'text.disabled' }}>ไม่มีประวัติ</Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                {logs.map((log) => (
                  <Typography key={log.id} sx={{ fontSize: '0.7rem', color: 'text.secondary', fontFamily: 'monospace' }}>
                    {new Date(log.createdAt).toLocaleDateString('th-TH', { dateStyle: 'medium' })} · {log.fromStatus ? `${STATUS_LABEL[log.fromStatus]} → ` : ''}{STATUS_LABEL[log.toStatus]}
                    {log.assignedTo ? ` · ${log.assignedTo}` : ''}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        )}
      </FormDialog>
    </Container>
  );
}
