import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

const register = (email, password) => {
    return axios.post(`${API_URL}register`, { email, password });
};

const login = (email, password) => {
    return axios.post(`${API_URL}login`, { email, password }, { withCredentials: true });
};

export default {
    register,
    login,
};
