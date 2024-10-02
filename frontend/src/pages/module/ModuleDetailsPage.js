import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TestCaseList from '../../components/TestCaseList';
import ModuleService from '../../services/ModuleService';
import Navbar from '../../components/Navbar';
import {Button} from 'antd';
import { ModuleActions } from '../../hooks/ModuleActions';

const ModuleDetailsPage = () => {
    const { moduleId, projectId } = useParams();
    const [module, setModule] = useState(null);

    const { moduleEdit, moduleDelete } = ModuleActions(projectId);

    useEffect(() => {
        ModuleService.getModuleById(moduleId)
            .then(response => setModule(response.data))
            .catch(error => console.error('Ошибка при загрузке модуля', error));
    }, [moduleId]);

    if (!module) {
        return <p>Загрузка...</p>;
    }

    return (
        <div><div><Navbar /></div>
        <div>
            <Button type="dashed" onClick={() => moduleEdit(module.id)}>Редактировать</Button>
            <Button type="dashed" onClick={() => moduleDelete(module.id)}>Удалить</Button>
        </div>
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
