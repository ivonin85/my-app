import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users/profile';

const getUserProfile = () => {
    return axios.get(API_URL, { withCredentials: true });
};

const updateUserProfile = (profileData) => {
    return axios.put(API_URL, profileData, { withCredentials: true });
};

export default {
    getUserProfile,
    updateUserProfile,
};