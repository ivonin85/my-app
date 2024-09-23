import React from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Добавили Link для ссылок на детали модуля

const ModuleList = ({ modules, projectId, refreshModules }) => {
    const navigate = useNavigate();

    const handleEdit = (moduleId) => {
        navigate(`/projects/${projectId}/modules/${moduleId}/edit`);
    };

    const handleDelete = (moduleId) => {
        if (window.confirm("Вы уверены, что хотите удалить этот модуль?")) {
            axios.delete(`http://localhost:8080/api/modules/${moduleId}`, { withCredentials: true })
                .then(() => {
                    alert("Модуль удален!");
                    refreshModules(); // Обновляем список модулей после удаления
                })
                .catch(error => console.error('Ошибка при удалении модуля', error));
        }
    };

    return (
        <div>
            <h2>Список модулей проекта</h2>
            <ul>
                {modules.map(module => (
                    <li key={module.id}>
                        {/* Ссылка на страницу модуля */}
                        <Link to={`/projects/${projectId}/modules/${module.id}`}>
                            {module.name}
                        </Link> 
                        (ID: {module.id}) 
                        <button onClick={() => handleEdit(module.id)}>Редактировать</button>
                        <button onClick={() => handleDelete(module.id)}>Удалить</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ModuleList;
