import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const TestCaseList = () => {
    const { moduleId, projectId } = useParams();  // Получаем ID модуля и проекта из URL
    const [testCases, setTestCases] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/testcases/module/${moduleId}`, { withCredentials: true })
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
                                <Link to={`/projects/${projectId}/modules/${moduleId}/testcases/${testCase.id}`}>
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
