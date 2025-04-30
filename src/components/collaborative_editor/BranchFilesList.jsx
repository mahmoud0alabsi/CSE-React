import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  List,
  ListItemButton,
  ListItemIcon,
  Typography,
  Stack,
  Chip,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import CreateFileDialog from './CreateFileDialog';
import { getFileColorByExtension } from './LanguagesData';
import { sendFileMessage } from '../../services/sessionSyncService';
import { addFile, setSelectedFile, updateSelectedFileContent, setEditorLoading, setCode } from '../../state_managment/collaborativeSlice';
import { extensionIconMap } from './LanguagesData';

const getExtension = (filename) => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

const BranchFilesList = () => {
  const dispatch = useDispatch();
  const projectId = useSelector((state) => state.collaborative.projectId);
  const branchId = useSelector((state) => state.collaborative.selectedBranchId);
  const files = useSelector((state) => state.collaborative.filesByBranch[branchId] || []);
  const status = useSelector((state) => state.collaborative.status);
  const selectedFile = useSelector((state) => state.collaborative.selectedFile || null);

  const handleCreateNewFile = (newFile) => {
    const file = {
      id: `file-${Date.now()}`,
      branchId: branchId,
      projectId: projectId,

      name: newFile.name,
      content: '',
      extension: newFile.extension,
      language: newFile.language,
      createdAt: new Date().toISOString(),
      author: localStorage.getItem('username') || 'user',
    };
    dispatch(
      addFile({
        branchId,
        file: { ...file, status: 'new', },
      })
    );
    dispatch(setSelectedFile(file));
    sendFileMessage(projectId, file);
  };

  const handleFileSelect = (file) => {
    if (!file || file.id === selectedFile?.id) return;
    if (selectedFile) {
      dispatch(updateSelectedFileContent());
    } else {
      dispatch(setCode({ code: file.content }));
    }
    dispatch(setEditorLoading(true));
    setTimeout(() => {
      dispatch(setSelectedFile(file));
    }, 500);
  };

  return (
    <div>
      {status === 'loading' && (
        <Stack direction="row" justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
          <CircularProgress />
        </Stack>
      )}

      {status !== 'loading' && files.length > 0 && (
        <List dense disablePadding>
          {files.map((file) => {
            const ext = getExtension(file.extension || file.name);
            const langColor = getFileColorByExtension(ext);

            return (
              <ListItemButton
                key={file.id}
                onClick={() => handleFileSelect(file)}
                sx={{
                  gap: 1.0,
                  py: 1,
                  px: 0.5,
                  mb: 0.5,
                  borderRadius: 1,
                  backgroundColor: selectedFile?.id === file.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.04)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: langColor }}>
                  {extensionIconMap[ext] || extensionIconMap.default}
                </ListItemIcon>
                <Stack direction="row" sx={{ width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                      lineHeight: 1.4,
                    }}
                  >
                    {file.name}.{ext}
                  </Typography>
                  {file.status === 'new' && (
                    <Chip
                      label="new"
                      color="success"
                      size="semi-small"
                      sx={{
                        height: 16,
                        textTransform: 'uppercase',
                        fontWeight: 'normal',
                        px: 0.05,
                        fontSize: '0.5rem',
                      }}
                    />
                  )}
                </Stack>
              </ListItemButton>
            );
          })}
        </List>
      )}

      {status !== 'loading' && files.length === 0 && branchId && (
        <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
          No files found in this branch.
        </Typography>
      )}

      {status !== 'loading' && branchId && (
        <CreateFileDialog onCreate={handleCreateNewFile}
          filesList={files}
        />
      )}
    </div>
  );
};

export default BranchFilesList;