import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ModuleService from '../../services/ModuleService'; // Импортируем сервис
import { ModuleActions } from '../../hooks/ModuleActions';

const ModuleForm = () => {
    const { projectId } = useParams(); // Получаем ID проекта из URL
    const navigate = useNavigate(); // Используем для перенаправления
    const [name, setName] = useState(''); // Название модуля
    const [parentId, setParentId] = useState(null); // ID родительского модуля
    const [modules, setModules] = useState([]); // Список доступных модулей (для выбора родительского модуля)

    // Получаем доступные модули для выбора родителя
    useEffect(() => {
        ModuleService.getModulesByProjectId(projectId)
            .then(response => setModules(response.data))
            .catch(error => console.error('Ошибка при загрузке модулей', error));
    }, [projectId]);

    const { moduleCreate } = ModuleActions(projectId);

    const moduleSubmit = (e) => {
        e.preventDefault();
        const moduleData = { name, parentId, projectId };
        moduleCreate(moduleData);
    };
    
    return (
        <div>
            <h2>Создать новый модуль</h2>
            <form onSubmit={moduleSubmit}>
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
