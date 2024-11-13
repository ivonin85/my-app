import axios from 'axios';

const API_URL = 'http://localhost:8080/api/test-results';

const saveTestResult = async (testResultDTO) => {
    const response = await axios.post(`${API_URL}`, testResultDTO, { withCredentials: true });
    return response.data;
};

const getTestResultsByTestRunId = async (testRunId) => {
    const response = await axios.get(`${API_URL}/test-run/${testRunId}`, { withCredentials: true });
    return response.data;
};

export default {
    saveTestResult,
    getTestResultsByTestRunId
};
