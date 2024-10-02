import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectService from '../../services/ProjectService';

const ProjectCreatePage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProject = { title, description };

        ProjectService.createProject(newProject)
            .then(response => {
                console.log('Проект создан:', response.data);
                navigate('/projects');
            })
            .catch(error => {
                console.error('Ошибка при создании проекта:', error);
            });
    };

    return (
        <div>
            <h1>Создать новый проект</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Название проекта:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Описание проекта:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button type="submit">Создать проект</button>
            </form>
        </div>
    );
};

export default ProjectCreatePage;
