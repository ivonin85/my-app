import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import TestCaseList from './TestCaseList';

const ModuleDetailsPage = () => {
    const { moduleId, projectId } = useParams();
    const [module, setModule] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/modules/${moduleId}`, { withCredentials: true })
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
