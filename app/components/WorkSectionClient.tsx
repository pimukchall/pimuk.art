'use client';

import { useState } from 'react';
import type { Project } from '@prisma/client';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

type StackGroup = { group: string; items: string[] };

export default function WorkSectionClient({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const [imgIdx, setImgIdx] = useState(0);

  const openProject = (p: Project) => {
    setSelected(p);
    setImgIdx(0);
  };

  const images = selected ? (selected.images as string[]) : [];

  return (
    <>
      <Box
        component="section"
        id="work"
        sx={{
          py: { xs: 12, md: 18 },
          backgroundColor: 'background.default',
          borderTop: '1px solid', borderTopColor: 'divider',
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 4, md: 10 } }}>
          {/* Section header */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'flex-end' },
              mb: { xs: 8, md: 12 },
              gap: 4,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: '0.7rem',
                  color: '#38bdf8',
                  mb: 2,
                  letterSpacing: '0.05em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Box component="span" sx={{ color: '#94a3b8' }}>//</Box> 01_work
              </Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
                Selected Work
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
              ระบบ Production จริง — ออกแบบและพัฒนาเองทั้งหมดตั้งแต่ Database Schema จนถึง Deployment
            </Typography>
          </Box>

          {/* Project cards */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 2 } }}>
            {projects.map((project, index) => {
              const id = String(index + 1).padStart(2, '0');
              const stack = project.stack as StackGroup[];
              const modules = project.modules as string[];

              return (
                <Box
                  key={project.id}
                  onClick={() => openProject(project)}
                  sx={{
                    border: '1px solid', borderColor: 'divider',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'border-color 0.25s ease, transform 0.2s ease',
                    '&:hover': {
                      borderColor: project.accent + '80',
                      transform: 'translateY(-1px)',
                      '& .view-cue': { opacity: 1 },
                    },
                  }}
                >
                  <Box
                    className="view-cue"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      zIndex: 2,
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      fontFamily: 'var(--font-geist-mono), monospace',
                      fontSize: '0.6rem',
                      color: project.accent,
                      letterSpacing: '0.05em',
                      backgroundColor: 'background.default',
                      border: '1px solid',
                      borderColor: project.accent + '55',
                      px: 1,
                      py: 0.4,
                    }}
                  >
                    View →
                  </Box>
                  <Grid container>
                    {/* Left panel */}
                    <Grid size={{ xs: 12, md: 3 }}>
                      <Box
                        sx={{
                          minHeight: { xs: 'auto', md: 380 },
                          backgroundColor: 'background.default',
                          display: 'flex',
                          flexDirection: { xs: 'row', md: 'column' },
                          alignItems: 'center',
                          justifyContent: { xs: 'space-between', md: 'center' },
                          position: 'relative',
                          p: { xs: 3, md: 4 },
                          gap: { xs: 2, md: 0 },
                          borderRight: { md: '1px solid' }, borderRightColor: { md: 'divider' },
                          overflow: 'hidden',
                        }}
                      >
                        {project.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15 }}
                          />
                        ) : null}

                        <Typography
                          sx={{
                            fontFamily: 'var(--font-geist-mono), monospace',
                            fontSize: { xs: '3rem', md: '7rem' },
                            fontWeight: 100,
                            color: project.accent + '20',
                            lineHeight: 1,
                            userSelect: 'none',
                            mb: { xs: 0, md: 2 },
                            flexShrink: 0,
                            letterSpacing: '-0.05em',
                            position: 'relative',
                          }}
                        >
                          {id}
                        </Typography>

                        <Box sx={{ textAlign: { xs: 'right', md: 'center' }, flex: 1, position: 'relative' }}>
                          <Box sx={{ px: 2, py: 0.75, border: '1px solid #e2e8f0', display: 'inline-block', mb: 1 }}>
                            <Typography sx={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.6rem', color: project.accent, display: 'block', letterSpacing: '0.08em' }}>
                              {project.deployLabel}
                            </Typography>
                            <Typography sx={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.55rem', color: '#64748b', letterSpacing: '0.05em' }}>
                              {project.deployDetail}
                            </Typography>
                          </Box>

                          {project.url ? (
                            <Typography
                              component="span"
                              sx={{ display: 'block', fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.55rem', color: '#64748b', letterSpacing: '0.05em' }}
                            >
                              ↗ {project.url.replace('https://', '')}
                            </Typography>
                          ) : (
                            <Typography sx={{ display: 'block', fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.55rem', color: '#94a3b8', letterSpacing: '0.05em' }}>
                              🔒 not public
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Grid>

                    {/* Right panel */}
                    <Grid size={{ xs: 12, md: 9 }}>
                      <Box sx={{ p: { xs: 3, md: 5 }, height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.75 }}>
                            <Typography variant="h3" sx={{ fontSize: { xs: '1.5rem', md: '1.875rem' } }}>
                              {project.title}
                            </Typography>
                            <Typography sx={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.65rem', color: '#64748b', mt: 0.5, flexShrink: 0 }}>
                              {project.year}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                            <Typography sx={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.65rem', color: project.accent, letterSpacing: '0.05em' }}>
                              {project.category}
                            </Typography>
                            <Box sx={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: '#94a3b8' }} />
                            <Typography sx={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.6rem', color: '#64748b' }}>
                              {project.type}
                            </Typography>
                          </Box>
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                          {project.description}
                        </Typography>

                        <Divider sx={{ borderColor: 'divider' }} />

                        <Grid container spacing={0}>
                          {stack.map((s, i) => (
                            <Grid key={s.group} size={{ xs: 12, sm: 4 }}>
                              <Box sx={{
                                pl: i > 0 ? { sm: 3 } : 0,
                                borderLeft: i > 0 ? { sm: '1px solid' } : 'none', borderLeftColor: i > 0 ? 'divider' : undefined,
                                pb: { xs: i < stack.length - 1 ? 3 : 0, sm: 0 },
                                mb: { xs: i < stack.length - 1 ? 3 : 0, sm: 0 },
                                borderBottom: { xs: i < stack.length - 1 ? '1px solid' : 'none', sm: 'none' },
                              }}>
                                <Typography sx={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.6rem', color: project.accent, display: 'block', mb: 1.5, letterSpacing: '0.05em' }}>
                                  {s.group}
                                </Typography>
                                {s.items.map((item) => (
                                  <Typography key={item} variant="body2" color="text.secondary" sx={{ mb: 0.75, fontSize: '0.8rem' }}>
                                    {item}
                                  </Typography>
                                ))}
                              </Box>
                            </Grid>
                          ))}
                        </Grid>

                        <Divider sx={{ borderColor: 'divider' }} />

                        <Box>
                          <Typography sx={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.6rem', color: '#64748b', display: 'block', mb: 1.5, letterSpacing: '0.05em' }}>
                            // modules
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {modules.map((mod) => (
                              <Chip key={mod} label={mod} size="small"
                                sx={{ height: 22, fontSize: '0.58rem', color: '#64748b', '&:hover': { borderColor: project.accent + '50', color: project.accent }, transition: 'all 0.2s' }} />
                            ))}
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* ── Project Modal ── */}
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 0,
              maxHeight: '90vh',
            },
          },
        }}
      >
        {selected && (() => {
          const stack = selected.stack as StackGroup[];
          const modules = selected.modules as string[];
          return (
            <>
              {/* Image gallery */}
              {images.length > 0 && (
                <Box sx={{ position: 'relative', backgroundColor: '#000', aspectRatio: '16/7', overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={images[imgIdx]}
                    alt={selected.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  {images.length > 1 && (
                    <>
                      <IconButton
                        onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                        sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', backgroundColor: '#000a', color: '#fff', '&:hover': { backgroundColor: '#000d' } }}
                      >
                        <ArrowBackIosNewIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                        sx={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', backgroundColor: '#000a', color: '#fff', '&:hover': { backgroundColor: '#000d' } }}
                      >
                        <ArrowForwardIosIcon fontSize="small" />
                      </IconButton>

                      {/* Dots */}
                      <Box sx={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 0.75 }}>
                        {images.map((_, i) => (
                          <Box key={i} onClick={() => setImgIdx(i)}
                            sx={{ width: i === imgIdx ? 20 : 6, height: 6, backgroundColor: i === imgIdx ? selected.accent : '#ffffff40', cursor: 'pointer', transition: 'all 0.2s' }} />
                        ))}
                      </Box>
                    </>
                  )}

                  <IconButton
                    onClick={() => setSelected(null)}
                    size="small"
                    sx={{ position: 'absolute', top: 12, right: 12, backgroundColor: '#000a', color: '#fff', '&:hover': { backgroundColor: '#000d' } }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}

              <DialogContent sx={{ p: { xs: 3, md: 4 } }}>
                {/* Close button (no image case) */}
                {images.length === 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                    <IconButton size="small" onClick={() => setSelected(null)} sx={{ color: '#64748b' }}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}

                {/* Header */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 300 }}>{selected.title}</Typography>
                    <Typography sx={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.65rem', color: '#64748b', mt: 0.5, flexShrink: 0 }}>
                      {selected.year}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
                    <Typography sx={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.65rem', color: selected.accent, letterSpacing: '0.05em' }}>
                      {selected.category}
                    </Typography>
                    <Box sx={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: '#94a3b8' }} />
                    <Typography sx={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.6rem', color: '#64748b' }}>
                      {selected.type}
                    </Typography>
                  </Box>
                  {selected.url && (
                    <Typography
                      component="a"
                      href={selected.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.7rem', color: selected.accent, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                      ↗ {selected.url.replace('https://', '')}
                    </Typography>
                  )}
                </Box>

                <Divider sx={{ borderColor: '#e2e8f0', mb: 3 }} />

                {/* Description */}
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.9, mb: 3 }}>
                  {selected.description}
                </Typography>

                <Divider sx={{ borderColor: '#e2e8f0', mb: 3 }} />

                {/* Stack */}
                <Grid container spacing={0} sx={{ mb: 3 }}>
                  {stack.map((s, i) => (
                    <Grid key={s.group} size={{ xs: 12, sm: 4 }}>
                      <Box sx={{
                        pl: i > 0 ? { sm: 3 } : 0,
                        borderLeft: i > 0 ? { sm: '1px solid #e2e8f0' } : 'none',
                        pb: { xs: i < stack.length - 1 ? 3 : 0, sm: 0 },
                        mb: { xs: i < stack.length - 1 ? 3 : 0, sm: 0 },
                        borderBottom: { xs: i < stack.length - 1 ? '1px solid #e2e8f0' : 'none', sm: 'none' },
                      }}>
                        <Typography sx={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.6rem', color: selected.accent, display: 'block', mb: 1.5, letterSpacing: '0.05em' }}>
                          {s.group}
                        </Typography>
                        {s.items.map((item) => (
                          <Typography key={item} variant="body2" color="text.secondary" sx={{ mb: 0.75, fontSize: '0.8rem' }}>
                            {item}
                          </Typography>
                        ))}
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Divider sx={{ borderColor: '#e2e8f0', mb: 3 }} />

                {/* Modules */}
                <Typography sx={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.6rem', color: '#64748b', display: 'block', mb: 1.5, letterSpacing: '0.05em' }}>
                  // modules
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {modules.map((mod) => (
                    <Chip key={mod} label={mod} size="small"
                      sx={{ height: 24, fontSize: '0.62rem', color: '#64748b', border: '1px solid #e2e8f0', '&:hover': { borderColor: selected.accent + '60', color: selected.accent }, transition: 'all 0.2s' }} />
                  ))}
                </Box>
              </DialogContent>
            </>
          );
        })()}
      </Dialog>
    </>
  );
}
