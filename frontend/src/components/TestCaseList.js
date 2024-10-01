import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TestCaseService from '../services/TestCaseService';

const TestCaseList = () => {
    const { moduleId, projectId } = useParams();  // Получаем ID модуля и проекта из URL
    const [testCases, setTestCases] = useState([]);

    useEffect(() => {
        TestCaseService.getTestCasesByModuleId(moduleId)
            .then(response => setTestCases(response.data))
            .catch(error => console.error('Ошибка при загрузке тест-кейсов', error));
    }, [moduleId]);

    if (testCases.length === 0) {
        return <p>Тест-кейсов нет</p>;
    }

    return (
        <div>
            <h2>Список тест-кейсов</h2>
            <table>
                <thead>
                    <tr>
                        <th>Заголовок</th>
                        <th>Приоритет</th>
                        <th>Статус</th>
                        <th>Дата создания</th>
                        <th>ID последнего редактора</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {testCases.map(testCase => (
                        <tr key={testCase.id}>
                            <td>{testCase.title}</td>
                            <td>{testCase.priority}</td>
                            <td>{testCase.status}</td>
                            <td>{new Date(testCase.createdAt).toLocaleDateString()}</td>
                            <td>{testCase.executor ? testCase.executor.id : 'Не назначен'}</td>
                            <td>
                                {/* Обновили путь */}
                                <Link to={`/testcases/${testCase.id}`} state={{ projectId, moduleId }}>
                                    Просмотр
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Ссылка на создание нового тест-кейса */}
            <Link to="/testcases/create" state={{ projectId, moduleId }}>
                <button>Создать новый тест-кейс</button>
            </Link>
        </div>
    );
};

export default TestCaseList;
