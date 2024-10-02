import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ModuleService from '../services/ModuleService';
import {Button} from 'antd';
import { ModuleActions } from '../hooks/ModuleActions';

const ModuleList = ({ modules, projectId, refreshModules }) => {
    const navigate = useNavigate();
    const { moduleEdit, moduleDelete } = ModuleActions(projectId, refreshModules);

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
                        <Button type="dashed" onClick={() => moduleEdit(module.id)}>Редактировать</Button>
                        <Button type="dashed"  onClick={() => moduleDelete(module.id)}>Удалить</Button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ModuleList;
