import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ModuleDetailsPage = () => {
    const { moduleId } = useParams(); // Получаем ID модуля из URL
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
        </div>
    );
};

export default ModuleDetailsPage;
