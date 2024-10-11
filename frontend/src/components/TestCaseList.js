import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Typography } from 'antd';
import TestCaseService from '../services/TestCaseService';

const { Title } = Typography;

const TestCaseList = () => {
    const { moduleId, projectId } = useParams();
    const [testCases, setTestCases] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        TestCaseService.getTestCasesByModuleId(moduleId)
            .then(response => setTestCases(response.data))
            .catch(error => console.error('Ошибка при загрузке тест-кейсов', error));
    }, [moduleId]);

    if (testCases.length === 0) {
        return <p>Тест-кейсов нет</p>;
    }

    const priorityColors = {
        'Высокий': 'red',
        'Средний': 'orange',
        'Низкий': 'green',
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Название тест-кейса',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Приоритет',
            dataIndex: 'priority',
            key: 'priority',
            render: (text) => (
                <span style={{
                    backgroundColor: priorityColors[text] || 'transparent',
                    padding: '2px 5px',
                    borderRadius: '5px',
                    color: 'white',
                }}>
                    {text}
                </span>
            ),
        },
        {
            title: 'Дата создания',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => new Date(text).toLocaleDateString(),
        },
        {
            title: 'Теги тест-кейса',
            dataIndex: 'tags',
            key: 'tags',
            render: (tags) => tags ? tags.join(', ') : 'Нет тегов',
        },
        {
            title: 'Дата изменения',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (text) => new Date(text).toLocaleDateString(),
        },
        ,
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
        },
    ];

    return (
        <div>
            <Title level={2}>Список тест-кейсов</Title>
            <Table
                dataSource={testCases}
                columns={columns}
                rowKey="id"
                pagination={false}
                bordered={false}
                style={{ borderCollapse: 'collapse' }}
                rowClassName="test-case-row"
                onRow={(record) => ({
                    onClick: () => {
                        navigate(`/testcases/${record.id}`, { state: { projectId, moduleId } });
                    },
                })}
            />
        </div>
    );
};

export default TestCaseList;
