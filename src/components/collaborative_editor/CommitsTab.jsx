import React from 'react';
import {
    Box,
    Typography,
    Stack,
    Avatar,
    Tooltip,
} from '@mui/material';
import GitCommitIcon from '@mui/icons-material/Commit'; // git-style icon
import { useSelector, useDispatch } from 'react-redux';

const mockCommits = [
    {
        message: '📝 Updated README with new install instructions',
        author: 'Alice Johnson',
        timestamp: '2 hours ago',
    },
    {
        message: '🎨 Refactored UI components for consistency',
        author: 'Bob Smith',
        timestamp: '5 hours ago',
    },
    {
        message: '🚀 Deployed latest version to production',
        author: 'Charlie Doe',
        timestamp: '1 day ago',
    },
];

export default function CommitsTab() {
    const dispatch = useDispatch();
    const commitsHistory = useSelector((state) => state.collaborative.commitsHistory);

    return (
        <Box
            sx={{
                height: '100%',
                overflowY: 'auto',
                bgcolor: '#1e1e1e',
                color: '#f1f1f1',
                px: 3,
                py: 2,
            }}
        >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Commit History
            </Typography>

            <Stack spacing={3} sx={{ position: 'relative', pl: 3, borderLeft: '2px solid #333' }}>
                {[...commitsHistory].reverse().map((commit, i) => (
                    <Box key={i} sx={{ position: 'relative' }}>
                        {/* Commit dot icon */}
                        <Box
                            sx={{
                                position: 'absolute',
                                left: '-14px',
                                top: '6px',
                                bgcolor: '#1e1e1e',
                                zIndex: 1,
                            }}
                        >
                            <Tooltip title="Git Commit">
                                <GitCommitIcon fontSize="small" sx={{ color: '#3f51b5' }} />
                            </Tooltip>
                        </Box>

                        <Box
                            sx={{
                                px: 2,
                                py: 1.2,
                                borderRadius: 1,
                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                transition: 'background-color 0.2s ease',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                                },
                            }}
                        >
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {commit.message}
                            </Typography>
                            <Typography variant="caption" sx={{
                                color: '#aaa',
                                textOverflow: 'ellipsis',
                            }}>
                                {commit.authorName} • {new Date(commit.createdAt).toLocaleString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true,
                                })}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
}
