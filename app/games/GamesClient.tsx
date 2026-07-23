'use client';

import { useState, useEffect } from 'react';
import type { Game, Dlc } from '@prisma/client';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Navbar from '@/app/components/Navbar';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';

type Filter = 'all' | 'playing' | 'backlog' | 'completed' | 'dropped';

const STATUS_COLOR: Record<string, string> = {
  playing: '#38bdf8',
  completed: '#38bdf8',
  backlog: '#a78bfa',
  dropped: '#f87171',
};

const STATUS_LABEL: Record<string, string> = {
  playing: 'Playing',
  completed: 'Completed',
  backlog: 'Backlog',
  dropped: 'Dropped',
};

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'playing', label: 'Playing' },
  { key: 'backlog', label: 'Backlog' },
  { key: 'completed', label: 'Completed' },
  { key: 'dropped', label: 'Dropped' },
];

function GameCard({ game, onClick }: { game: Game; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const color = STATUS_COLOR[game.status] ?? '#888';

  return (
    <Box
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        position: 'relative',
        aspectRatio: '3/4',
        borderRadius: '4px',
        overflow: 'hidden',
        cursor: 'pointer',
        transform: hovered ? 'scale(1.03)' : 'scale(1)',
        transition: 'transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s',
        boxShadow: hovered ? `0 8px 32px ${color}33` : '0 2px 8px rgba(0,0,0,0.1)',
        backgroundColor: 'action.hover',
      }}
    >
      {game.coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={game.coverUrl}
          alt={game.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <Box sx={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 50%, #e8f4fd 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ fontSize: '2rem', opacity: 0.3 }}>🎮</Typography>
        </Box>
      )}

      {/* Glossy overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: hovered
            ? 'linear-gradient(to bottom, rgba(15,23,42,0.05) 0%, rgba(15,23,42,0.65) 60%, rgba(15,23,42,0.88) 100%)'
            : 'linear-gradient(to bottom, transparent 40%, rgba(15,23,42,0.75) 100%)',
          transition: 'background 0.2s',
        }}
      />

      {/* Glossy sheen */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.06) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Status badge */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          backgroundColor: `${color}22`,
          border: `1px solid ${color}66`,
          borderRadius: '3px',
          px: 0.75,
          py: 0.25,
          backdropFilter: 'blur(6px)',
        }}
      >
        <Typography sx={{ fontSize: '0.55rem', color, fontFamily: 'monospace', letterSpacing: '0.05em' }}>
          {STATUS_LABEL[game.status] ?? game.status}
        </Typography>
      </Box>

      {/* Rating badge on hover */}
      {hovered && game.rating != null && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: 'rgba(15,23,42,0.7)',
            borderRadius: '3px',
            px: 0.75,
            py: 0.25,
            backdropFilter: 'blur(6px)',
          }}
        >
          <Typography sx={{ fontSize: '0.6rem', color: '#facc15', fontFamily: 'monospace' }}>
            ★ {game.rating}/10
          </Typography>
        </Box>
      )}

      {/* Title & platform */}
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 1.5 }}>
        <Typography
          sx={{
            fontSize: '0.78rem',
            fontWeight: 600,
            color: '#fff',
            lineHeight: 1.3,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 0.25,
          }}
        >
          {game.title}
        </Typography>
        {game.platform && (
          <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>
            {game.platform}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

const DLC_STATUS_COLOR: Record<string, string> = {
  not_owned: '#94a3b8',
  owned: '#a78bfa',
  completed: '#38bdf8',
};
const DLC_STATUS_LABEL: Record<string, string> = {
  not_owned: 'Not Owned',
  owned: 'Owned',
  completed: 'Completed',
};

function GameDetail({ game, onClose }: { game: Game; onClose: () => void }) {
  const color = STATUS_COLOR[game.status] ?? '#888';
  const [dlcs, setDlcs] = useState<Dlc[]>([]);

  useEffect(() => {
    fetch(`/api/games/${game.id}/dlc`)
      .then((r) => r.ok ? r.json() : [])
      .then(setDlcs)
      .catch(() => {});
  }, [game.id]);

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{ paper: { sx: { backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: '8px', overflow: 'hidden' } } }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, minHeight: { sm: 420 } }}>
          {/* Cover */}
          <Box sx={{ width: { xs: '100%', sm: 260 }, flexShrink: 0, position: 'relative', backgroundColor: 'action.hover' }}>
            {game.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={game.coverUrl}
                alt={game.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: 240 }}
              />
            ) : (
              <Box sx={{ width: '100%', minHeight: 240, height: '100%', background: 'linear-gradient(135deg, #e0f2fe, #f0f9ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ fontSize: '4rem', opacity: 0.3 }}>🎮</Typography>
              </Box>
            )}
          </Box>

          {/* Details */}
          <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', gap: 2, position: 'relative' }}>
            <IconButton
              size="small"
              onClick={onClose}
              sx={{ position: 'absolute', top: 12, right: 12, color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, pr: 4, lineHeight: 1.3 }}>{game.title}</Typography>
              {game.genre && (
                <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>{game.genre}</Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label={STATUS_LABEL[game.status] ?? game.status}
                size="small"
                sx={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}55`, height: 22, fontSize: '0.68rem' }}
              />
              {game.platform && (
                <Chip label={game.platform} size="small" sx={{ backgroundColor: 'action.hover', color: 'text.secondary', border: '1px solid', borderColor: 'divider', height: 22, fontSize: '0.68rem' }} />
              )}
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {game.rating != null && (
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.25 }}>Rating</Typography>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: '#facc15' }}>★ {game.rating}<Typography component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 400 }}>/10</Typography></Typography>
                </Box>
              )}
              {game.hoursPlayed != null && (
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.25 }}>Hours</Typography>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 600 }}>{game.hoursPlayed}<Typography component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 400 }}>h</Typography></Typography>
                </Box>
              )}
              {game.completedYear != null && (
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.25 }}>Completed</Typography>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 600 }}>{game.completedYear}</Typography>
                </Box>
              )}
            </Box>

            {game.notes && (
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>Notes</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{game.notes}</Typography>
              </Box>
            )}

            {dlcs.length > 0 && (
              <Box sx={{ mt: 'auto' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1, letterSpacing: '0.08em' }}>DLC</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  {dlcs.map((dlc) => {
                    const dc = DLC_STATUS_COLOR[dlc.status] ?? '#94a3b8';
                    return (
                      <Box key={dlc.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Chip
                          label={DLC_STATUS_LABEL[dlc.status] ?? dlc.status}
                          size="small"
                          sx={{ backgroundColor: `${dc}22`, color: dc, border: `1px solid ${dc}55`, height: 18, fontSize: '0.58rem', flexShrink: 0 }}
                        />
                        <Typography sx={{ fontSize: '0.78rem', color: 'text.primary', flex: 1 }}>{dlc.name}</Typography>
                        {dlc.completedYear && (
                          <Typography sx={{ fontSize: '0.65rem', color: '#94a3b8', fontFamily: 'monospace', flexShrink: 0 }}>{dlc.completedYear}</Typography>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default function GamesClient({ games }: { games: Game[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<Game | null>(null);

  const filtered = filter === 'all' ? games : games.filter((g) => g.status === filter);

  const counts = FILTERS.reduce((acc, f) => {
    acc[f.key] = f.key === 'all' ? games.length : games.filter((g) => g.status === f.key).length;
    return acc;
  }, {} as Record<Filter, number>);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', pt: { xs: 10, md: 12 }, pb: 12 }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="caption" sx={{ color: '#38bdf8', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
            // game_collection
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 300, mt: 0.5 }}>
            Library
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {games.length} games
          </Typography>
        </Box>

        {/* Filter tabs */}
        <Box sx={{ display: 'flex', gap: 1, mb: 5, flexWrap: 'wrap' }}>
          {FILTERS.map((f) => {
            const active = filter === f.key;
            const color = f.key === 'all' ? '#fff' : STATUS_COLOR[f.key];
            return (
              <Box
                key={f.key}
                onClick={() => setFilter(f.key)}
                sx={{
                  px: 2,
                  py: 0.75,
                  borderRadius: '100px',
                  border: '1px solid',
                  borderColor: active ? (f.key === 'all' ? '#0f172a33' : `${color}66`) : '#e2e8f0',
                  backgroundColor: active ? (f.key === 'all' ? '#0f172a11' : `${color}18`) : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': { borderColor: f.key === 'all' ? '#fff5' : `${color}88` },
                }}
              >
                <Typography sx={{ fontSize: '0.72rem', color: active ? (f.key === 'all' ? '#0f172a' : color) : '#64748b', fontFamily: 'monospace', transition: 'color 0.15s' }}>
                  {f.label}
                </Typography>
                <Typography sx={{ fontSize: '0.62rem', color: active ? (f.key === 'all' ? '#64748b' : `${color}bb`) : '#94a3b8', fontFamily: 'monospace' }}>
                  {counts[f.key]}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Grid */}
        {filtered.length > 0 ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(5, 1fr)',
                xl: 'repeat(6, 1fr)',
              },
              gap: { xs: 1.5, md: 2 },
            }}
          >
            {filtered.map((game) => (
              <GameCard key={game.id} game={game} onClick={() => setSelected(game)} />
            ))}
          </Box>
        ) : (
          <Box sx={{ py: 16, textAlign: 'center' }}>
            <Typography sx={{ color: '#94a3b8', fontFamily: 'monospace' }}>no games here yet</Typography>
          </Box>
        )}
      </Container>

      {selected && <GameDetail game={selected} onClose={() => setSelected(null)} />}
    </Box>
  );
}
