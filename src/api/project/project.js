import api from "../api";

export const createProject = async ({ name, description }) => {
    const response = await api.post("/projects", { name, description });
    return response.data;
};

export const updateProject = async (id, { name, description }) => {
    const response = await api.put(`/projects/${id}`, { name, description });
    return response.data;
};

export const deleteProject = async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
};

export const getAllProjects = async () => {
    const response = await api.get("/projects");
    return response.data;
};

export const getProjectById = async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
};
