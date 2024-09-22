import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ProjectEditPage = () => {
    const { id } = useParams(); // Получаем id проекта из URL
    const navigate = useNavigate(); // Для навигации после обновления
    const [project, setProject] = useState({ title: '', description: '' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/projects/${id}`, { withCredentials: true })
            .then(response => {
                setProject(response.data);
                setIsLoading(false);
            })
            .catch(error => console.error('Ошибка при загрузке проекта', error));
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProject(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8080/api/projects/${id}`, project, { withCredentials: true })
            .then(() => navigate(`/projects/${id}`)) // Переход на страницу проекта после успешного редактирования
            .catch(error => console.error('Ошибка при обновлении проекта', error));
    };

    if (isLoading) {
        return <p>Загрузка...</p>;
    }

    return (
        <div>
            <h1>Редактировать проект</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Название</label>
                    <input
                        type="text"
                        name="title"
                        value={project.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Описание</label>
                    <textarea
                        name="description"
                        value={project.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit">Сохранить изменения</button>
            </form>
        </div>
    );
};

export default ProjectEditPage;
