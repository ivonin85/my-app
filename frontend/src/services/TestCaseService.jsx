import axios from 'axios';

const API_URL = 'http://localhost:8080/api/testcases';

const getTestCase = (testCaseId) => {
    return axios.get(`${API_URL}/${testCaseId}`, { withCredentials: true });
};

const createTestCase = (testCaseData) => {
    return axios.post(API_URL, testCaseData, { withCredentials: true });
};

const updateTestCase = (testCaseId, testCaseData) => {
    return axios.put(`${API_URL}/${testCaseId}`, testCaseData, { withCredentials: true });
};

const deleteTestCase = (testCaseId) => {
    return axios.delete(`${API_URL}/${testCaseId}`, { withCredentials: true });
};

const getTestCasesByModuleId = (moduleId) => {
    return axios.get(`${API_URL}/module/${moduleId}`, { withCredentials: true });
};

export default {
    getTestCase,
    createTestCase,
    updateTestCase,
    deleteTestCase,
    getTestCasesByModuleId,

};
