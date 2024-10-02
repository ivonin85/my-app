import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ModuleService from '../../services/ModuleService';

const ModuleEditPage = () => {
    const { projectId, moduleId } = useParams();
    const [name, setName] = useState('');
    const [parentId, setParentId] = useState(null);
    const [modules, setModules] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Получаем данные модуля для редактирования
        ModuleService.getModuleById(moduleId)
            .then(response => {
                setName(response.data.name);
                setParentId(response.data.parentId);
            })
            .catch(error => console.error('Ошибка при загрузке модуля', error));

        // Получаем все модули для выбора родительского
        ModuleService.getModulesByProjectId(projectId)
            .then(response => {
                // Исключаем текущий модуль из списка родительских
                const availableModules = response.data.filter(module => module.id !== parseInt(moduleId));
                setModules(availableModules);
            })
            .catch(error => console.error('Ошибка при загрузке модулей', error));
    }, [projectId, moduleId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const moduleData = { name, parentId, projectId };
        ModuleService.updateModule(moduleId, moduleData)
            .then(() => {
                alert('Модуль обновлён успешно!');
                navigate(`/projects/${projectId}/modules`);
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