import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Select,
  MenuItem,
  ListItemText,
  ListItemIcon,
  ListSubheader,
  Divider,
  styled,
  Box,
  Chip,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CreateBranchDialog from './CreateBranchDialog';
import { handleCreateBranch } from '../../api/branch/handlers';
import { sendBranchMessage } from '../../services/sessionSyncService';
import { addBranch, setSelectedBranchId, setSelectedFile, fetchFilesAsync, fetchBranchCommitsHistoryAsync } from '../../state_managment/collaborativeSlice';
import { updateSelectedFileContent } from '../../state_managment/collaborativeSlice';

const Avatar = styled('div')(({ theme }) => ({
  width: 28,
  height: 28,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  color: (theme.vars || theme).palette.text.secondary,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

function SelectBranch({ code }) {
  const dispatch = useDispatch();
  const projectId = useSelector((state) => state.collaborative.projectId);
  const role = useSelector((state) => state.collaborative.role);
  const branches = useSelector((state) => state.collaborative.branches || []);
  const branch = useSelector((state) => branches.find((b) => b.id === state.collaborative?.selectedBranchId)?.name || '__select__');
  const [openDialog, setOpenDialog] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');

  const handleSelectChange = (event) => {
    const selectedName = event.target.value;
    const selectedBranch = branches.find((b) => b.name === selectedName);
    if (selectedBranch && selectedName !== '__create__' && selectedName !== '__select__') {
      if (selectedBranch.id === branch) return; // No need to switch branches if the same one is selected

      if (branch !== null && branch !== '__select__') {
        dispatch(updateSelectedFileContent({ code })); // Save current file content before switching branches
      }
      dispatch(setSelectedFile(null)); // Clear selected file

      dispatch(setSelectedBranchId(selectedBranch.id));
      dispatch(fetchFilesAsync({ projectId, branchId: selectedBranch.id })); // Lazy load files for the selected branch
      dispatch(fetchBranchCommitsHistoryAsync({ projectId, branchId: selectedBranch.id })); // Fetch commits history for the selected branch

      code = '';
    }
  };

  const handleCreateNewBranch = () => {
    handleCreateBranch(projectId, newBranchName)
      .then((response) => {
        if (response.success) {
          const newBranch = {
            id: response.data.id,
            projectId: projectId,
            name: newBranchName,
            createdAt: response.data.createdAt,
            updatedAt: response.data.updatedAt,
            author: localStorage.getItem('username') || 'anonymous',
          };

          dispatch(addBranch(
            {
              ...newBranch,
              status: 'new',
            }
          ));
          dispatch(setSelectedBranchId(response.data.id));
          dispatch(setSelectedFile(null));

          sendBranchMessage(projectId, newBranch);
        } else {
          console.error(response.message);
        }
      })
      .finally(() => {
        setOpenDialog(false);
        setNewBranchName('');
      });
  };

  return (
    <Box>
      <Select
        labelId="branches-select"
        id="branches-select"
        value={branch}
        onChange={handleSelectChange}
        fullWidth
        displayEmpty
        inputProps={{ 'aria-label': 'Select branch' }}
        sx={{
          maxHeight: 56,
          width: 215,
          [`& .MuiSelect-select`]: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            pl: 1,
          },
        }}
      >
        <ListSubheader>Branches</ListSubheader>
        {branches.map((b) => (
          <MenuItem key={b.branchId} value={b.name} sx={{ mb: 1 }}>
            <ListItemIcon>
              <Avatar>
                <AccountTreeIcon sx={{ fontSize: '1rem' }} />
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary={b.name}
            />
            {b.status === 'new' && (
              <Chip
                label="new"
                color="success"
                size="semi-small"
                sx={{
                  height: 16,
                  textTransform: 'uppercase',
                  fontWeight: 'normal',
                  px: 0.0,
                  fontSize: '0.5rem',
                }}
              />
            )}
          </MenuItem>
        ))}
        <Divider sx={{ my: 1 }} />
        <MenuItem value="__select__" disabled>
          <ListItemIcon>
            <Avatar>
              <AccountTreeIcon sx={{ fontSize: '1rem' }} />
            </Avatar>
          </ListItemIcon>
          <ListItemText primary="Select branch…" />
        </MenuItem>
        <MenuItem value="__create__" onClick={() => setOpenDialog(true)} disabled={role === 'VIEWER'}>
          <ListItemIcon>
            <Avatar>
              <AddRoundedIcon fontSize="small" />
            </Avatar>
          </ListItemIcon>
          <ListItemText primary="Create new branch…" />
        </MenuItem>
      </Select>
      <CreateBranchDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onCreate={handleCreateNewBranch}
        value={newBranchName}
        onChange={(e) => setNewBranchName(e.target.value)}
      />
    </Box>
  );
}

export default SelectBranch;