import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ModuleForm = () => {
    const { projectId } = useParams();
    const [name, setName] = useState('');
    const [parentId, setParentId] = useState(null);
    const [modules, setModules] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8080/api/modules/project/${projectId}`, { withCredentials: true })
            .then(response => setModules(response.data))
            .catch(error => console.error('Ошибка при загрузке модулей', error));
    }, [projectId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const moduleData = { name, parentId, projectId };
        axios.post('http://localhost:8080/api/modules', moduleData, { withCredentials: true })
            .then(() => {
                setName('');
                setParentId(null);
                alert('Модуль создан успешно!');
                return axios.get(`http://localhost:8080/api/modules/project/${projectId}`, { withCredentials: true });
            })
            .then(response => setModules(response.data))
            .catch(error => console.error('Ошибка при создании модуля', error));
    };

    const handleEdit = (moduleId) => {
        navigate(`/projects/${projectId}/modules/${moduleId}/edit`);
    };

    const handleDelete = (moduleId) => {
        if (window.confirm("Вы уверены, что хотите удалить этот модуль?")) {
            axios.delete(`http://localhost:8080/api/modules/${moduleId}`, { withCredentials: true })
                .then(() => {
                    alert("Модуль удален!");
                    return axios.get(`http://localhost:8080/api/modules/project/${projectId}`, { withCredentials: true });
                })
                .then(response => setModules(response.data))
                .catch(error => console.error('Ошибка при удалении модуля', error));
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Название модуля:</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Родительский модуль:</label>
                    <select 
                        value={parentId} 
                        onChange={(e) => setParentId(e.target.value)}
                    >
                        <option value={null}>Нет</option>
                        {modules.map(module => (
                            <option key={module.id} value={module.id}>
                                {module.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Создать</button>
            </form>
            <h2>Список модулей проекта</h2>
            <ul>
                {modules.map(module => (
                    <li key={module.id}>
                        {module.name} (ID: {module.id}) 
                        <button onClick={() => handleEdit(module.id)}>Редактировать</button>
                        <button onClick={() => handleDelete(module.id)}>Удалить</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ModuleForm;
