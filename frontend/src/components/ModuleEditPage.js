import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ModuleEditPage = () => {
    const { projectId, moduleId } = useParams();
    const [name, setName] = useState('');
    const [parentId, setParentId] = useState(null);
    const [modules, setModules] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Получаем данные модуля для редактирования
        axios.get(`http://localhost:8080/api/modules/${moduleId}`, { withCredentials: true })
            .then(response => {
                setName(response.data.name);
                setParentId(response.data.parentId);
            })
            .catch(error => console.error('Ошибка при загрузке модуля', error));

        // Получаем все модули для выбора родительского
        axios.get(`http://localhost:8080/api/modules/project/${projectId}`, { withCredentials: true })
            .then(response => setModules(response.data))
            .catch(error => console.error('Ошибка при загрузке модулей', error));
    }, [projectId, moduleId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const moduleData = { name, parentId, projectId };
        axios.put(`http://localhost:8080/api/modules/${moduleId}`, moduleData, { withCredentials: true })
            .then(() => {
                alert('Модуль обновлён успешно!');
                navigate(`/projects/${projectId}/modules/new`); // Переход к списку модулей
            })
            .catch(error => console.error('Ошибка при обновлении модуля', error));
    };

    return (
        <div>
            <h2>Редактирование модуля</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Название модуля:</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Родительский модуль:</label>
                    <select 
                        value={parentId} 
                        onChange={(e) => setParentId(e.target.value)}
                    >
                        <option value={null}>Нет</option>
                        {modules.map(module => (
                            <option key={module.id} value={module.id}>
                                {module.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Обновить</button>
            </form>
        </div>
    );
};

export default ModuleEditPage;
