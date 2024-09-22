import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Импортируем useNavigate

const ProjectDetailsPage = () => {
    const { id } = useParams(); // Получаем id проекта из URL
    const navigate = useNavigate(); // Для навигации на страницу редактирования
    const [project, setProject] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/projects/${id}`, { withCredentials: true })
            .then(response => setProject(response.data))
            .catch(error => console.error('Ошибка при загрузке проекта', error));
    }, [id]);

    if (!project) {
        return <p>Загрузка...</p>;
    }

    const handleEditClick = () => {
        navigate(`/projects/${id}/edit`); // Переход на страницу редактирования проекта
    };

    return (
        <div>
            <h1>{project.title}</h1>
            <p>{project.description}</p>
            {/* Здесь можно добавить больше информации о проекте */}
            
            {/* Кнопка для перехода на страницу редактирования */}
            <button onClick={handleEditClick}>Редактировать проект</button>
        </div>
    );
};

export default ProjectDetailsPage;
