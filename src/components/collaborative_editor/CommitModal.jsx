import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Typography,
    Box,
    Chip,
    CircularProgress,
    Stack,
    Snackbar,
    Alert
} from '@mui/material';
import { diffLines } from 'diff';
import { useSelector, useDispatch } from 'react-redux';
import DiffViewer from 'react-diff-viewer-continued';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import { addCommitHistory, fetchCommitFilesAsync, setCommitComparison } from '../../state_managment/collaborativeSlice';
import { handleCreateCommit } from '../../api/commit/handlers';

const getFileKey = (file) => `${file.name}.${file.extension}`;

const CommitModal = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const { projectId, selectedBranchId, filesByBranch, commitFiles, commitComparison, status } = useSelector(
        (state) => state.collaborative
    );
    const [commitMessage, setCommitMessage] = useState('');
    const [localFiles, setLocalFiles] = useState([]);
    const [isPreparing, setIsPreparing] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [isSnackbarError, setIsSnackbarError] = useState(false);
    const [isCommitting, setIsCommitting] = useState(false);
    const [isCommitAvialable, setIsCommitAvailable] = useState(false);

    // Compute local files when modal is open and branchId is valid
    useEffect(() => {
        if (open && selectedBranchId) {
            setIsPreparing(true);
            const branchFiles = filesByBranch[selectedBranchId] || [];
            setLocalFiles([...branchFiles]);
        } else {
            setLocalFiles([]);
            setIsPreparing(false);
        }
    }, [open, selectedBranchId, filesByBranch]);

    // Fetch server files on modal open
    useEffect(() => {
        if (open && selectedBranchId && projectId) {
            dispatch(fetchCommitFilesAsync({ projectId, branchId: selectedBranchId }));
        }
    }, [open, projectId, selectedBranchId, dispatch]);

    // Compare files
    useEffect(() => {
        setIsCommitAvailable(false);
        if (status !== 'loading' && commitFiles && localFiles.length > 0) {
            const comparison = [];

            // Check local files (new or updated)
            localFiles.forEach((localFile) => {
                if (localFile.status === 'new') {
                    comparison.push({ file: localFile, status: 'new' });
                    setIsCommitAvailable(true);
                } else {
                    const serverFile = commitFiles.find(
                        (sf) => getFileKey(sf) === getFileKey(localFile)
                    );
                    if (serverFile && serverFile.content !== localFile.content) {
                        const diff = diffLines(serverFile.content || '', localFile.content || '');
                        comparison.push({ file: localFile, status: 'updated', diff });
                        setIsCommitAvailable(true);
                    } else if (serverFile) {
                        comparison.push({ file: localFile, status: 'unchanged' });
                    }
                }
            });

            // Check deleted files
            commitFiles.forEach((serverFile) => {
                if (!localFiles.some((lf) => getFileKey(lf) === getFileKey(serverFile))) {
                    comparison.push({ file: serverFile, status: 'deleted' });
                    setIsCommitAvailable(true);
                }
            });

            dispatch(setCommitComparison(comparison));
            setIsPreparing(false);
        }
    }, [commitFiles, localFiles, status, dispatch]);

    const handleCommitRequest = async () => {
        try {
            setIsCommitting(true);

            const filesToCommit = localFiles.map((file) => ({
                id: file.id,
                author: file.author || localStorage.getItem('uderId') || 0,
                name: file.name,
                extension: file.extension,
                language: file.language,
                content: file.content || '',
                createdAt: file.createdAt || new Date().toISOString(),
                status: file.status,
            }));
            const response = await handleCreateCommit(projectId, selectedBranchId, {
                message: commitMessage,
                files: filesToCommit,
            });
            if (response.success) {
                dispatch(addCommitHistory({
                    branchId: selectedBranchId, commit: {
                        id: response.data.id,
                        message: commitMessage,
                        author: response.data.author || localStorage.getItem('username') || 'anonymous',
                        authorName: response.data.authorName || localStorage.getItem('username') || 'anonymous',
                        createdAt: response.data.createdAt || new Date().toISOString(),
                    }
                }));
                setSnackbarMessage('Commit completed successfully!');
                setIsSnackbarError(false);
                setOpenSnackbar(true);
                setCommitMessage('');
            } else {
                setSnackbarMessage('Commit failed: ' + response.message);
                setIsSnackbarError(true);
                setOpenSnackbar(true);
            }
        } catch (err) {
            console.error('Error committing files:', err);
        } finally {
            setIsCommitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontWeight: 600 }}>💾 Commit Changes</DialogTitle>

            <DialogContent dividers>
                {(status === 'loading' || isPreparing) && (
                    <Box display="flex" flexDirection="column" alignItems="center" my={4}>
                        <CircularProgress />
                        <Typography variant="body2" color="text.secondary" mt={2}>
                            Preparing commit...
                        </Typography>
                    </Box>
                )}

                {status !== 'loading' && !isPreparing && (
                    <>
                        <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}
                        >
                            Changed Files
                        </Typography>

                        <Box
                            sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1,
                                mb: 3,
                                // maxHeight: 300,
                                overflowY: 'auto',
                                bgcolor: 'background.paper',
                            }}
                        >
                            <List dense disablePadding>
                                {localFiles.length === 0 && commitFiles.length === 0 && (
                                    <ListItem>
                                        <Typography variant="body2" color="text.secondary">
                                            No changes to commit.
                                        </Typography>
                                    </ListItem>
                                )}

                                {commitComparison.map(({ file, status, diff }) => (
                                    <ListItem
                                        key={file.id}
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            gap: 1,
                                            borderBottom: '1px solid',
                                            borderColor: 'divider',
                                            py: 1.5,
                                            px: 2,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Stack
                                            direction="row"
                                            alignItems="start"
                                            justifyContent="space-between"
                                            sx={{ width: '100%' }}
                                        >
                                            <ListItemIcon sx={{ mt: 0.5 }}>
                                                <InsertDriveFileRoundedIcon fontSize="small" />
                                            </ListItemIcon>

                                            <ListItemText
                                                primary={
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <Typography fontSize="0.95rem">
                                                            {file.name}.{file.extension}
                                                        </Typography>
                                                        <Chip
                                                            label={status.toUpperCase()}
                                                            size="small"
                                                            sx={{
                                                                fontSize: '0.7rem',
                                                                fontWeight: 'bold',
                                                                letterSpacing: '0.5px',
                                                                bgcolor:
                                                                    status === 'new'
                                                                        ? 'success.light'
                                                                        : status === 'updated'
                                                                            ? 'warning.light'
                                                                            : 'error.light',
                                                                color: 'white',
                                                                textTransform: 'uppercase',
                                                            }}
                                                        />
                                                    </Box>
                                                }
                                            />
                                        </Stack>

                                        {status === 'updated' && diff && (
                                            <Stack
                                                direction="row"
                                                alignItems="start"
                                                justifyContent="space-between"
                                                sx={{ width: '100%' }}
                                            >
                                                <Box mt={2} width="100%" gridColumn="1 / -1">
                                                    <DiffViewer
                                                        oldValue={diff
                                                            .filter((d) => d.removed)
                                                            .map((d) => d.value)
                                                            .join('')}
                                                        newValue={diff
                                                            .filter((d) => d.added)
                                                            .map((d) => d.value)
                                                            .join('')}
                                                        splitView
                                                        hideLineNumbers={false}
                                                        styles={{
                                                            diffContainer: {
                                                                fontSize: '0.8rem',
                                                            },
                                                        }}
                                                    />
                                                </Box>
                                            </Stack>
                                        )}
                                    </ListItem>
                                ))}
                            </List>
                        </Box>

                        <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}
                        >
                            Commit Message
                        </Typography>

                        <Box
                            component="textarea"
                            value={commitMessage}
                            onChange={(e) => setCommitMessage(e.target.value)}
                            placeholder="Write a clear and concise commit message..."
                            sx={{
                                width: '100%',
                                minHeight: 120,
                                maxHeight: 300,
                                fontFamily: 'monospace',
                                fontSize: '0.95rem',
                                p: 1.5,
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                                resize: 'vertical',
                                outline: 'none',
                            }}
                        />
                    </>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleCommitRequest}
                    variant="contained"
                    disabled={status === 'loading' || isPreparing || isCommitting || !commitMessage.trim() || !isCommitAvialable}
                    startIcon={isCommitting && <CircularProgress size={16} color="inherit" />}
                >
                    {isCommitting ? 'Committing...' : 'Commit'}
                </Button>
            </DialogActions>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity={isSnackbarError ? 'error' : 'success'}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

        </Dialog>
    );
};

export default CommitModal;