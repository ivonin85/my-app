import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TestCaseList from '../../components/test_case/TestCaseList';
import ModuleService from '../../services/ModuleService';
import Navbar from '../../components/Navbar';
import { Layout, Button, Typography } from 'antd';
import { ModuleActions } from '../../hooks/ModuleActions';
import ModuleFormModal from './ModuleFormModal';
import Sidebar from '../../components/Sidebar';
import TestCaseForm from '../test_case/TestCaseForm';

const { Title } = Typography;

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

    const contentStyle = { padding: '24px', background: '#fff', minHeight: '100vh', paddingTop: '100px' };

    return (
        <div>
            <div><Navbar /></div>
            <Layout style={{ marginLeft: 48 }}>
                <Sider>
                    <Sidebar projectId={projectId} />
                </Sider>
                <Content style={contentStyle}>
                    <h1>{module.name}</h1>
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

                    <Title level={2}>Список тест-кейсов</Title>

                    {/* Передаем состояние shouldReload в TestCaseList */}
                    <div style={{
                        width: '85%',
                        height: '100%',
                        maxHeight: 'calc(100vh - 64px)', // Максимальная высота для прокрутки
                        overflowY: 'auto', // Включение вертикальной прокрутки
                        position: 'fixed'
                    }}>
                        <TestCaseList shouldReload={shouldReload} />
                    </div>
                </Content>
            </Layout>
        </div>
    );
};

export default ModuleDetailsPage;