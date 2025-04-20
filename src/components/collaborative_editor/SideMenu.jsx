import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import BranchFilesList from './BranchFilesList';
import SelectBranch from './SelectBranch';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectWebSocket, disconnectWebSocket } from '../../services/sessionSyncService';
import { addBranch, addFile } from '../../state_managment/collaborativeSlice';

export default function SideMenu({ code }) {
  const dispatch = useDispatch();
  const projectId = useSelector((state) => state.collaborative.projectId);

  useEffect(() => {
    const username = localStorage.getItem('username') || 'anonymous';
    connectWebSocket(
      projectId,
      username,
      (branch) => {
        if (branch.author === username) return;
        dispatch(addBranch({ ...branch, status: 'new' }));
      },
      (file) => {
        if (file.author === username) return;
        dispatch(addFile({ branchId: file.branchId, file: { ...file, status: 'new', } }));
      },
      (type, data) => {
        if (type === 'branch') {
          data.forEach((branch) => {
            dispatch(addBranch({ ...branch, status: 'new' }));
          });
        } else if (type === 'files') {
          data.forEach((file) => {
            dispatch(addFile({ branchId: file.branchId, file: { ...file, status: 'new', } }));
          });
        }
      }
    );
    return () => disconnectWebSocket();
  }, [projectId, dispatch]);

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ display: 'flex', mt: 'calc(var(--template-frame-height, 0px) + 4px)', p: 1.5 }}>
        <SelectBranch code={code} />
      </Box>
      <Divider />
      <Box sx={{ overflow: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column', px: 2 }}>
        <BranchFilesList code={code} />
      </Box>
    </Box>
  );
}