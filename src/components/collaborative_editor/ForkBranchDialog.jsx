import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { useSelector } from 'react-redux';

export default function ForkBranchDialog({
    open,
    onClose,
    onCreate,
}) {
    const branches = useSelector((state) => state.collaborative.branches) || [];
    const [baseBranchId, setBaseBranchId] = useState('');
    const [forkedBranchName, setForkedBranchName] = useState('');

    const handleSubmit = () => {
        if (baseBranchId && forkedBranchName.trim()) {
            onCreate({ baseBranchId, forkedBranchName });
            setBaseBranchId('');
            setForkedBranchName('');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ pb: 0 }}>
                <Typography component="div" variant="h6">
                    Fork Branch
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ pt: 1 }}>
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="base-branch-label">Base Branch</InputLabel>
                    <Select
                        labelId="base-branch-label"
                        value={baseBranchId}
                        label="Base Branch"
                        onChange={(e) => setBaseBranchId(e.target.value)}
                    >
                        {branches.length === 0 && (
                            <MenuItem value="" disabled>
                                No branches available
                            </MenuItem>
                        )}
                        {branches.map((branch) => (
                            <MenuItem key={branch.id} value={branch.id}>
                                {branch.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    autoFocus
                    label="Forked Branch Name"
                    fullWidth
                    variant="outlined"
                    placeholder="e.g. feature/login-ui-fork"
                    value={forkedBranchName}
                    onChange={(e) => setForkedBranchName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    sx={{ mt: 2 }}
                />
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
                <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
                    <Button onClick={onClose} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!baseBranchId || !forkedBranchName.trim()}
                    >
                        Fork
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
}