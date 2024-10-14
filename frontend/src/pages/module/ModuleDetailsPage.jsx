import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TestCaseList from '../../components/test_case/TestCaseList';
import ModuleService from '../../services/ModuleService';
import Navbar from '../../components/Navbar';
import { Layout, Button } from 'antd';
import { ModuleActions } from '../../hooks/ModuleActions';
import ModuleFormModal from './ModuleFormModal';
import Sidebar from '../../components/Sidebar';
import TestCaseForm from '../test_case/TestCaseForm';

const ModuleDetailsPage = () => {
    const { moduleId, projectId } = useParams();
    const [module, setModule] = useState(null);
    const { moduleDelete } = ModuleActions(projectId);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [shouldReload, setShouldReload] = useState(false);
    const openModal = () => setIsModalVisible(true);
    const closeModal = () => setIsModalVisible(false);
    const { Sider, Content } = Layout; 
    const [drawerVisible, setDrawerVisible] = useState(false);

    useEffect(() => {
        const fetchModule = async () => {
            try {
                const response = await ModuleService.getModuleById(moduleId);
                setModule(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке модуля', error);
            }
        };

        fetchModule();
    }, [moduleId]);

    const openDrawer = () => setDrawerVisible(true);
    
    const closeDrawer = () => {
        setDrawerVisible(false);
    };

    const handleTestCaseUpdate = () => {
        setShouldReload(!shouldReload); // Меняем состояние, чтобы инициировать перезагрузку списка
        closeDrawer(); // Закрываем Drawer после обновления
    };

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

                    <Button type="primary" onClick={openDrawer} style={{ marginTop: '16px', marginLeft: '8px' }}>
                        Создать новый тест-кейс
                    </Button>

                    <TestCaseForm
                        drawerVisible={drawerVisible}
                        openDrawer={openDrawer}
                        closeDrawer={closeDrawer}
                        projectId={projectId}
                        moduleId={moduleId}
                        onUpdate={handleTestCaseUpdate} // Передаем функцию обновления
                    />

                    {/* Передаем состояние shouldReload в TestCaseList */}
                    <TestCaseList shouldReload={shouldReload} />
                </Content>
            </Layout>
        </div>
    );
};

export default ModuleDetailsPage;