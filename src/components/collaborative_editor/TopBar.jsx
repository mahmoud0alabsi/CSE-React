import React, { useState } from 'react';
import { Box, Typography, Button, Stack, Snackbar, Alert } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { showLoading } from '../../state_managment/store';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CommitModal from './CommitModal';
import { updateSelectedFileContent, addBranch } from '../../state_managment/collaborativeSlice';
import ForkBranchDialog from './ForkBranchDialog';
import MergeBranchDialog from './MergeBranchDialog';
import { handleForkBranch } from '../../api/branch/handlers';
import { sendBranchMessage } from '../../services/sessionSyncService';

export default function TopBar({
  projectName = 'Untitled Project',
  updatedAt = 'Unknown',
  role = 'VIEWER',
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const projectId = useSelector((state) => state.collaborative.projectId);
  const { selectedBranchId } = useSelector((state) => state.collaborative);
  const [commitModalOpen, setCommitModalOpen] = useState(false);
  const [forkDialogOpen, setForkDialogOpen] = useState(false);
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleBack = () => {
    dispatch(showLoading());
    navigate('/workspace');
  };

  const handleCommitBtn = () => {
    dispatch(updateSelectedFileContent());
    setTimeout(() => {
      setCommitModalOpen(true);
    }, 500);
  }

  const handleForkSelectedBranch = async ({ baseBranchId, forkedBranchName }) => {
    try {
      const response = await handleForkBranch(projectId, baseBranchId, forkedBranchName);
      if (response.success) {
        setSnackbarMessage(`Forked branch '${forkedBranchName}' successfully!`);
        setOpenSnackbar(true);
        const newBranch = {
          id: response.data.id,
          name: forkedBranchName,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
          author: localStorage.getItem('username') || 'anonymous',
          status: 'new',
        };
        dispatch(addBranch(newBranch));
        sendBranchMessage(projectId, newBranch);
        setForkDialogOpen(false);
        setTimeout(() => {
          setOpenSnackbar(false);
        }, 3000);
      } else {
        console.error('Fork failed:', response.message);
      }
    } catch (err) {
      console.error('Error forking branch:', err);
    }
  };

  return (
    <Box
      sx={{
        height: '50px',
        width: '100%',
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        px: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Button
          variant="text"
          size="medium"
          onClick={handleBack}
          startIcon={<HomeRoundedIcon sx={{ fontSize: 22 }} />}
          sx={{
            textTransform: 'none',
            color: 'text.secondary',
            fontWeight: 500,
            px: 1.5,
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        />
        <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
          {projectName}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.3 }}>
          • Updated{' '}
          {new Date(updatedAt).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          })}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          size="small"
          sx={{ textTransform: 'none' }}
          onClick={() => handleCommitBtn()}
          disabled={!selectedBranchId || role === 'VIEWER'}
        >
          Commit
        </Button>
        <Button
          variant="outlined"
          size="small"
          sx={{ textTransform: 'none' }}
          onClick={() => setForkDialogOpen(true)}
          disabled={!projectId || role === 'VIEWER'}
        >
          Fork
        </Button>
        <Button
          variant="outlined"
          size="small"
          sx={{ textTransform: 'none' }}
          onClick={() => setMergeDialogOpen(true)}
          disabled={!projectId || role === 'VIEWER'}
        >
          Merge
        </Button>

      </Stack>
      <CommitModal
        open={commitModalOpen}
        onClose={() => setCommitModalOpen(false)}
      />
      <ForkBranchDialog
        open={forkDialogOpen}
        onClose={() => setForkDialogOpen(false)}
        onCreate={handleForkSelectedBranch}
      />
      <MergeBranchDialog
        open={mergeDialogOpen}
        onClose={() => setMergeDialogOpen(false)}
      />


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
    </Box>
  );
}