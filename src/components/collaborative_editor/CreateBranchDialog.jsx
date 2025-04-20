import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
} from '@mui/material';

export default function CreateBranchDialog({
  open,
  onClose,
  onCreate,
  value,
  onChange,
}) {
  const handleSubmit = () => {
    if (value.trim()) onCreate();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 0 }}>
        <Typography variant="h6">Create New Branch</Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <TextField
          autoFocus
          label="Branch name"
          fullWidth
          variant="outlined"
          placeholder="e.g. feature/login-ui"
          value={value}
          onChange={onChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          sx={{
            mt: 2,
          }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Create
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
