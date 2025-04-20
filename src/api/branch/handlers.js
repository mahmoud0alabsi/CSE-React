import {
    createBranch as apiCreateBranch,
    deleteBranch as apiDeleteBranch,
    forkBranch as apiForkBranch,
    getBranchesByProject as apiGetBranches,
    getBranchById as apiGetBranch,
    mergeBranch as apiMergeBranch,
} from "./branchs";

export const handleCreateBranch = async (projectId, name) => {
    if (!name || name.trim().length < 1) {
        return { success: false, message: "Branch name is required." };
    }

    return await apiCreateBranch(projectId, name);
};

export const handleDeleteBranch = async (projectId, branchId) => {
    if (!projectId || !branchId) {
        return { success: false, message: "Project and branch ID required." };
    }

    return await apiDeleteBranch(projectId, branchId);
};

export const handleForkBranch = async (projectId, branchId, name) => {
    if (!name || name.trim().length < 1) {
        return { success: false, message: "Fork branch name is required." };
    }

    return await apiForkBranch(projectId, branchId, name);
};

export const handleMergeBranch = async (projectId, targetBranchId, sourceBranchId) => {
    if (!projectId || !targetBranchId || !sourceBranchId) {
        return { success: false, message: "Project and branch IDs are required." };
    }

    return await apiMergeBranch(projectId, targetBranchId, sourceBranchId);
}

export const handleGetBranches = async (projectId) => {
    if (!projectId) {
        return { success: false, message: "Project ID is required." };
    }

    return await apiGetBranches(projectId);
};

export const handleGetBranchById = async (projectId, branchId) => {
    if (!projectId || !branchId) {
        return { success: false, message: "Project and Branch ID are required." };
    }

    return await apiGetBranch(projectId, branchId);
};
