import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ModuleService from '../../services/ModuleService';
import { ModuleActions } from '../../hooks/ModuleActions';

const ModuleForm = () => {
    const { projectId, moduleId } = useParams(); // Получаем ID проекта и модуля (если редактируем)
    const [name, setName] = useState(''); // Название модуля
    const [parentId, setParentId] = useState(null); // ID родительского модуля
    const [modules, setModules] = useState([]); // Список доступных модулей (для выбора родительского модуля)
    const [isEditMode, setIsEditMode] = useState(false); // Режим редактирования

    const { moduleCreate, moduleUpdate } = ModuleActions(projectId);
    
    useEffect(() => {
        // Если moduleId существует, значит мы в режиме редактирования
        if (moduleId) {
            setIsEditMode(true);
            // Загружаем данные модуля для редактирования
            ModuleService.getModuleById(moduleId)
                .then(response => {
                    setName(response.data.name);
                    setParentId(response.data.parentId);
                })
                .catch(error => console.error('Ошибка при загрузке модуля', error));
        }

        // Получаем все модули для выбора родительского
        ModuleService.getModulesByProjectId(projectId)
            .then(response => {
                // Если мы в режиме редактирования, исключаем текущий модуль из списка родительских
                const availableModules = moduleId
                    ? response.data.filter(module => module.id !== parseInt(moduleId))
                    : response.data;
                setModules(availableModules);
            })
            .catch(error => console.error('Ошибка при загрузке модулей', error));
    }, [projectId, moduleId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const moduleData = { name, parentId, projectId };

        if (isEditMode) {
            // Обновляем модуль
            moduleUpdate(moduleId, moduleData);
        } else {
            // Создаём новый модуль
            moduleCreate(moduleData);
        }
    };
    
    return (
        <div>
            <h2>{isEditMode ? 'Редактирование модуля' : 'Создать новый модуль'}</h2>
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
                <button type="submit">{isEditMode ? 'Обновить' : 'Создать'}</button>
            </form>
        </div>
    );
};

export default ModuleForm;
