'use client';

import { useState } from 'react';
import type { AuditLog } from '@prisma/client';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import PageHeader from '../_components/PageHeader';
import EmptyState from '../_components/EmptyState';
import AdminCard from '../_components/AdminCard';

const MODELS = [
  'Contact', 'Project', 'Game', 'Dlc', 'Asset', 'AssetValuation', 'Liability', 'Category',
  'Transaction', 'ITAsset', 'License', 'LicenseSeat', 'User',
];

const ACTION_LABEL: Record<string, string> = { CREATE: 'สร้าง', UPDATE: 'แก้ไข', DELETE: 'ลบ' };
const ACTION_COLOR: Record<string, string> = { CREATE: '#4ade80', UPDATE: '#38bdf8', DELETE: '#f87171' };

export default function AuditLogClient({
  initialLogs,
  initialNextCursor,
}: {
  initialLogs: AuditLog[];
  initialNextCursor: string | null;
}) {
  const [logs, setLogs] = useState(initialLogs);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [loadingMore, setLoadingMore] = useState(false);
  const [model, setModel] = useState('');
  const [action, setAction] = useState('');
  const [loadingFilter, setLoadingFilter] = useState(false);

  const fetchLogs = async (opts: { reset?: boolean } = {}) => {
    const params = new URLSearchParams();
    if (model) params.set('model', model);
    if (action) params.set('action', action);
    if (!opts.reset && nextCursor) params.set('cursor', nextCursor);

    if (opts.reset) setLoadingFilter(true);
    else setLoadingMore(true);

    try {
      const res = await fetch(`/api/audit-log?${params.toString()}`);
      const data = await res.json();
      setLogs((prev) => (opts.reset ? data.logs : [...prev, ...data.logs]));
      setNextCursor(data.nextCursor);
    } finally {
      setLoadingFilter(false);
      setLoadingMore(false);
    }
  };

  const applyFilters = (nextModel: string, nextAction: string) => {
    setModel(nextModel);
    setAction(nextAction);
    const params = new URLSearchParams();
    if (nextModel) params.set('model', nextModel);
    if (nextAction) params.set('action', nextAction);
    setLoadingFilter(true);
    fetch(`/api/audit-log?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => { setLogs(data.logs); setNextCursor(data.nextCursor); })
      .finally(() => setLoadingFilter(false));
  };

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 3, md: 6 }, py: { xs: 6, md: 8 } }}>
      <PageHeader title="Audit Log" caption="system activity" />

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Model</InputLabel>
          <Select value={model} label="Model" onChange={(e) => applyFilters(e.target.value, action)}>
            <MenuItem value="">ทั้งหมด</MenuItem>
            {MODELS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Action</InputLabel>
          <Select value={action} label="Action" onChange={(e) => applyFilters(model, e.target.value)}>
            <MenuItem value="">ทั้งหมด</MenuItem>
            {Object.entries(ACTION_LABEL).map(([value, label]) => (
              <MenuItem key={value} value={value}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {loadingFilter && <CircularProgress size={20} sx={{ alignSelf: 'center' }} />}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {logs.map((log) => (
          <AdminCard key={log.id} sx={{ p: 2, gap: 2 }}>
            <Typography sx={{ fontFamily: 'monospace', fontSize: '0.68rem', color: 'text.disabled', flexShrink: 0, width: 150 }}>
              {new Date(log.createdAt).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'medium' })}
            </Typography>
            <Chip label={ACTION_LABEL[log.action] ?? log.action} size="small"
              sx={{ height: 18, fontSize: '0.6rem', color: ACTION_COLOR[log.action], backgroundColor: `${ACTION_COLOR[log.action]}18`, border: `1px solid ${ACTION_COLOR[log.action]}44`, flexShrink: 0 }} />
            <Typography sx={{ fontFamily: 'monospace', fontSize: '0.72rem', flexShrink: 0, width: 110 }}>{log.model}</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', flexShrink: 0, width: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {log.actorEmail ?? 'ไม่ทราบผู้ทำรายการ'}
            </Typography>
            <Typography sx={{ fontFamily: 'monospace', fontSize: '0.68rem', color: 'text.disabled', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {log.summary}
            </Typography>
          </AdminCard>
        ))}
        {logs.length === 0 && !loadingFilter && <EmptyState message="ยังไม่มีรายการ audit log" />}
      </Box>

      {nextCursor && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant="outlined" size="small" onClick={() => fetchLogs()} disabled={loadingMore}
            sx={{ borderColor: 'divider', color: 'text.secondary' }}>
            {loadingMore ? <CircularProgress size={16} /> : 'โหลดเพิ่ม'}
          </Button>
        </Box>
      )}
    </Container>
  );
}
