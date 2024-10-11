import axios from 'axios';

const API_URL = 'http://localhost:8080/api/tags';

const getAllTags = () => {
    return axios.get(API_URL, { withCredentials: true });
};

const createTag = (tag) => {
    return axios.post(API_URL, tag, { withCredentials: true });
};

const getTagsByTestCaseId = (testCaseId) => {
    return axios.get(`${API_URL}/testcase/${testCaseId}`, { withCredentials: true });
};

export default {
    getAllTags,
    createTag,
    getTagsByTestCaseId
};
