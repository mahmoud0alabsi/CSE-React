import {
    createCommit,
    getAllCommitsByBranch,
    getCommitById,
    getLatestCommitByBranch,
    getLatestCommitFilesByBranch,
    getFileContentById,
    getCommitFilesByCommitId
} from './commits.js';

export const handleCreateCommit = async (projectId, branchId, commitDTO) => {
    if (!commitDTO || !commitDTO.message || commitDTO.message.trim().length < 1) {
        return { success: false, message: "Commit message is required." };
    }

    return await createCommit(projectId, branchId, commitDTO);
};

export const handleGetAllCommitsByBranch = async (projectId, branchId) => {
    if (!projectId || !branchId) {
        return { success: false, message: "Project ID and Branch ID are required." };
    }

    return await getAllCommitsByBranch(projectId, branchId);
};

export const handleGetCommitById = async (projectId, branchId, commitId) => {
    if (!commitId) {
        return { success: false, message: "Commit ID is required." };
    }

    return await getCommitById(projectId, branchId, commitId);
};

export const handleGetLatestCommitByBranch = async (projectId, branchId) => {
    if (!projectId || !branchId) {
        return { success: false, message: "Project ID and Branch ID are required." };
    }

    return await getLatestCommitByBranch(projectId, branchId);
};

export const handleGetLatestCommitFilesByBranch = async (projectId, branchId, includeContent = false) => {
    if (!projectId || !branchId) {
        return { success: false, message: "Project ID and Branch ID are required." };
    }

    let files = await getLatestCommitFilesByBranch(projectId, branchId, includeContent);
    if (!files || !files.data || files.data.length === 0) {
        return { success: true, data: [] };
    }
    files = files.data.map(file => {
        return {
            ...file,
            content: file.content || null,
            status: 'fetched',
        };
    });
    return { success: true, data: files };
};

export const handleGetFileContentById = async (projectId, branchId, fileId) => {
    if (!fileId) {
        return { success: false, message: "File ID is required." };
    }

    return await getFileContentById(projectId, branchId, fileId);
};

export const handleGetCommitFilesByCommitId = async (projectId, branchId, commitId, includeContent = false) => {
    if (!commitId) {
        return { success: false, message: "Commit ID is required." };
    }

    return await getCommitFilesByCommitId(projectId, branchId, commitId, includeContent);
};  