'use client';

import { useState, useRef } from 'react';
import type { Project } from '@prisma/client';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';

type StackGroup = { group: string; items: string[] };

const ACCENT_COLORS = ['#7dd3fc', '#a78bfa', '#38bdf8', '#fb923c', '#f472b6', '#facc15'];

const defaultStack: StackGroup[] = [
  { group: 'Frontend', items: [] },
  { group: 'Backend', items: [] },
  { group: 'Infra', items: [] },
];

const emptyForm = {
  title: '',
  url: '',
  category: '',
  type: '',
  year: new Date().getFullYear().toString(),
  accent: '#7dd3fc',
  deployLabel: '',
  deployDetail: '',
  description: '',
  stack: defaultStack,
  modules: [] as string[],
  images: [] as string[],
  order: 0,
  published: true,
};

export default function ProjectsClient({ projects: initial }: { projects: Project[] }) {
  const [projects, setProjects] = useState(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [moduleInput, setModuleInput] = useState('');
  const [stackItemInputs, setStackItemInputs] = useState<string[]>(['', '', '']);
  const multiFileRef = useRef<HTMLInputElement>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setStackItemInputs(['', '', '']);
    setModuleInput('');
    setOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    const stack = (p.stack as StackGroup[]) ?? defaultStack;
    setForm({
      title: p.title,
      url: p.url ?? '',
      category: p.category,
      type: p.type,
      year: p.year,
      accent: p.accent,
      deployLabel: p.deployLabel,
      deployDetail: p.deployDetail,
      description: p.description,
      stack,
      modules: (p.modules as string[]) ?? [],
      images: (p.images as string[]) ?? [],
      order: p.order,
      published: p.published,
    });
    setStackItemInputs(stack.map(() => ''));
    setModuleInput('');
    setOpen(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = (
        await Promise.all(
          files.map(async (file) => {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('upload_preset', 'pimuk_art_unsigned');
            fd.append('folder', 'pimuk-art/projects');
            const res = await fetch(
              `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
              { method: 'POST', body: fd }
            );
            if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
            const data = await res.json();
            if (!data.secure_url) throw new Error('No URL returned from Cloudinary');
            return data.secure_url as string;
          })
        )
      );
      setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'อัปโหลดไม่สำเร็จ');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (idx: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const moveImage = (from: number, to: number) => {
    setForm((prev) => {
      const imgs = [...prev.images];
      const [item] = imgs.splice(from, 1);
      imgs.splice(to, 0, item);
      return { ...prev, images: imgs };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      title: form.title,
      url: form.url || null,
      category: form.category,
      type: form.type,
      year: form.year,
      accent: form.accent,
      deployLabel: form.deployLabel,
      deployDetail: form.deployDetail,
      description: form.description,
      stack: form.stack.filter((g) => g.items.length > 0 || g.group),
      modules: form.modules,
      imageUrl: form.images[0] ?? null,
      images: form.images,
      order: Number(form.order),
      published: form.published,
    };

    try {
      if (editing) {
        const res = await fetch(`/api/projects/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`บันทึกไม่สำเร็จ (${res.status})`);
        const updated = await res.json();
        setProjects((prev) => prev.map((p) => (p.id === editing.id ? updated : p)));
      } else {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`บันทึกไม่สำเร็จ (${res.status})`);
        const created = await res.json();
        setProjects((prev) => [...prev, created]);
      }
      setOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ลบ project นี้?')) return;
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert(`ลบไม่สำเร็จ (${res.status})`);
      return;
    }
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const f = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Stack helpers
  const addStackItem = (groupIdx: number) => {
    const val = stackItemInputs[groupIdx].trim();
    if (!val) return;
    const stack = form.stack.map((g, i) =>
      i === groupIdx ? { ...g, items: [...g.items, val] } : g
    );
    f('stack', stack);
    setStackItemInputs((prev) => prev.map((v, i) => (i === groupIdx ? '' : v)));
  };

  const removeStackItem = (groupIdx: number, itemIdx: number) => {
    const stack = form.stack.map((g, i) =>
      i === groupIdx ? { ...g, items: g.items.filter((_, j) => j !== itemIdx) } : g
    );
    f('stack', stack);
  };

  const updateGroupName = (groupIdx: number, name: string) => {
    const stack = form.stack.map((g, i) => (i === groupIdx ? { ...g, group: name } : g));
    f('stack', stack);
  };

  const addStackGroup = () => {
    f('stack', [...form.stack, { group: '', items: [] }]);
    setStackItemInputs((prev) => [...prev, '']);
  };

  const removeStackGroup = (groupIdx: number) => {
    f('stack', form.stack.filter((_, i) => i !== groupIdx));
    setStackItemInputs((prev) => prev.filter((_, i) => i !== groupIdx));
  };

  // Module helpers
  const addModule = () => {
    const val = moduleInput.trim();
    if (!val || form.modules.includes(val)) return;
    f('modules', [...form.modules, val]);
    setModuleInput('');
  };

  const removeModule = (mod: string) => {
    f('modules', form.modules.filter((m) => m !== mod));
  };

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 3, md: 6 }, py: { xs: 6, md: 8 } }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mb: 6 }}>
        <Box>
          <Typography variant="caption" sx={{ color: '#38bdf8', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
            // admin
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 300 }}>Projects</Typography>
        </Box>
        <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={openCreate}
          sx={{ borderColor: '#e2e8f0', color: '#0f172a', '&:hover': { borderColor: '#38bdf8' } }}>
          Add Project
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {projects.map((p) => (
          <Box key={p.id} sx={{ border: '1px solid', borderColor: 'divider', p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
            {p.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.imageUrl} alt={p.title} style={{ width: 80, height: 56, objectFit: 'cover', flexShrink: 0 }} />
            ) : (
              <Box sx={{ width: 80, height: 56, backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ImageIcon sx={{ color: '#94a3b8' }} />
              </Box>
            )}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: p.accent, flexShrink: 0 }} />
                <Typography variant="body1" sx={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</Typography>
                {!p.published && <Chip label="hidden" size="small" sx={{ height: 18, fontSize: '0.6rem', color: '#94a3b8' }} />}
              </Box>
              <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace' }}>
                {p.category} · {p.year} · order: {p.order}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton size="small" onClick={() => openEdit(p)} sx={{ color: '#64748b', '&:hover': { color: '#0f172a' } }}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => handleDelete(p.id)} sx={{ color: '#64748b', '&:hover': { color: '#f87171' } }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}
        {projects.length === 0 && (
          <Typography variant="body2" sx={{ color: '#94a3b8', py: 8, textAlign: 'center' }}>
            ยังไม่มี project — กด Add Project เพื่อเริ่ม
          </Typography>
        )}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth
        slotProps={{ paper: { sx: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0' } } }}>
        <DialogTitle sx={{ fontWeight: 300, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editing ? 'Edit Project' : 'Add Project'}
          <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: '#64748b' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>

          {/* ── Image upload ── */}
          <Box>
            <input ref={multiFileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleUpload} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="caption" sx={{ color: '#64748b', letterSpacing: '0.08em' }}>
                รูปภาพ {form.images.length > 0 && `(${form.images.length} รูป · รูปแรกเป็น cover)`}
              </Typography>
              <Button size="small" startIcon={uploading ? <CircularProgress size={12} /> : <AddIcon />}
                onClick={() => multiFileRef.current?.click()} disabled={uploading}
                sx={{ color: '#64748b', fontSize: '0.65rem', '&:hover': { color: '#0f172a' } }}>
                {uploading ? 'Uploading…' : 'เพิ่มรูป'}
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {form.images.map((url, idx) => (
                <Box key={idx} sx={{ position: 'relative', width: 100, height: 70 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`img-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  {idx === 0 && (
                    <Box sx={{ position: 'absolute', top: 0, left: 0, backgroundColor: '#38bdf899', px: 0.75, py: 0.25 }}>
                      <Typography sx={{ fontSize: '0.55rem', color: '#fff', fontFamily: 'monospace' }}>cover</Typography>
                    </Box>
                  )}
                  <Box sx={{ position: 'absolute', top: 2, right: 2, display: 'flex', gap: 0.5 }}>
                    {idx > 0 && (
                      <IconButton size="small" onClick={() => moveImage(idx, idx - 1)}
                        sx={{ backgroundColor: '#000a', color: '#fff', width: 18, height: 18, fontSize: '0.6rem' }}>
                        ←
                      </IconButton>
                    )}
                    {idx < form.images.length - 1 && (
                      <IconButton size="small" onClick={() => moveImage(idx, idx + 1)}
                        sx={{ backgroundColor: '#000a', color: '#fff', width: 18, height: 18, fontSize: '0.6rem' }}>
                        →
                      </IconButton>
                    )}
                    <IconButton size="small" onClick={() => removeImage(idx)}
                      sx={{ backgroundColor: '#000a', color: '#f87171', width: 18, height: 18 }}>
                      <CloseIcon sx={{ fontSize: 10 }} />
                    </IconButton>
                  </Box>
                </Box>
              ))}

              {form.images.length === 0 && (
                <Box onClick={() => multiFileRef.current?.click()}
                  sx={{ width: 100, height: 70, border: '1px dashed #e2e8f0', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 0.5,
                    '&:hover': { borderColor: '#38bdf8' } }}>
                  <ImageIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                  <Typography sx={{ fontSize: '0.6rem', color: '#94a3b8' }}>คลิกเพิ่มรูป</Typography>
                </Box>
              )}
            </Box>
          </Box>

          <Divider sx={{ borderColor: '#e2e8f0' }} />

          {/* ── Basic info ── */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField label="ชื่อ Project *" value={form.title} onChange={(e) => f('title', e.target.value)} size="small" />
            <TextField label="URL (ถ้ามี)" value={form.url} onChange={(e) => f('url', e.target.value)} size="small" placeholder="https://..." />
            <TextField label="Category" value={form.category} onChange={(e) => f('category', e.target.value)} size="small" placeholder="Commercial Web Application" />
            <TextField label="Type" value={form.type} onChange={(e) => f('type', e.target.value)} size="small" placeholder="Public · Custom Domain" />
            <TextField label="ปี" value={form.year} onChange={(e) => f('year', e.target.value)} size="small" placeholder="2025" />
            <TextField label="ลำดับ (Order)" value={form.order} onChange={(e) => f('order', Number(e.target.value))} size="small" type="number" />
            <TextField label="Deploy Label" value={form.deployLabel} onChange={(e) => f('deployLabel', e.target.value)} size="small" placeholder="Vercel + Railway" />
            <TextField label="Deploy Detail" value={form.deployDetail} onChange={(e) => f('deployDetail', e.target.value)} size="small" placeholder="Custom Domain · Auto CI/CD" />
          </Box>

          {/* ── Accent color ── */}
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1 }}>Accent Color</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {ACCENT_COLORS.map((c) => (
                <Box key={c} onClick={() => f('accent', c)}
                  sx={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: c, cursor: 'pointer',
                    outline: form.accent === c ? `2px solid ${c}` : '2px solid transparent', outlineOffset: 2, transition: 'outline 0.15s' }} />
              ))}
              <TextField value={form.accent} onChange={(e) => f('accent', e.target.value)} size="small"
                sx={{ width: 110 }} slotProps={{ htmlInput: { style: { fontSize: '0.75rem', padding: '6px 10px' } } }} />
            </Box>
          </Box>

          {/* ── Description ── */}
          <TextField label="คำอธิบาย *" value={form.description} onChange={(e) => f('description', e.target.value)}
            size="small" multiline rows={3} />

          <Divider sx={{ borderColor: '#e2e8f0' }} />

          {/* ── Tech Stack ── */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="caption" sx={{ color: '#64748b', letterSpacing: '0.08em' }}>TECH STACK</Typography>
              <Button size="small" startIcon={<AddIcon />} onClick={addStackGroup}
                sx={{ color: '#64748b', fontSize: '0.65rem', '&:hover': { color: '#0f172a' } }}>
                เพิ่ม Group
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {form.stack.map((group, gi) => (
                <Box key={gi} sx={{ border: '1px solid #e2e8f0', p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <TextField
                      value={group.group}
                      onChange={(e) => updateGroupName(gi, e.target.value)}
                      size="small" placeholder="ชื่อ Group เช่น Frontend"
                      sx={{ flex: 1 }}
                      slotProps={{ htmlInput: { style: { fontSize: '0.8rem' } } }}
                    />
                    <IconButton size="small" onClick={() => removeStackGroup(gi)} sx={{ color: '#94a3b8', '&:hover': { color: '#f87171' } }}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1.5, minHeight: 28 }}>
                    {group.items.map((item, ii) => (
                      <Chip key={ii} label={item} size="small" onDelete={() => removeStackItem(gi, ii)}
                        sx={{ height: 24, fontSize: '0.72rem', backgroundColor: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' }} />
                    ))}
                    {group.items.length === 0 && (
                      <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8', alignSelf: 'center' }}>ยังไม่มี item</Typography>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      value={stackItemInputs[gi] ?? ''}
                      onChange={(e) => setStackItemInputs((prev) => prev.map((v, i) => i === gi ? e.target.value : v))}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addStackItem(gi); } }}
                      size="small" placeholder="พิมพ์ชื่อ tech แล้วกด Enter หรือ +"
                      sx={{ flex: 1 }}
                      slotProps={{ htmlInput: { style: { fontSize: '0.78rem' } } }}
                    />
                    <IconButton size="small" onClick={() => addStackItem(gi)}
                      sx={{ border: '1px solid #e2e8f0', borderRadius: 0, color: '#64748b', '&:hover': { color: '#38bdf8', borderColor: '#38bdf8' } }}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          <Divider sx={{ borderColor: '#e2e8f0' }} />

          {/* ── Modules ── */}
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', letterSpacing: '0.08em', display: 'block', mb: 1.5 }}>MODULES / FEATURES</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1.5, minHeight: 32 }}>
              {form.modules.map((mod) => (
                <Chip key={mod} label={mod} size="small" onDelete={() => removeModule(mod)}
                  sx={{ height: 26, fontSize: '0.72rem', backgroundColor: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' }} />
              ))}
              {form.modules.length === 0 && (
                <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8', alignSelf: 'center' }}>ยังไม่มี module</Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                value={moduleInput}
                onChange={(e) => setModuleInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addModule(); } }}
                size="small" placeholder="เช่น Admin Dashboard, Contact Form…"
                sx={{ flex: 1 }}
                slotProps={{ htmlInput: { style: { fontSize: '0.78rem' } } }}
              />
              <IconButton size="small" onClick={addModule}
                sx={{ border: '1px solid #e2e8f0', borderRadius: 0, color: '#64748b', '&:hover': { color: '#38bdf8', borderColor: '#38bdf8' } }}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Divider sx={{ borderColor: '#e2e8f0' }} />

          <FormControlLabel label="เผยแพร่ (Published)" control={
            <Switch checked={form.published} onChange={(e) => f('published', e.target.checked)} size="small" />
          } />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: '#64748b' }}>ยกเลิก</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving || !form.title}
            sx={{ backgroundColor: '#38bdf8', color: '#fff', '&:hover': { backgroundColor: '#0ea5e9' }, minWidth: 100 }}>
            {saving ? <CircularProgress size={18} /> : 'บันทึก'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
