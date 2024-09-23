import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ModuleForm = () => {
    const { projectId } = useParams(); // Получаем ID проекта из URL
    const navigate = useNavigate(); // Используем для перенаправления
    const [name, setName] = useState(''); // Название модуля
    const [parentId, setParentId] = useState(null); // ID родительского модуля
    const [modules, setModules] = useState([]); // Список доступных модулей (для выбора родительского модуля)

    // Получаем доступные модули для выбора родителя
    useEffect(() => {
        axios.get(`http://localhost:8080/api/modules/project/${projectId}`, { withCredentials: true })
            .then(response => setModules(response.data))
            .catch(error => console.error('Ошибка при загрузке модулей', error));
    }, [projectId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const moduleData = { name, parentId, projectId };
        
        // Отправляем запрос на создание модуля
        axios.post('http://localhost:8080/api/modules', moduleData, { withCredentials: true })
            .then(() => {
                setName('');
                setParentId(null);
                alert('Модуль создан успешно!');
                
                // Перенаправляем на страницу проекта
                navigate(`/projects/${projectId}`);
            })
            .catch(error => console.error('Ошибка при создании модуля', error));
    };

    return (
        <div>
            <h2>Создать новый модуль</h2>
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
                    <label>Родительский модуль (необязательно):</label>
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
        </div>
    );
};

export default ModuleForm;