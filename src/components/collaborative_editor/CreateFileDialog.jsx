import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { v4 as uuidv4 } from 'uuid';
import { getLanguageByExtension } from './LanguagesData';

const CreateFileDialog = ({ onCreate, filesList }) => {
    const role = useSelector((state) => state.collaborative.role);
    const selectedBranchId = useSelector((state) => state.collaborative.selectedBranchId);
    const [open, setOpen] = useState(false);
    const [fileName, setFileName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setFileName('');
        setError('');
    };

    const validateFileName = (name) => {
        if (!name.trim()) {
            return "File name can't be empty";
        }

        if (!name.includes('.')) {
            return "File name must include an extension (e.g., example.js)";
        }

        const parts = name.split('.');
        if (parts.length < 2 || !parts[1].trim()) {
            return "File name must include a valid extension";
        }

        return null;
    };

    const checkFileExists = (name, extension) => {
        return filesList.some(file =>
            file.name === name && file.extension === extension
        );
    };

    const createNewFile = () => {
        const trimmedName = fileName.trim();
        const name = trimmedName.split('.')[0].trim();
        const extension = '.' + trimmedName.split('.').slice(1).join('.').toLowerCase();

        return {
            id: uuidv4(),
            name,
            extension,
            language: getLanguageByExtension(extension.split('.').pop()),
            content: '',
            createdAt: new Date().toISOString(),
            status: 'new',
            author: localStorage.getItem('username') || 'user',
        };
    };

    const handleCreate = async () => {
        if (role === 'VIEWER') return;

        const validationError = validateFileName(fileName);
        if (validationError) {
            setError(validationError);
            return;
        }

        const trimmedName = fileName.trim();
        const name = trimmedName.split('.')[0].trim();
        const extension = '.' + trimmedName.split('.').slice(1).join('.').toLowerCase();

        if (checkFileExists(name, extension)) {
            setError("A file with this name already exists.");
            return;
        }

        setLoading(true);
        try {
            const newFile = createNewFile();
            await onCreate(newFile);
            handleClose();
        } catch (err) {
            setError("Failed to create file.");
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => setError('');
    const handleFileNameChange = (e) => setFileName(e.target.value);

    return (
        <>
            <Button
                disabled={role === 'VIEWER' || selectedBranchId === null}
                onClick={handleOpen}
                startIcon={<AddRoundedIcon />}
                variant="outlined"
                size="small"
                sx={{
                    mt: 2,
                    width: '100%',
                    textTransform: 'none',
                    borderColor: 'divider',
                    color: 'text.secondary',
                    fontWeight: 500,
                    fontSize: '0.85rem',
                    px: 1.5,
                    py: 0.5,
                    justifyContent: 'center',
                    '&:hover': {
                        backgroundColor: 'action.hover',
                        borderColor: 'primary.main',
                        color: 'primary.main',
                    },
                }}
            >
                New File
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
                <DialogTitle>Create New File</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 1 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="File Name"
                            placeholder="example.js"
                            value={fileName}
                            onChange={handleFileNameChange}
                            autoFocus
                            disabled={loading}
                            error={!!error}
                            helperText={error}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleClose} disabled={loading}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleCreate}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : null}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
};

export default React.memo(CreateFileDialog);