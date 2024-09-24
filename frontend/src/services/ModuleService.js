import axios from 'axios';

const API_URL = 'http://localhost:8080/api/modules';

const getModuleById = (moduleId) => {
    return axios.get(`${API_URL}/${moduleId}`, { withCredentials: true });
};

const createModule = (moduleData) => {
    return axios.post(`${API_URL}`, moduleData, { withCredentials: true });
};

const updateModule = (moduleId, moduleData) => {
    return axios.put(`${API_URL}/${moduleId}`, moduleData, { withCredentials: true });
};

const deleteModule = (moduleId) => {
    return axios.delete(`${API_URL}/${moduleId}`, { withCredentials: true });
};

const getModulesByProjectId = (projectId) => {
    return axios.get(`${API_URL}/project/${projectId}`, { withCredentials: true });
};

export default {
    getModuleById,
    getModulesByProjectId,
    updateModule,
    createModule,
    deleteModule
};
