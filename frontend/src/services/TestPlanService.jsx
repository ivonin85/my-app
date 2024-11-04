import axios from 'axios';

const API_URL = 'http://localhost:8080/api/testplan';

const getTestPlans = async (projectId) => {
    try {
      const response = await axios.get(`${API_URL}/project/${projectId}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении тест-планов:', error);
      throw new Error('Не удалось загрузить тест-планы');
    }
  };

  const getTestCases = async (testPlanId) => {
    try {
      const response = await axios.get(`${API_URL}/${testPlanId}/testcases`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Не удалось загрузить тест-кейсы:', error);
      throw new Error('Не удалось загрузить тест-кейсы');
    }
  };

  const getTestPlanById = async (testPlanId) => {
    try {
      const response = await axios.get(`${API_URL}/${testPlanId}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Не удалось загрузить тест-план:', error);
      throw new Error('Не удалось загрузить тест-план');
    }
  };

export default {
    getTestPlans,
    getTestCases,
    getTestPlanById

};