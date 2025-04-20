import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardActions,
    Chip,
    Stack,
    Typography,
    Button,
    CardHeader,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import PersonIcon from '@mui/icons-material/Person';
import { useDispatch } from 'react-redux';
import { showLoading } from '../../state_managment/store';
import { useState } from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box } from '@mui/system';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

export default function ProjectCard({ projectId, name, ownerName, description, role, createdAt, updatedAt, onDeleteProject }) {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const menuOpen = Boolean(anchorEl);
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const roleColor = {
        OWNER: 'primary',
        COLLABORATOR: 'secondary',
        VIEWER: 'default',
    };

    const handleOpenEditor = () => {
        dispatch(showLoading());
        navigate('/collaborative-editor?project=' + name.split(' ').join('-'),
            {
                state: {
                    projectId: projectId,
                    projectName: name,
                    role: role,
                    updatedAt: updatedAt,
                },
            }
        )
    };

    const handleDeleteClick = () => {
        setAnchorEl(null);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        setDeleteDialogOpen(false);
        onDeleteProject(projectId);
    }

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
    }

    return (
        <Card
            variant="outlined"
            style={{ backgroundColor: '#191a20' }}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                width: '100%',
                p: 2,
                borderRadius: 3,
                borderColor: 'rgba(255, 255, 255, 0.05)',
                border: '2px solid rgba(210, 210, 210, 0.39)',
                boxShadow: '0 6px 24px rgba(0,0,0,0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: '0 8px 28px rgba(0,0,0,0.5)',
                    transform: 'translateY(-3px)',
                },
            }}
        >
            <CardContent sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    {/* <Chip
                        size="small"
                        icon={<CodeIcon fontSize="small" />}
                        variant="outlined"
                        sx={{
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            borderColor: 'rgba(255,255,255,0.1)',
                            color: 'white',
                        }}
                    /> */}
                    <Typography variant="h6" fontWeight={600}>
                        {name}
                    </Typography>
                    {role === 'OWNER' && (
                        <Box sx={{
                            position: 'relative',
                            top: 0,
                            right: 0,
                            alignSelf: 'flex-end',
                        }}>
                            <IconButton
                                size="small"
                                onClick={handleMenuOpen}
                                aria-controls={menuOpen ? 'project-menu' : undefined}
                                aria-haspopup="false"
                                aria-expanded={menuOpen ? 'true' : undefined}
                            >
                                <MoreVertIcon sx={{ color: 'white' }} />
                            </IconButton>

                            <Menu
                                id="project-menu"
                                anchorEl={anchorEl}
                                open={menuOpen}
                                onClose={handleMenuClose}
                                MenuListProps={{
                                    'aria-labelledby': 'project-menu-button',
                                }}
                            >
                                <MenuItem onClick={handleDeleteClick}>🗑️ Delete Project</MenuItem>
                            </Menu>
                        </Box>

                    )}

                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {description.length > 100 ? `${description.slice(0, 100)}...` : description}
                </Typography>

                {role !== 'OWNER' && (
                    <>
                        <Typography variant="body2" color="text.secondary">
                            Owner: <strong>{ownerName}</strong>
                        </Typography>

                        <Chip
                            icon={<PersonIcon fontSize="small" />}
                            label={role}
                            size="small"
                            color={roleColor[role] || 'default'}
                            variant="filled"
                            sx={{ width: 'fit-content' }}
                        />
                    </>
                )}

                <Typography variant="body2" color="text.secondary">
                    Created At: {new Date(createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </Typography>
            </CardContent>

            <CardActions sx={{ pt: 2 }}>
                <Button
                    fullWidth
                    onClick={handleOpenEditor}
                    size="medium"
                    sx={{
                        px: 2,
                        py: 1,
                        fontWeight: 600,
                        color: '#fff',
                        background: 'linear-gradient(to right,rgb(53, 91, 180), #8E54E9)',
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            background: 'linear-gradient(to right, #8E54E9, #4776E6)',
                            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.45)',
                            transform: 'scale(1.02)',
                        },
                    }}
                >
                    🚀 Launch Editor
                </Button>
            </CardActions>

            <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
                <DialogTitle>Delete Project</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete <strong>{name}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

        </Card>
    );
}
