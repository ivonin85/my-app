import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Для получения projectId из URL

const ModuleForm = () => {
    const { projectId } = useParams(); // Получаем ID проекта из URL
    const [name, setName] = useState('');
    const [parentId, setParentId] = useState(null);
    const [modules, setModules] = useState([]);

    // Получаем все модули, связанные с текущим проектом
    useEffect(() => {
        axios.get(`http://localhost:8080/api/modules/project/${projectId}`, { withCredentials: true })
            .then(response => setModules(response.data))
            .catch(error => console.error('Ошибка при загрузке модулей', error));
    }, [projectId]);

    // Обработка отправки формы
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/modules', 
            { name, parentId, projectId },  // Отправляем projectId вместе с другими данными
            { withCredentials: true }
        )
        .then(() => {
            setName('');
            setParentId(null);
            alert('Модуль создан успешно!');
            // Обновляем список модулей после создания нового
            return axios.get(`http://localhost:8080/api/modules/project/${projectId}`, { withCredentials: true });
        })
        .then(response => setModules(response.data))
        .catch(error => console.error('Ошибка при создании модуля', error));
    };

    return (
        <div>
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
                <button type="submit">Создать</button>
            </form>
            <h2>Список модулей проекта</h2>
            <ul>
                {modules.map(module => (
                    <li key={module.id}>{module.name} (ID: {module.id})</li>
                ))}
            </ul>
        </div>
    );
};

export default ModuleForm;
