import React, { useEffect, useState } from 'react';
import { Table, message, Spin } from 'antd';
import TestRunService from '../../services/TestRunService'


const TestRunsTab = ({ projectId }) => {
    const [testRuns, setTestRuns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestRuns = async () => {
            try {
                const data = await TestRunService.getTestRunsByProjectId(projectId);
                setTestRuns(data);
            } catch (error) {
                message.error('Не удалось загрузить тест-раны');
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            fetchTestRuns();
        }
    }, [projectId]);

    if (loading) return <Spin />;

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Название', dataIndex: 'name', key: 'name' },
        { title: 'Дата создания', dataIndex: 'creatAt', key: 'creatAt' }
    ];

    return <Table dataSource={testRuns} columns={columns} rowKey="id" />;
};

export default TestRunsTab;
