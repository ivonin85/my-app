import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const TestCaseForm = () => {
    const { testCaseId } = useParams();  // Получаем projectId и moduleId из URL
    const location = useLocation();
    const { projectId, moduleId } = location.state || {};
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [preconditions, setPreconditions] = useState('');
    const [steps, setSteps] = useState([{ action: '', expectedResult: '' }]);
    const [priority, setPriority] = useState('medium');
    const [severity, setSeverity] = useState('minor');
    const [status, setStatus] = useState('Not Passed');
    const [requirements, setRequirements] = useState('');
    const [comments, setComments] = useState('');
    const [tags, setTags] = useState([]);
    const [allTags, setAllTags] = useState([]); // Все доступные теги
    const [executorId, setExecutorId] = useState(null);  // ID текущего пользователя
    const navigate = useNavigate();

    useEffect(() => {
        // Загрузка всех доступных тегов
        axios.get('http://localhost:8080/api/tags', { withCredentials: true })
            .then(response => setAllTags(response.data))
            .catch(error => console.error('Ошибка при загрузке тегов', error));

        // Получение текущего пользователя для установки как executorId
        axios.get('http://localhost:8080/api/users/profile', { withCredentials: true })
            .then(response => setExecutorId(response.data.id))  // Записываем ID текущего пользователя
            .catch(error => console.error('Ошибка при загрузке профиля', error));

        // Если редактируем существующий тест-кейс, загружаем его данные
        if (testCaseId) {
            axios.get(`http://localhost:8080/api/testcases/${testCaseId}`, { withCredentials: true })
                .then(response => {
                    const testCase = response.data;
                    setTitle(testCase.title);
                    setDescription(testCase.description);
                    setPreconditions(testCase.preconditions);
                    setSteps(testCase.steps);
                    setPriority(testCase.priority);
                    setSeverity(testCase.severity);
                    setStatus(testCase.status);
                    setRequirements(testCase.requirements);
                    setComments(testCase.comments);
                    setTags(testCase.tags.map(tag => tag.id));
                    setExecutorId(testCase.executor.id);
                })
                .catch(error => console.error('Ошибка при загрузке тест-кейса', error));
        }
    }, [testCaseId]);

    const handleStepChange = (index, field, value) => {
        const newSteps = [...steps];
        newSteps[index][field] = value;
        setSteps(newSteps);
    };

    const addStep = () => {
        setSteps([...steps, { action: '', expectedResult: '' }]);
    };

    const removeStep = (index) => {
        setSteps(steps.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const testCaseData = {
            title,
            description,
            preconditions,
            steps,
            priority,
            severity,
            status,
            requirements,
            comments,
            tags,
            executorId,
            moduleId
        };

        const request = testCaseId
            ? axios.put(`http://localhost:8080/api/testcases/${testCaseId}`, testCaseData, { withCredentials: true })
            : axios.post('http://localhost:8080/api/testcases', testCaseData, { withCredentials: true });

        request
            .then(() => {
                alert(`Тест-кейс ${testCaseId ? 'обновлен' : 'создан'} успешно!`);
                navigate(`/projects/${projectId}/modules/${moduleId}`);
            })
            .catch(error => console.error(`Ошибка при ${testCaseId ? 'обновлении' : 'создании'} тест-кейса`, error));
    };

    return (
        <div>
            <h2>{testCaseId ? 'Редактирование тест-кейса' : 'Создание тест-кейса'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Заголовок:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label>Описание:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div>
                    <label>Предусловия:</label>
                    <textarea value={preconditions} onChange={(e) => setPreconditions(e.target.value)} />
                </div>
                <div>
                    <label>Шаги:</label>
                    {steps.map((step, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                placeholder="Действие"
                                value={step.action}
                                onChange={(e) => handleStepChange(index, 'action', e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Ожидаемый результат"
                                value={step.expectedResult}
                                onChange={(e) => handleStepChange(index, 'expectedResult', e.target.value)}
                                required
                            />
                            <button type="button" onClick={() => removeStep(index)}>Удалить шаг</button>
                        </div>
                    ))}
                    <button type="button" onClick={addStep}>Добавить шаг</button>
                </div>
                <div>
                    <label>Приоритет:</label>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <option value="high">Высокий</option>
                        <option value="medium">Средний</option>
                        <option value="low">Низкий</option>
                    </select>
                </div>
                <div>
                    <label>Серьезность:</label>
                    <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
                        <option value="critical">Критическая</option>
                        <option value="major">Серьезная</option>
                        <option value="minor">Незначительная</option>
                    </select>
                </div>
                <div>
                    <label>Статус:</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="Passed">Пройден</option>
                        <option value="Not Passed">Не пройден</option>
                    </select>
                </div>
                <div>
                    <label>Теги:</label>
                    <select multiple value={tags} onChange={(e) => setTags([...e.target.selectedOptions].map(o => o.value))}>
                        {allTags.map(tag => (
                            <option key={tag.id} value={tag.id}>{tag.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Требования:</label>
                    <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} />
                </div>
                <div>
                    <label>Комментарии:</label>
                    <textarea value={comments} onChange={(e) => setComments(e.target.value)} />
                </div>
                <button type="submit">{testCaseId ? 'Обновить тест-кейс' : 'Создать тест-кейс'}</button>
            </form>
        </div>
    );
};

export default TestCaseForm;
