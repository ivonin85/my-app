import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProjectDetailsPage = () => {
    const { id } = useParams(); // Получаем id проекта из URL
    const [project, setProject] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/projects/${id}`, { withCredentials: true })
            .then(response => setProject(response.data))
            .catch(error => console.error('Ошибка при загрузке проекта', error));
    }, [id]);

    if (!project) {
        return <p>Загрузка...</p>;
    }

    return (
        <div>
            <h1>{project.title}</h1>
            <p>{project.description}</p>
            {/* Здесь можно добавить больше информации о проекте */}
        </div>
    );
};

export default ProjectDetailsPage;
