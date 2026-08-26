'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '../_components/PageHeader';
import FormDialog from '../_components/FormDialog';

type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  sourceType: 'MANUAL' | 'TASK' | 'MILESTONE' | 'IT_ASSET_WARRANTY' | 'LICENSE_RENEWAL' | 'RECURRING_TRANSACTION';
  sourceId: string;
  href: string;
};

const SOURCE_COLOR: Record<string, string> = {
  MANUAL: '#38bdf8',
  TASK: '#a78bfa',
  MILESTONE: '#fb923c',
  IT_ASSET_WARRANTY: '#f87171',
  LICENSE_RENEWAL: '#facc15',
  RECURRING_TRANSACTION: '#4ade80',
};

const SOURCE_LABEL: Record<string, string> = {
  MANUAL: 'กำหนดการ',
  TASK: 'งาน',
  MILESTONE: 'เป้าหมาย',
  IT_ASSET_WARRANTY: 'ประกันอุปกรณ์',
  LICENSE_RENEWAL: 'ต่ออายุ license',
  RECURRING_TRANSACTION: 'ตัดเงินประจำ',
};

const toDateKey = (d: Date) => d.toISOString().slice(0, 10);

const emptyForm = { title: '', startAt: toDateKey(new Date()), allDay: true, location: '', description: '' };

export default function CalendarClient() {
  const [calMonth, setCalMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/calendar?year=${calMonth.year}&month=${calMonth.month}`)
      .then((r) => r.json())
      .then((data) => setEvents(data.events))
      .finally(() => setLoading(false));
  }, [calMonth]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    }
    return map;
  }, [events]);

  const calendarDays = useMemo(() => {
    const first = new Date(calMonth.year, calMonth.month, 1);
    const startOffset = first.getDay();
    const daysInMonth = new Date(calMonth.year, calMonth.month + 1, 0).getDate();
    const cells: (string | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(toDateKey(new Date(calMonth.year, calMonth.month, d)));
    }
    return cells;
  }, [calMonth]);

  const f = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/calendar-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          startAt: form.startAt,
          allDay: form.allDay,
          location: form.location || null,
          description: form.description || null,
        }),
      });
      if (!res.ok) throw new Error(`บันทึกไม่สำเร็จ (${res.status})`);
      setOpen(false);
      setForm(emptyForm);
      const r = await fetch(`/api/calendar?year=${calMonth.year}&month=${calMonth.month}`);
      setEvents((await r.json()).events);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    }
    setSaving(false);
  };

  const dayEvents = selectedDay ? (eventsByDay.get(selectedDay) ?? []) : [];

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 3, md: 6 }, py: { xs: 6, md: 8 } }}>
      <PageHeader
        title="Calendar"
        caption="รวมกำหนดการจากทุกโมดูล"
        action={
          <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={() => setOpen(true)}
            sx={{ borderColor: 'divider', color: 'text.primary', '&:hover': { borderColor: '#38bdf8', color: '#38bdf8' } }}>
            Add Event
          </Button>
        }
      />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <IconButton size="small" onClick={() => setCalMonth((m) => (m.month === 0 ? { year: m.year - 1, month: 11 } : { year: m.year, month: m.month - 1 }))}>‹</IconButton>
        <Typography sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
          {new Date(calMonth.year, calMonth.month).toLocaleDateString('th-TH', { year: 'numeric', month: 'long' })}
          {loading && <CircularProgress size={12} sx={{ ml: 1 }} />}
        </Typography>
        <IconButton size="small" onClick={() => setCalMonth((m) => (m.month === 11 ? { year: m.year + 1, month: 0 } : { year: m.year, month: m.month + 1 }))}>›</IconButton>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mb: 2 }}>
        {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map((d) => (
          <Typography key={d} sx={{ fontSize: '0.65rem', color: 'text.disabled', textAlign: 'center', fontFamily: 'monospace' }}>{d}</Typography>
        ))}
        {calendarDays.map((day, i) => {
          const dayEvts = day ? (eventsByDay.get(day) ?? []) : [];
          const isSelected = day === selectedDay;
          return (
            <Box
              key={i}
              onClick={() => day && setSelectedDay(isSelected ? null : day)}
              sx={{
                minHeight: 64, p: 0.5, border: '1px solid', borderColor: isSelected ? '#38bdf8' : 'divider',
                cursor: day ? 'pointer' : 'default', opacity: day ? 1 : 0.3,
                '&:hover': day ? { borderColor: '#38bdf8' } : {},
              }}
            >
              {day && (
                <>
                  <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>{Number(day.slice(-2))}</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4, mt: 0.5 }}>
                    {dayEvts.slice(0, 4).map((e) => (
                      <Box key={e.id} sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: SOURCE_COLOR[e.sourceType] }} />
                    ))}
                  </Box>
                </>
              )}
            </Box>
          );
        })}
      </Box>

      {selectedDay && (
        <Box sx={{ border: '1px solid', borderColor: 'divider', p: 2.5 }}>
          <Typography sx={{ fontFamily: 'monospace', fontSize: '0.75rem', mb: 1.5 }}>{selectedDay}</Typography>
          {dayEvents.length === 0 ? (
            <Typography sx={{ fontSize: '0.7rem', color: 'text.disabled' }}>ไม่มีกำหนดการ</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {dayEvents.map((e) => (
                <Box key={e.id} component={Link} href={e.href} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', color: 'inherit' }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: SOURCE_COLOR[e.sourceType], flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '0.8rem', flex: 1 }}>{e.title}</Typography>
                  <Typography sx={{ fontSize: '0.6rem', color: 'text.disabled', fontFamily: 'monospace' }}>{SOURCE_LABEL[e.sourceType]}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      <FormDialog open={open} onClose={() => setOpen(false)} title="Add Event" onSave={handleSave} saving={saving} saveDisabled={!form.title.trim()} maxWidth="xs">
        <TextField label="ชื่อกำหนดการ *" value={form.title} onChange={(e) => f('title', e.target.value)} size="small" />
        <TextField label="วันที่" value={form.startAt} onChange={(e) => f('startAt', e.target.value)} size="small" type="date" slotProps={{ inputLabel: { shrink: true } }} />
        <TextField label="สถานที่" value={form.location} onChange={(e) => f('location', e.target.value)} size="small" />
        <TextField label="รายละเอียด" value={form.description} onChange={(e) => f('description', e.target.value)} size="small" multiline rows={2} />
      </FormDialog>
    </Container>
  );
}
