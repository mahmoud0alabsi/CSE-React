import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';
import { useState } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { getLanguageByExtension } from './LanguagesData';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';

export default function CreateFileDialog({ onCreate, filesList }) {
    const role = useSelector((state) => state.collaborative.role);
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

    const handleCreate = async () => {
        if (role === 'VIEWER') return;

        const trimmedName = fileName.trim();

        if (!trimmedName) {
            setError("");
            setError("File name can't be empty");
            return;
        }

        if (!trimmedName.includes('.')) {
            setError("");
            setError("File name must include an extension (e.g., example.js)");
            return;
        }

        const name = trimmedName.split('.')[0].trim();
        const extension = '.' + trimmedName.split('.').slice(1).map(ext => ext.trim().toLowerCase());
        if (extension.length === 0) {
            setError("");
            setError("File name must include an extension (e.g., example.js)");
            return;
        }

        const fileExists = filesList.some(file => file.name === name && file.extension === extension);
        if (fileExists) {
            setError("");
            setError("A file with this name already exists.");
            return;
        }

        setLoading(true);
        try {
            const newFile = {
                id: uuidv4(),
                name: name,
                extension: extension,
                language: getLanguageByExtension(extension.split('.').pop()),
                content: '',
                createdAt: new Date().toISOString(),
                status: 'new',
                author: localStorage.getItem('username') || 'user',
            };

            onCreate(newFile);
            setFileName('');
            handleClose();
        } catch (err) {
            setError("");
            setError("Failed to create file.");
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => setError('');

    return (
        <>
            <Button
                disabled={role === 'VIEWER'}
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
                            onChange={(e) => setFileName(e.target.value)}
                            autoFocus
                            disabled={loading}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleClose} disabled={loading}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreate} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>

        </>
    );
}