import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import TopBar from '../../components/collaborative_editor/TopBar';
import AppTheme from '../../theme/AppTheme';
import PanelsSplitter from '../../components/collaborative_editor/PanelsSplitter';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hideLoading } from '../../state_managment/store';
import { useLocation } from 'react-router-dom';
import { fetchBranchesAsync, setProjectId, setRole } from '../../state_managment/collaborativeSlice';

export default function CollaborativeEditorPage(props) {
  const dispatch = useDispatch();
  const location = useLocation();
  const { projectId, projectName, role, updatedAt } = location.state || {};
  const [code, setCode] = React.useState('');

  useEffect(() => {
    if (projectId) {
      dispatch(setProjectId(projectId));
      dispatch(setRole(role));
      dispatch(fetchBranchesAsync(projectId));
    }
    dispatch(hideLoading());
  }, [dispatch, projectId, role]);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
        }}
      >
        {/* Fixed-height top bar */}
        <TopBar
          projectName={projectName}
          updatedAt={updatedAt}
          code={code}
        />

        {/* PanelsSplitter fills remaining height */}
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <PanelsSplitter onCodeChange={setCode} />
        </Box>
      </Box>
    </AppTheme>
  );
}
