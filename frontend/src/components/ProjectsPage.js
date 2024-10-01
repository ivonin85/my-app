import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProjectService from '../services/ProjectService';
import Navbar from '../pages/Navbar';

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        ProjectService.getAllProjects()
            .then(response => setProjects(response.data))
            .catch(error => console.error('Ошибка при загрузке проектов', error));
    }, []);

    const handleDelete = (projectId) => {
        if (window.confirm("Вы уверены, что хотите удалить этот проект?")) {
            ProjectService.deleteProject(projectId)
                .then(() => {
                    setProjects(projects.filter(project => project.id !== projectId));
                    alert("Проект удален!");
                })
                .catch(error => console.error('Ошибка при удалении проекта', error));
        }
            
    };

    return (
        <div><div><Navbar /></div>
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
