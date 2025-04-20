import {
  createProject,
  updateProject,
  deleteProject,
  getAllProjects,
  getProjectById,
} from './project';

export const handleCreateProject = async ({ name, description }) => {
  try {
    const response = await createProject({ name, description });
    return {
      success: true,
      message: response,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || "Failed to create project",
    };
  }
};

export const handleUpdateProject = async (id, { name, description }) => {
  try {
    const updatedProject = await updateProject(id, { name, description });
    return {
      success: true,
      data: updatedProject,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || "Failed to update project",
    };
  }
};

export const handleDeleteProject = async (id) => {
  try {
    const response = await deleteProject(id);
    return {
      success: true,
      message: response,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || "Failed to delete project",
    };
  }
};

export const handleGetAllProjects = async () => {
  try {
    const projects = await getAllProjects();
    return {
      success: true,
      data: projects,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || "Failed to fetch projects",
    };
  }
};

export const handleGetProjectById = async (id) => {
  try {
    const project = await getProjectById(id);
    return {
      success: true,
      data: project,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || "Project not found",
    };
  }
};
