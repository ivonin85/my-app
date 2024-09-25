import axios from 'axios';

const API_URL = 'http://localhost:8080/api/projects';

const getProjectById = (projectId) => {
    return axios.get(`${API_URL}/${projectId}`, { withCredentials: true });
};

const updateProject = (projectId, projectData) => {
    return axios.put(`${API_URL}/${projectId}`, projectData, { withCredentials: true });
};

const getAllProjects = () => {
    return axios.get(API_URL, { withCredentials: true });
};

const deleteProject = (projectId) => {
    return axios.delete(`${API_URL}/${projectId}`, { withCredentials: true });
};

const createProject = (projectData) => {
    return axios.post(API_URL, projectData, { withCredentials: true });
};

export default {
    getProjectById,
    updateProject,
    getAllProjects,
    deleteProject,
    createProject
};
