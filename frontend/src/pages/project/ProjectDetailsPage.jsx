import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Button, Tabs } from 'antd';
import ModuleList from '../../components/ModuleList';
import ModuleService from '../../services/ModuleService';
import ProjectService from '../../services/ProjectService';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import ModuleFormModal from '../module/ModuleFormModal';
import AddMemberModal from '../../components/project/AddMemberModal';
import TestPlansTab from '../../components/project/TestPlansTab';
import TestRunsTab from '../../components/project/TestRunsTab';

const ProjectDetailsPage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [modules, setModules] = useState([]);
    const { Sider, Content } = Layout;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const openModal = () => setIsModalVisible(true);
    const closeModal = () => setIsModalVisible(false);

    const [isAddMemberVisible, setIsAddMemberVisible] = useState(false);
    const openAddMemberModal = () => setIsAddMemberVisible(true);
    const closeAddMemberModal = () => setIsAddMemberVisible(false);

    const location = useLocation();
    const [activeTabKey, setActiveTabKey] = useState(location.state?.activeTabKey || "1");

    useEffect(() => {
        if (location.state?.activeTabKey) {
            setActiveTabKey(location.state.activeTabKey);
        }
    }, [location.state]);

    const refreshProject = () => {
        ProjectService.getProjectById(projectId)
            .then(response => setProject(response.data))
            .catch(error => console.error('Ошибка при загрузке проекта', error));
    };

    useEffect(() => {
        refreshProject();
    }, [projectId]);

    useEffect(() => {
        ModuleService.getModulesByProjectId(projectId)
            .then(response => setModules(response.data))
            .catch(error => console.error('Ошибка при загрузке модулей', error));
    }, [projectId]);

    if (!project) {
        return <p>Загрузка...</p>;
    }

    const handleEditClick = () => {
        navigate(`/projects/${projectId}/edit`);
    };

    const handleTabChange = (key) => {
        setActiveTabKey(key);
    };

    const handleTestPlansClick = () => {
        navigate(`/test-plan-list`, { state: { projectId } });
    };


    const refreshModules = () => {
        ModuleService.getModulesByProjectId(projectId)
            .then(response => setModules(response.data))
            .catch(error => console.error('Ошибка при обновлении модулей', error));
    };

    const contentStyle = { padding: '24px', background: '#fff', minHeight: '100vh', paddingTop: '110px' };
    const siderStyle = { background: 'transparent', padding: 0, width: 256, borderRight: '1px solid #f0f0f0' };

    const tabsStyle = {
        tabStyle: {
            padding: '8px 16px',
            marginRight: '8px',
            cursor: 'pointer',
            fontWeight: 500,
            color: '#595959',
            border: '2px solid #d9d9d9'
        },
        activeTabStyle: {
            padding: '8px 16px',
            marginRight: '8px',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            backgroundColor: '#fff',
            fontWeight: 600,
            color: '#000',
        },
    };

    return (
        <div>
            <Navbar />
            <Layout style={{ marginLeft: 48 }}>
                <Sider style={siderStyle}>
                    <Sidebar projectId={projectId} />
                </Sider>
                <Content style={contentStyle}>
                    <Tabs
                        defaultActiveKey="1"
                        tabBarGutter={16}
                        tabBarStyle={{ display: 'flex', flexWrap: 'wrap' }}
                        activeKey={activeTabKey} onChange={(key) => setActiveTabKey(key)}
                    >
                        <Tabs.TabPane
                            tab={<div style={{ ...tabsStyle.tabStyle, ...(1 === "1" ? tabsStyle.activeTabStyle : {}) }}>О проекте</div>}
                            key="1"
                        >
                            <h1>{project.title}</h1>
                            <p>{project.description}</p>
                            <Button type="dashed" onClick={handleEditClick}>Редактировать проект</Button>
                        </Tabs.TabPane>

                        <Tabs.TabPane
                            tab={<div style={tabsStyle.tabStyle}>Пользователи</div>}
                            key="2"
                        >
                            <Button type="primary" onClick={openAddMemberModal}>Добавить пользователя в проект</Button>
                            <AddMemberModal
                                visible={isAddMemberVisible}
                                onCancel={closeAddMemberModal}
                                projectId={projectId}
                                refreshProject={refreshProject}
                            />
                        </Tabs.TabPane>

                        <Tabs.TabPane
                            tab={<div style={tabsStyle.tabStyle}>Тест-кейсы</div>}
                            key="3"
                        >
                            <Button type="primary" onClick={openModal}>Создать модуль</Button>
                            <ModuleFormModal
                                visible={isModalVisible}
                                onCancel={closeModal}
                                onOk={closeModal}
                                projectId={projectId}
                            />
                            <ModuleList modules={modules} projectId={projectId} refreshModules={refreshModules} />
                        </Tabs.TabPane>

                        {/* Тест-планы */}
                        <Tabs.TabPane
                            tab={<div style={activeTabKey === "4" ? tabsStyle.activeTabStyle : tabsStyle.tabStyle}>Тест-планы</div>}
                            key="4"
                        >
                            <TestPlansTab
                                tabsStyle={tabsStyle}
                                handleTestPlansClick={handleTestPlansClick}
                                projectId={projectId}
                            />
                        </Tabs.TabPane>

                        <Tabs.TabPane
                            tab={<div style={tabsStyle.tabStyle}>Тест-раны</div>}
                            key="5"
                        >
                            <TestRunsTab projectId={projectId} />
                            
                        </Tabs.TabPane>
                    </Tabs>
                </Content>
            </Layout>
        </div>
    );
};

export default ProjectDetailsPage;
