import axios from 'axios';

const API_URL = 'http://localhost:8080/api/test-run';

const createTestRun = async (testPlanId, testRunName) => {
    const response = await axios.post(
        `${API_URL}/create/${testPlanId}`, 
        { name: testRunName },
        { withCredentials: true }
    );
    return response.data;
};

export default {
    createTestRun,
};