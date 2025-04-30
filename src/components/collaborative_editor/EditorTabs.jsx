import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import ChatTab from './ChatTab';
import CommitsTab from './CommitsTab';
import ThreadTab from './ThreadTab';

function TabPanel({ children, value, index }) {
  return (
    <Box
      hidden={value !== index}
      sx={{ flex: 1, display: value === index ? 'flex' : 'none', flexDirection: 'column', minHeight: 0 }}
    >
      {value === index && children}
    </Box>
  );
}

export default function EditorTabs() {
  const [tabIndex, setTabIndex] = useState(1);
  const projectId = useSelector((state) => state.collaborative.projectId);
  const role = useSelector((state) => state.collaborative.role);
  const branchId = useSelector((state) => state.collaborative.selectedBranchId);
  const file = useSelector((state) => state.collaborative.selectedFile);
  const fileId = file?.id || '';

  const handleTabChange = (event, newIndex) => setTabIndex(newIndex);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          backgroundColor: '#2a2a2a',
          color: '#fff',
          px: 1,
          minHeight: '48px',
          '& .MuiTabs-indicator': {
            backgroundColor: '#3f51b5',
            height: '2px',
            borderRadius: '3px 3px 0 0',
          },
        }}
      >
        <Tab
          label="📝 Thread"
          disabled={role === 'VIEWER' || !branchId || branchId === '__select__' || !fileId}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            color: role === 'VIEWER' ? '#555' : '#aaa',
            minHeight: '40px',
            '&.Mui-selected': {
              color: '#fff',
              fontWeight: 600,
            },
            '&:hover': {
              backgroundColor: role === 'VIEWER' ? 'inherit' : 'rgba(255,255,255,0.05)',
            },
          }}
        />
        <Tab
          label="💬 Chat"
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            color: '#aaa',
            minHeight: '40px',
            '&.Mui-selected': {
              color: '#fff',
              fontWeight: 600,
            },
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.05)',
            },
          }}
        />
        <Tab
          disabled={branchId === '__select__' || !branchId}
          label="🕘 Commits"
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            color: '#aaa',
            minHeight: '40px',
            '&.Mui-selected': {
              color: '#fff',
              fontWeight: 600,
            },
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.05)',
            },
          }}
        />
      </Tabs>

      <TabPanel value={tabIndex} index={0}>
        <Box sx={{ flex: 1, display: 'flex', height: '100%' }}>
          <ThreadTab projectId={projectId} branchId={branchId} fileId={fileId} role={role} />
        </Box>
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <Box sx={{ flex: 1, display: 'flex', height: '100%' }}>
          <ChatTab projectId={projectId} />
        </Box>
      </TabPanel>

      <TabPanel value={tabIndex} index={2} sx={{ flex: 1, overflow: 'hidden' }}>
        <CommitsTab />
      </TabPanel>
    </Box>
  );
}
