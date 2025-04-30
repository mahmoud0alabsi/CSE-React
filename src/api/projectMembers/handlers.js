import {
    addProjectMember,
    removeProjectMember,
    changeProjectMemberRole,
    getProjectMembers,
} from './projectMembers';

export const handleAddMember = async (projectId, { username, role }) => {
    try {
        const response = await addProjectMember(projectId, { username, role });
        return {
            success: true,
            message: response,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data || "Failed to add member",
        };
    }
};

export const handleRemoveMember = async (projectId, username) => {
    try {
        const response = await removeProjectMember(projectId, username);
        return {
            success: true,
            message: response,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data || "Failed to remove member",
        };
    }
};

export const handleChangeMemberRole = async (projectId, { memberName, role }) => {
    try {
        const response = await changeProjectMemberRole(projectId, { memberName, role });
        return {
            success: true,
            message: response,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data || "Failed to change member role",
        };
    }
};

export const handleGetProjectMembers = async (projectId) => {
    try {
        const members = await getProjectMembers(projectId);
        return {
            success: true,
            message: members,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data || "Failed to get project members",
        };
    }
};
