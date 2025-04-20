import React from 'react';
import { useSelector } from 'react-redux';
import { Backdrop, CircularProgress } from '@mui/material';

export default function GlobalLoadingSpinner() {
    const loading = useSelector((state) => state.ui.loading);

    return (
        <Backdrop open={loading} sx={{ zIndex: 1300, color: '#fff', backgroundColor: 'rgba(12, 16, 23, 1.0)' }}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}
