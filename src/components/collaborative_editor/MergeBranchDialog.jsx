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
    Collapse,
    IconButton,
    Paper
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
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
    const [openConflicts, setOpenConflicts] = useState(false);

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

    const toggleConflicts = () => setOpenConflicts(prev => !prev);

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
                            <Paper sx={{ padding: 2, backgroundColor: 'success.light' }}>
                                <Typography color="success.main" variant="h6">
                                    Merge successful!
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    New commit created: {mergeResult.mergedCommit.message}
                                </Typography>
                            </Paper>
                        ) : (
                            <>
                                <Paper sx={{ padding: 2, backgroundColor: 'error.light' }}>
                                    <Typography color="white" variant="h6" gutterBottom>
                                        ⚠️ Merge failed due to conflicts:
                                    </Typography>
                                    <IconButton onClick={toggleConflicts}>
                                        {openConflicts ? <ExpandLess /> : <ExpandMore />}
                                    </IconButton>
                                </Paper>

                                <Collapse in={openConflicts}>
                                    <Box sx={{ backgroundColor: '#35363b', padding: 1, borderRadius: 1 }}>
                                        <List dense sx={{ mt: 1 }}>
                                            {mergeResult.conflicts.map((conflict, index) => (
                                                <React.Fragment key={index}>
                                                    <ListItem sx={{ borderBottom: 1, borderColor: 'divider', paddingY: 1 }}>
                                                        <ListItemText
                                                            primary={
                                                                <Typography variant="subtitle1" fontWeight="bold" color="white">
                                                                    <span style={{ color: 'white' }}>File:</span> {conflict.fileName}
                                                                </Typography>
                                                            }
                                                            secondary={
                                                                <Box sx={{ mt: 1 }}>
                                                                    {conflict.lineConflicts.map((lineConflict) => (
                                                                        <Box key={lineConflict.lineNumber} sx={{ mb: 2, borderRadius: 1, backgroundColor: 'background.paper', padding: 1 }}>
                                                                            <Typography variant="body2" fontWeight="bold" sx={{ color: 'text.primary' }}>
                                                                                Line {lineConflict.lineNumber}:
                                                                            </Typography>
                                                                            <Box sx={{ mt: 1 }}>
                                                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                                                    <strong>Base:</strong> {lineConflict.baseContent || '<empty>'}
                                                                                </Typography>
                                                                                <Typography variant="body2" sx={{ color: 'warning.main' }}>
                                                                                    <strong>Source:</strong> {lineConflict.sourceContent || '<empty>'}
                                                                                </Typography>
                                                                                <Typography variant="body2" sx={{ color: 'error.main' }}>
                                                                                    <strong>Target:</strong> {lineConflict.targetContent || '<empty>'}
                                                                                </Typography>
                                                                            </Box>
                                                                        </Box>
                                                                    ))}
                                                                </Box>
                                                            }
                                                        />
                                                    </ListItem>
                                                    {index < mergeResult.conflicts.length - 1 && <Divider
                                                        color='#fff'
                                                        style={{ margin: '4px 0', color: 'white', height: 1 }} />}
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </Box>
                                </Collapse>
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