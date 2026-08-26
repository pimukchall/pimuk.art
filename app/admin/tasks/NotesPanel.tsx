'use client';

import { useState } from 'react';
import type { Note } from '@prisma/client';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function NotesPanel({
  notes: initial,
  onConvertToTask,
}: {
  notes: Note[];
  onConvertToTask: (note: Note) => void;
}) {
  const [notes, setNotes] = useState(initial);
  const [input, setInput] = useState('');
  const [saving, setSaving] = useState(false);

  const addNote = async () => {
    const content = input.trim();
    if (!content) return;
    setSaving(true);
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error(`บันทึกไม่สำเร็จ (${res.status})`);
      const created = await res.json();
      setNotes((prev) => [created, ...prev]);
      setInput('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    }
    setSaving(false);
  };

  const deleteNote = async (id: string) => {
    const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert(`ลบไม่สำเร็จ (${res.status})`);
      return;
    }
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const convert = async (note: Note) => {
    onConvertToTask(note);
    await fetch(`/api/notes/${note.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: note.content, archived: true }),
    });
    setNotes((prev) => prev.filter((n) => n.id !== note.id));
  };

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', p: 2.5, mb: 4 }}>
      <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.08em', display: 'block', mb: 1.5 }}>
        QUICK NOTES
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addNote(); } }}
          size="small"
          placeholder="จดไอเดียด่วน…"
          sx={{ flex: 1 }}
          slotProps={{ htmlInput: { style: { fontSize: '0.8rem' } } }}
        />
        <IconButton size="small" onClick={addNote} disabled={saving || !input.trim()}
          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 0, color: 'text.secondary', '&:hover': { color: '#38bdf8', borderColor: '#38bdf8' } }}>
          {saving ? <CircularProgress size={14} /> : <AddIcon fontSize="small" />}
        </IconButton>
      </Box>

      {notes.length === 0 ? (
        <Typography sx={{ fontSize: '0.7rem', color: 'text.disabled' }}>ยังไม่มีโน้ต</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {notes.map((note) => (
            <Box key={note.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ flex: 1, fontSize: '0.78rem' }}>{note.content}</Typography>
              <IconButton size="small" onClick={() => convert(note)} title="สร้าง Task" sx={{ color: 'text.disabled', '&:hover': { color: '#38bdf8' } }}>
                <ArrowForwardIcon sx={{ fontSize: 16 }} />
              </IconButton>
              <IconButton size="small" onClick={() => deleteNote(note.id)} sx={{ color: 'text.disabled', '&:hover': { color: '#f87171' } }}>
                <DeleteIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
