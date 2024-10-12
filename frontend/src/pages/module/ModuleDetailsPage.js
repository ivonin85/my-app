import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TestCaseList from '../../components/test_case/TestCaseList';
import ModuleService from '../../services/ModuleService';
import Navbar from '../../components/Navbar';
import {Button} from 'antd';
import { ModuleActions } from '../../hooks/ModuleActions';
import ModuleFormModal from '../module/ModuleFormModal';

const ModuleDetailsPage = () => {
    const { moduleId, projectId } = useParams();
    const [module, setModule] = useState(null);

    const { moduleDelete } = ModuleActions(projectId);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const openModal = () => setIsModalVisible(true);
    const closeModal = () => setIsModalVisible(false);

    useEffect(() => {
        ModuleService.getModuleById(moduleId)
            .then(response => setModule(response.data))
            .catch(error => console.error('Ошибка при загрузке модуля', error));
    }, [moduleId]);

    if (!module) {
        return <p>Загрузка...</p>;
    }

    return (
        <div><div><Navbar /></div>
        <div>
        <Button type="primary" onClick={openModal}>Редактировать модуль</Button>
                        <ModuleFormModal 
                            visible={isModalVisible} 
                            onCancel={closeModal} 
                            onOk={closeModal} 
                            projectId={projectId} 
                            moduleId={module.id}
                        />
            <Button type="dashed" onClick={() => moduleDelete(module.id)}>Удалить</Button>
        </div>
            <h1>{module.name}</h1>
            <p>ID: {module.id}</p>
            <p>Описание: {module.description || "Нет описания"}</p>
            {module.parentId && <p>Родительский модуль ID: {module.parentId}</p>}

            {/* Список тест-кейсов для этого модуля */}
            <TestCaseList />
            <Link to="/testcases/create" state={{ projectId, moduleId }}>
                <Button type="primary" style={{ marginTop: '16px' }}>Создать новый тест-кейс</Button>
            </Link>
        </div>
    );
};

export default ModuleDetailsPage;
