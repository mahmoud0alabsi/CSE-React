import api from './api';

export async function fetchFileContent(projectId, branchId, fileId) {

    // const res = await axios.get(
    //     `${API_BASE_URL}/commits/p/${projectId}/b/${branchId}/latest/files/${fileId}`,
    //     {
    //         headers: { Authorization: `Bearer ${token}` }
    //     }
    // );

    const res = await api.get(
        `/commits/p/${projectId}/b/${branchId}/latest/files/${fileId}`,
    );

    return res.data || '';
}