import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { ModuleActions } from '../hooks/ModuleActions';
import ModuleFormModal from '../pages/module/ModuleFormModal';

const ModuleList = ({ modules, projectId, refreshModules }) => {
    const { moduleDelete } = ModuleActions(projectId, refreshModules);
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingModuleId, setEditingModuleId] = useState(null); // Хранение ID редактируемого модуля

    const openModal = (moduleId) => {
        setEditingModuleId(moduleId);  // Устанавливаем ID редактируемого модуля
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setEditingModuleId(null);  // Очищаем ID редактируемого модуля после закрытия
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
                        <Button type="primary" onClick={() => openModal(module.id)}>Редактировать модуль</Button>

                        {/* Модальное окно открывается только для конкретного модуля */}
                        <ModuleFormModal 
                            visible={isModalVisible && editingModuleId === module.id}  // Проверяем ID редактируемого модуля
                            onCancel={closeModal} 
                            onOk={closeModal} 
                            projectId={projectId} 
                            moduleId={module.id}
                        />

                        <Button type="dashed" onClick={() => moduleDelete(module.id)}>Удалить</Button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ModuleList;
