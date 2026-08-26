'use client';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import type { ReactNode } from 'react';

export default function FormDialog({
  open,
  onClose,
  title,
  onSave,
  saving,
  saveDisabled,
  maxWidth = 'sm',
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  onSave: () => void;
  saving: boolean;
  saveDisabled?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md';
  children: ReactNode;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      slotProps={{ paper: { sx: { backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider' } } }}
    >
      <DialogTitle sx={{ fontWeight: 300, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {title}
        <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
        {children}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button onClick={onClose} sx={{ color: 'text.secondary' }}>ยกเลิก</Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={saving || saveDisabled}
          sx={{ backgroundColor: '#38bdf8', color: '#fff', '&:hover': { backgroundColor: '#0ea5e9' }, minWidth: 100 }}
        >
          {saving ? <CircularProgress size={18} /> : 'บันทึก'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
