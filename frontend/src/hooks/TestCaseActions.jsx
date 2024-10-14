import { useState, useEffect } from 'react';
import TestCaseService from '../services/TestCaseService';

const TestCaseActions = (moduleId) => {
    const [testCases, setTestCases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTestCases = () => {
        setLoading(true);
        setError(null);
        TestCaseService.getTestCasesByModuleId(moduleId)
            .then(response => {
                setTestCases(response.data);
            })
            .catch(err => {
                console.error('Ошибка при загрузке тест-кейсов', err);
                setError(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchTestCases();
    }, [moduleId]);

    return { testCases, loading, error, fetchTestCases };
};

export default TestCaseActions;
