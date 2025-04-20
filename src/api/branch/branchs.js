import api from "../api";

export const createBranch = async (projectId, name) => {
  try {
    const response = await api.post(`/branches/p/${projectId}`, { name });
    return { success: true, data: response.data };
  } catch (err) {
    return { success: false, message: err.response?.data || err.message };
  }
};

export const deleteBranch = async (projectId, branchId) => {
  try {
    await api.delete(`/branches/p/${projectId}/b/${branchId}`);
    return { success: true };
  } catch (err) {
    return { success: false, message: err.response?.data || err.message };
  }
};

export const forkBranch = async (projectId, branchId, name) => {
  try {
    const response = await api.post(
      `/branches/p/${projectId}/b/${branchId}/fork`,
      { name }
    );
    return { success: true, data: response.data };
  } catch (err) {
    return { success: false, message: err.response?.data || err.message };
  }
};

export const mergeBranch = async (projectId, targetBranchId, sourceBranchId) => {
  try {
    const response = await api.post(
      `/branches/p/${projectId}/b/merge`,
      {
        targetBranchId,
        sourceBranchId,
      }
    );
    return { success: true, data: response.data };
  } catch (err) {
    return { success: false, message: err.response?.data || err.message };
  }
}

export const getBranchesByProject = async (projectId) => {
  try {
    const response = await api.get(`/branches/p/${projectId}`);
    return { success: true, data: response.data };
  } catch (err) {
    return { success: false, message: err.response?.data || err.message };
  }
};

export const getBranchById = async (projectId, branchId) => {
  try {
    const response = await api.get(`/branches/p/${projectId}/b/${branchId}`);
    return { success: true, data: response.data };
  } catch (err) {
    return { success: false, message: err.response?.data || err.message };
  }
};
