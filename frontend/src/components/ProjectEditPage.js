import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectService from '../services/ProjectService';

const ProjectEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState({ title: '', description: '' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        ProjectService.getProjectById(id)
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
        ProjectService.updateProject(id, project)
            .then(() => navigate(`/projects/${id}`))
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
