import api from "../api";

export const createCommit = async (projectId, branchId, commitDTO) => {
    try {
        const response = await api.post(`/commits/p/${projectId}/b/${branchId}`, commitDTO);
        return { success: true, data: response.data }; // created commit data
    } catch (err) {
        return { success: false, message: err.response?.data || err.message };
    }
};

export const getAllCommitsByBranch = async (projectId, branchId) => {
    try {
        const response = await api.get(`/commits/p/${projectId}/b/${branchId}`);
        return { success: true, data: response.data }; // list of commits
    } catch (err) {
        return { success: false, message: err.response?.data || err.message };
    }
};

export const getCommitById = async (projectId, branchId, commitId) => {
    try {
        const response = await api.get(`/commits/p/${projectId}/b/${branchId}/c/${commitId}`);
        return { success: true, data: response.data }; // commit details
    } catch (err) {
        return { success: false, message: err.response?.data || err.message };
    }
};

export const getLatestCommitByBranch = async (projectId, branchId) => {
    try {
        const response = await api.get(`/commits/p/${projectId}/b/${branchId}/latest`);
        return { success: true, data: response.data }; // latest commit
    } catch (err) {
        return { success: false, message: err.response?.data || err.message };
    }
};

export const getLatestCommitFilesByBranch = async (projectId, branchId, includeContent = false) => {
    try {
        const response = await api.get(`/commits/p/${projectId}/b/${branchId}/latest/files`, {
            params: { includeContent },
        });
        return { success: true, data: response.data }; // list of files in the latest commit
    } catch (err) {
        return { success: false, message: err.response?.data || err.message };
    }
};

export const getFileContentById = async (projectId, branchId, fileId) => {
    try {
        const response = await api.get(`/commits/p/${projectId}/b/${branchId}/latest/files/${fileId}`);
        return { success: true, data: response.data }; // file content
    } catch (err) {
        return { success: false, message: err.response?.data || err.message };
    }
};

export const getCommitFilesByCommitId = async (projectId, branchId, commitId, includeContent = false) => {
    try {
        const response = await api.get(`/commits/p/${projectId}/b/${branchId}/c/${commitId}/files`, {
            params: { includeContent },
        });
        return { success: true, data: response.data }; // list of files in the commit
    } catch (err) {
        return { success: false, message: err.response?.data || err.message };
    }
};
