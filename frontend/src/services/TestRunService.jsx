import axios from 'axios';

const API_URL = 'http://localhost:8080/api/test-run';

const createTestRun = async (testPlanId, projectId, testRunName) => {
    const response = await axios.post(
        `${API_URL}/create/${testPlanId}`, 
        {   name: testRunName,
            projectId: projectId 
         },
        { withCredentials: true }
    );
    return response.data;
};

const getTestRunsByProjectId = async (projectId) => {
    const response = await axios.get(`${API_URL}/project-id/${projectId}`, { withCredentials: true });
    return response.data;
};

export default {
    createTestRun,
    getTestRunsByProjectId
};