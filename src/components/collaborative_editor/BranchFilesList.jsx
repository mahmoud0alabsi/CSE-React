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
import JavascriptIcon from '@mui/icons-material/Javascript';
import HtmlIcon from '@mui/icons-material/Html';
import CssIcon from '@mui/icons-material/Css';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import CircularProgress from '@mui/material/CircularProgress';
import CreateFileDialog from './CreateFileDialog';
import { addFile, setSelectedFile } from '../../state_managment/collaborativeSlice';
import { getFileColorByExtension } from './LanguagesData';
import { sendFileMessage } from '../../services/sessionSyncService';
import { updateSelectedFileContent } from '../../state_managment/collaborativeSlice';

const extensionIconMap = {
  js: <JavascriptIcon fontSize="small" />,
  ts: <JavascriptIcon fontSize="small" />,
  html: <HtmlIcon fontSize="small" />,
  css: <CssIcon fontSize="small" />,
  md: <DescriptionIcon fontSize="small" />,
  json: <DescriptionIcon fontSize="small" />,
  py: <DescriptionIcon fontSize="small" />,
  default: <InsertDriveFileRoundedIcon fontSize="small" />,
};

const getExtension = (filename) => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

const BranchFilesList = ({ code }) => {
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
      dispatch(updateSelectedFileContent({ code }));
      code = '';
    }

    dispatch(setSelectedFile(file));
  };

  return (
    <div>
      {/* Display Loading Spinner */}
      {status === 'loading' && (
        <Stack direction="row" justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
          <CircularProgress />
        </Stack>
      )}

      {/* Display Files List */}
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

      {/* Display No Files Message */}
      {status !== 'loading' && files.length === 0 && (
        <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
          No files found in this branch.
        </Typography>
      )}

      <CreateFileDialog onCreate={handleCreateNewFile}
        filesList={files} // Pass the list of
      />
    </div>
  );
};

export default BranchFilesList;