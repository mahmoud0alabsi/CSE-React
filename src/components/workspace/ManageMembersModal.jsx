import React, { useState, useEffect } from "react";
import {
    MenuItem, Modal, Button, Typography, Grid, TextField, Box, CircularProgress,
    IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { handleGetProjectMembers, handleAddMember, handleRemoveMember } from "../../api/projectMembers/handlers";

const ManageMembersModal = ({ projectId, open, onClose, onShowSnackbar }) => {
    const [members, setMembers] = useState([]);
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberRole, setNewMemberRole] = React.useState('VIEWER');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMembers = async () => {
            setLoading(true);
            const result = await handleGetProjectMembers(projectId);
            if (result.success) {
                setMembers(result.message);
            } else {
                onShowSnackbar(result.message || "Failed to fetch members", "error");
            }
            setLoading(false);
        };

        if (open) {
            fetchMembers();
        }
    }, [open, projectId, onShowSnackbar]);

    const handleAddNewMember = async () => {
        setLoading(true);
        const newMember = { username: newMemberName, role: newMemberRole };

        const response = await handleAddMember(projectId, newMember);
        if (response.success) {
            onShowSnackbar("Member added successfully!", "success");
            setMembers((prevMembers) => [...prevMembers, newMember]);
            setNewMemberName('');
            setNewMemberRole('VIEWER');
        } else {
            onShowSnackbar(response.message || "Failed to add member", "error");
        }
        setLoading(false);
    };

    const handleRemoveMemberFromProject = async (username) => {
        setLoading(true);
        try {
            const response = await handleRemoveMember(projectId, username);
            if (response.success) {
                onShowSnackbar("Member removed successfully!", "success");
                setMembers((prevMembers) => prevMembers.filter((member) => member.username !== username));
            } else {
                onShowSnackbar(response.message || "Failed to remove member", "error");
            }
        } catch (error) {
            onShowSnackbar("Failed to remove member", "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal open={open} onClose={onClose} >
            <Box
                sx={{
                    p: 4,
                    backgroundColor: "#333",
                    color: "white",
                    borderRadius: "8px",
                    width: "750px",
                    margin: "auto",
                    marginTop: "5%",
                    boxShadow: 24,
                    maxHeight: "80vh",
                    overflowY: "auto",
                }}
            >
                <Typography variant="h6" mb={3} sx={{ textAlign: 'center' }}>
                    Manage Project Members
                </Typography>

                {/* Add Member Form at the top */}
                <Box sx={{ mb: 4, p: 2, backgroundColor: '#3a3a3a', borderRadius: '4px' }}>
                    <Typography variant="subtitle1" mb={2}>
                        Add New Member
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={8}>
                            <TextField
                                label="Username"
                                variant="outlined"
                                fullWidth
                                value={newMemberName}
                                onChange={(e) => setNewMemberName(e.target.value)}
                                sx={{
                                    backgroundColor: '#444',
                                    color: 'white',
                                    '& .MuiInputBase-root': {
                                        color: 'white',
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#555',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#888',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                select
                                label="Role"
                                variant="outlined"
                                fullWidth
                                value={newMemberRole}
                                onChange={(e) => setNewMemberRole(e.target.value)}
                                sx={{
                                    backgroundColor: '#444',
                                    color: 'white',
                                    '& .MuiInputBase-root': {
                                        color: 'white',
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#555',
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: 'white',
                                    },
                                }}
                            >
                                <MenuItem value="OWNER">Owner</MenuItem>
                                <MenuItem value="COLLABORATOR">Collaborator</MenuItem>
                                <MenuItem value="VIEWER">Viewer</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} mt={1}>
                            <Button
                                variant="contained"
                                onClick={handleAddNewMember}
                                fullWidth
                                disabled={loading || !newMemberName}
                                sx={{
                                    backgroundColor: "#555",
                                    '&:hover': {
                                        backgroundColor: "#777",
                                    },
                                }}
                            >
                                {loading ? "Adding..." : "Add Member"}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                <Box>
                    <Typography variant="subtitle1" mb={2}>
                        Current Members ({members.length})
                    </Typography>
                    {loading ? (
                        <Box display="flex" justifyContent="center">
                            <CircularProgress />
                        </Box>
                    ) : members.length === 0 ? (
                        <Typography variant="body2" sx={{ color: '#aaa', fontStyle: 'italic' }}>
                            No members added yet
                        </Typography>
                    ) : (
                        <Box sx={{
                            backgroundColor: '#3a3a3a',
                            borderRadius: '4px',
                            overflow: 'hidden'
                        }}>
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr auto',
                                p: 2,
                                borderBottom: '1px solid #555',
                                fontWeight: 'bold'
                            }}>
                                <Typography>Username</Typography>
                                <Typography>Role</Typography>
                                <Typography>Actions</Typography>
                            </Box>
                            {members.map((member) => (
                                <Box key={member.username} sx={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr auto',
                                    p: 2,
                                    borderBottom: '1px solid #555',
                                    '&:last-child': {
                                        borderBottom: 'none'
                                    }
                                }}>
                                    <Typography>{member.username}</Typography>
                                    <Typography>{member.role}</Typography>
                                    <Box>
                                        {member.role !== 'OWNER' && (
                                            <IconButton
                                                size="small"
                                                onClick={() => handleRemoveMemberFromProject(member.username)}
                                                sx={{ color: '#ff6b6b' }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            </Box>
        </Modal>
    );
};
export default ManageMembersModal;
