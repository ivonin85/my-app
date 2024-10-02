import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Table, Button, Typography } from 'antd';
import TestCaseService from '../services/TestCaseService';

const { Title } = Typography;

const TestCaseList = () => {
    const { moduleId, projectId } = useParams();
    const [testCases, setTestCases] = useState([]);

    useEffect(() => {
        TestCaseService.getTestCasesByModuleId(moduleId)
            .then(response => setTestCases(response.data))
            .catch(error => console.error('Ошибка при загрузке тест-кейсов', error));
    }, [moduleId]);

    if (testCases.length === 0) {
        return <p>Тест-кейсов нет</p>;
    }

    const columns = [
        {
            title: 'Заголовок',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Приоритет',
            dataIndex: 'priority',
            key: 'priority',
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Дата создания',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => new Date(text).toLocaleDateString(),
        },
        {
            title: 'ID последнего редактора',
            dataIndex: 'executor',
            key: 'executor',
            render: (executor) => (executor ? executor.id : 'Не назначен'),
        },
        {
            title: 'Действия',
            key: 'action',
            render: (text, record) => (
                <Link to={`/testcases/${record.id}`} state={{ projectId, moduleId }}>
                    Просмотр
                </Link>
            ),
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
                bordered={false} // Убираем границы между строками
                style={{ borderCollapse: 'collapse' }} // Убираем границы между столбцами
                rowClassName="test-case-row" // Класс для строк (можно использовать для дальнейшей стилизации)
            />
            <Link to="/testcases/create" state={{ projectId, moduleId }}>
                <Button type="primary" style={{ marginTop: '16px' }}>Создать новый тест-кейс</Button>
            </Link>
        </div>
    );
};

export default TestCaseList;
