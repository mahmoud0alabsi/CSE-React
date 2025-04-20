import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    List,
    ListItem,
    ListItemText,
    Divider,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { handleMergeBranch } from '../../api/branch/handlers';
import { addCommitHistory } from '../../state_managment/collaborativeSlice';

export default function MergeBranchDialog({ open, onClose }) {
    const dispatch = useDispatch();
    const { projectId, branches } = useSelector((state) => state.collaborative);
    const [sourceBranchId, setSourceBranchId] = useState('');
    const [targetBranchId, setTargetBranchId] = useState('');
    const [mergeResult, setMergeResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');


    const handleMerge = async () => {
        setIsLoading(true);
        setError(null);
        setMergeResult(null);
        try {
            const response = await handleMergeBranch(projectId, targetBranchId, sourceBranchId);
            setMergeResult(response.data);
            if (response.data && response.data.success) {
                dispatch(addCommitHistory({
                    branchId: targetBranchId,
                    commit: {
                        id: response.data.mergedCommit.id,
                        message: response.data.mergedCommit.message,
                        author: localStorage.getItem('username') || 'anonymous',
                        authorName: localStorage.getItem('username') || 'anonymous',
                        createdAt: response.data.mergedCommit.createdAt,
                    },
                }));

                setSnackbarMessage(`Merge successful! New commit created: ${response.data.mergedCommit.message}`);
                setOpenSnackbar(true);
                setTimeout(() => {
                    setOpenSnackbar(false);
                }, 4000);
            }
        } catch (err) {
            setError(err.message || 'Failed to merge branches');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setSourceBranchId('');
        setTargetBranchId('');
        setMergeResult(null);
        setError(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Merge Branches</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <FormControl fullWidth>
                        <InputLabel id="source-branch-label">Source Branch</InputLabel>
                        <Select
                            labelId="source-branch-label"
                            value={sourceBranchId}
                            label="Source Branch"
                            onChange={(e) => setSourceBranchId(e.target.value)}
                            disabled={isLoading}
                        >
                            {branches.length === 0 && (
                                <MenuItem value="" disabled>
                                    No branches available
                                </MenuItem>
                            )}
                            {branches.map((branch) => (
                                <MenuItem key={branch.id} value={branch.id} disabled={branch.id === targetBranchId}>
                                    {branch.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="target-branch-label">Target Branch</InputLabel>
                        <Select
                            labelId="target-branch-label"
                            value={targetBranchId}
                            label="Target Branch"
                            onChange={(e) => setTargetBranchId(e.target.value)}
                            disabled={isLoading}
                        >
                            {branches.length === 0 && (
                                <MenuItem value="" disabled>
                                    No branches available
                                </MenuItem>
                            )}
                            {branches.map((branch) => (
                                <MenuItem key={branch.id} value={branch.id} disabled={branch.id === sourceBranchId}>
                                    {branch.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>

                {isLoading && (
                    <Box display="flex" justifyContent="center" my={4}>
                        <CircularProgress />
                    </Box>
                )}

                {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}

                {mergeResult && (
                    <Box sx={{ mt: 2 }}>
                        {mergeResult.success ? (
                            <Typography color="success.main">
                                Merge successful! New commit created: {mergeResult.mergedCommit.message}
                            </Typography>
                        ) : (
                            <>
                                <Typography color="error" gutterBottom>
                                    Merge failed due to conflicts:
                                </Typography>
                                <List dense>
                                    {mergeResult.conflicts.map((conflict, index) => (
                                        <React.Fragment key={index}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="subtitle2">
                                                            File: {conflict.fileName} (Path: {conflict.filePath})
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Box sx={{ mt: 1 }}>
                                                            {conflict.lineConflicts.map((lineConflict) => (
                                                                <Box key={lineConflict.lineNumber} sx={{ mb: 2 }}>
                                                                    <Typography variant="body2" fontWeight="bold">
                                                                        Line {lineConflict.lineNumber}:
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                                        Base: {lineConflict.baseContent || '<empty>'}
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ color: 'warning.main' }}>
                                                                        Source: {lineConflict.sourceContent || '<empty>'}
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ color: 'error.main' }}>
                                                                        Target: {lineConflict.targetContent || '<empty>'}
                                                                    </Typography>
                                                                </Box>
                                                            ))}
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                            {index < mergeResult.conflicts.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            </>
                        )}
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={isLoading}>
                    {mergeResult?.success ? 'Close' : 'Cancel'}
                </Button>
                {!mergeResult?.success && (
                    <Button
                        onClick={handleMerge}
                        variant="contained"
                        disabled={isLoading || !sourceBranchId || !targetBranchId || sourceBranchId === targetBranchId}
                    >
                        Merge
                    </Button>
                )}
            </DialogActions>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

        </Dialog>
    );
}