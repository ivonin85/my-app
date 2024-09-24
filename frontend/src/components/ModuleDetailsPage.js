import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TestCaseList from './TestCaseList';
import ModuleService from '../services/ModuleService';

const ModuleDetailsPage = () => {
    const { moduleId, projectId } = useParams();
    const [module, setModule] = useState(null);

    useEffect(() => {
        ModuleService.getModuleById(moduleId)
            .then(response => setModule(response.data))
            .catch(error => console.error('Ошибка при загрузке модуля', error));
    }, [moduleId]);

    if (!module) {
        return <p>Загрузка...</p>;
    }

    return (
        <div>
            <h1>{module.name}</h1>
            <p>ID: {module.id}</p>
            <p>Описание: {module.description || "Нет описания"}</p>
            {module.parentId && <p>Родительский модуль ID: {module.parentId}</p>}

            {/* Список тест-кейсов для этого модуля */}
            <TestCaseList />
        </div>
    );
};

export default ModuleDetailsPage;
