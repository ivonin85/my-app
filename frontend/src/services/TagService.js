import axios from 'axios';

const API_URL = 'http://localhost:8080/api/tags';

const getAllTags = () => {
    return axios.get(`${API_URL}`, { withCredentials: true });
};

export default {
    getAllTags
};