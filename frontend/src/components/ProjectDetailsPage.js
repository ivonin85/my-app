import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Добавили Link для ссылки на создание модуля
import ModuleList from './ModuleList'; // Импортируем компонент для отображения списка модулей

const ProjectDetailsPage = () => {
    const { id } = useParams(); // Получаем id проекта из URL
    const navigate = useNavigate(); // Для навигации на страницу редактирования
    const [project, setProject] = useState(null);
    const [modules, setModules] = useState([]); // Для хранения списка модулей

    // Получаем данные проекта
    useEffect(() => {
        axios.get(`http://localhost:8080/api/projects/${id}`, { withCredentials: true })
            .then(response => setProject(response.data))
            .catch(error => console.error('Ошибка при загрузке проекта', error));
    }, [id]);

    // Получаем список модулей для данного проекта
    useEffect(() => {
        axios.get(`http://localhost:8080/api/modules/project/${id}`, { withCredentials: true })
            .then(response => setModules(response.data))
            .catch(error => console.error('Ошибка при загрузке модулей', error));
    }, [id]);

    if (!project) {
        return <p>Загрузка...</p>;
    }

    const handleEditClick = () => {
        navigate(`/projects/${id}/edit`); // Переход на страницу редактирования проекта
    };

    // Обновляем список модулей после удаления
    const refreshModules = () => {
        axios.get(`http://localhost:8080/api/modules/project/${id}`, { withCredentials: true })
            .then(response => setModules(response.data))
            .catch(error => console.error('Ошибка при обновлении модулей', error));
    };

    return (
        <div>
            <h1>{project.title}</h1>
            <p>{project.description}</p>
            
            {/* Кнопка для перехода на страницу редактирования */}
            <button onClick={handleEditClick}>Редактировать проект</button>

            {/* Ссылка на страницу создания модуля для данного проекта */}
            <Link to={`/projects/${id}/modules`}>
                <button>Создать новый модуль</button>
            </Link>

            {/* Список модулей проекта */}
            <ModuleList modules={modules} projectId={id} refreshModules={refreshModules} />
        </div>
    );
};

export default ProjectDetailsPage;
