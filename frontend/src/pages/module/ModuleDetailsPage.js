import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TestCaseList from '../../components/test_case/TestCaseList';
import ModuleService from '../../services/ModuleService';
import Navbar from '../../components/Navbar';
import { Layout, Button } from 'antd';
import { ModuleActions } from '../../hooks/ModuleActions';
import ModuleFormModal from '../module/ModuleFormModal';
import Sidebar from '../../components/Sidebar';

const ModuleDetailsPage = () => {
    const { moduleId, projectId } = useParams();
    const [module, setModule] = useState(null);
    const { moduleDelete } = ModuleActions(projectId);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const openModal = () => setIsModalVisible(true);
    const closeModal = () => setIsModalVisible(false);
    const { Sider, Content } = Layout; 

    useEffect(() => {
        ModuleService.getModuleById(moduleId)
            .then(response => setModule(response.data))
            .catch(error => console.error('Ошибка при загрузке модуля', error));
    }, [moduleId]);

    if (!module) {
        return <p>Загрузка...</p>;
    }

    return (
        <div>
            <Navbar />
            <Layout style={{ marginLeft: 48 }}>
                <Sider style={{ background: 'transparent', padding: 0, width: 256, borderRight: '1px solid #f0f0f0' }}>
                    <Sidebar projectId={projectId} />
                </Sider>
                <Content style={{ padding: '24px', background: '#fff', minHeight: '100vh' }}>
                    <h1>{module.name}</h1>
                    {module.parentId && <p>Родительский модуль ID: {module.parentId}</p>}

                    <Button type="primary" onClick={openModal} style={{ marginRight: '8px' }}>
                        Редактировать модуль
                    </Button>
                    <Button type="dashed" onClick={() => moduleDelete(module.id)}>
                        Удалить
                    </Button>
                    
                    <ModuleFormModal
                        visible={isModalVisible}
                        onCancel={closeModal}
                        onOk={closeModal}
                        projectId={projectId}
                        moduleId={module.id}
                    />

                    <Link to="/testcases/create" state={{ projectId, moduleId }}>
                        <Button type="primary" style={{ marginTop: '16px', marginLeft: '8px' }}>
                            Создать новый тест-кейс
                        </Button>
                    </Link>

                    {/* Список тест-кейсов для этого модуля */}
                    <TestCaseList />

                    
                </Content>
            </Layout>
        </div>
    );
};

export default ModuleDetailsPage;
