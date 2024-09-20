import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewProjectPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProject = { title, description };

        axios.post('http://localhost:8080/api/projects', newProject, { withCredentials: true })
            .then(response => {
                console.log('Проект создан:', response.data);
                navigate('/projects'); // После успешного создания, перенаправляем на страницу проектов
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

export default NewProjectPage;
