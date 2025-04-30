import api from "../api";

export const addProjectMember = async (projectId, { username, role }) => {
    console.log("Adding member:", username, role);
    const response = await api.post(`/projects/${projectId}/members`,
        {
            username,
            role
        },
    );
    return response.data;
};

export const removeProjectMember = async (projectId, username) => {
    const response = await api.delete(`/projects/${projectId}/members/${username}`);
    return response.data;
};

export const changeProjectMemberRole = async (projectId, { memberName, role }) => {
    const response = await api.put(`/projects/${projectId}/members`,
        {
            username: memberName,
            role: role
        },
    );
    return response.data;
};

export const getProjectMembers = async (projectId) => {
    const response = await api.get(`/projects/${projectId}/members`);
    return response.data;
};
