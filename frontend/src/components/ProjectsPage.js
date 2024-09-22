import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/projects', { withCredentials: true })
            .then(response => setProjects(response.data))
            .catch(error => console.error('Ошибка при загрузке проектов', error));
    }, []);

    const handleDelete = (projectId) => {
        axios.delete(`http://localhost:8080/api/projects/${projectId}`, { withCredentials: true })
            .then(() => setProjects(projects.filter(project => project.id !== projectId)))
            .catch(error => console.error('Ошибка при удалении проекта', error));
    };

    return (
        <div>
            <h1>Мои проекты</h1>
            <Link to="/projects/new">Создать новый проект</Link>
            <ul>
                {projects.map(project => (
                    <li key={project.id}>
                        <Link to={`/projects/${project.id}`}>
                            <h2>{project.title}</h2>
                        </Link>
                        <p>{project.description}</p>
                        <button onClick={() => handleDelete(project.id)}>Удалить</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProjectsPage;
