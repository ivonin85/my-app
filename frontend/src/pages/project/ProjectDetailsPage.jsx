import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ModuleList from '../../components/ModuleList';
import ModuleService from '../../services/ModuleService';
import ProjectService from '../../services/ProjectService';
import Navbar from '../../components/Navbar';
import Sidebar  from '../../components/Sidebar';
import { Layout, Button} from 'antd';
import ModuleFormModal from '../module/ModuleFormModal';
import AddMemberModal from '../../components/project/AddMemberModal';


const ProjectDetailsPage = () => {
    const { projectId } = useParams(); // Получаем projectId проекта из URL
    const navigate = useNavigate(); // Для навигации на страницу редактирования
    const [project, setProject] = useState(null);
    const [modules, setModules] = useState([]); // Для хранения списка модулей
    const { Sider, Content } = Layout; 

    const [isModalVisible, setIsModalVisible] = useState(false);
    const openModal = () => setIsModalVisible(true);
    const closeModal = () => setIsModalVisible(false);

    const [isAddMemberVisible, setIsAddMemberVisible] = useState(false); // Для модального окна добавления пользователя
    const openAddMemberModal = () => setIsAddMemberVisible(true);
    const closeAddMemberModal = () => setIsAddMemberVisible(false);

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

    // Новая функция для перенаправления на страницу тест-планов
    const handleTestPlansClick = () => {
        navigate(`/test_plans`, { state: { projectId } }); 
    };

    // Новая функция для перенаправления на страницу тест-планов
    const handleCreateTestPlanClick = () => {
        navigate(`/create_test_plan`, { state: { projectId } }); 
    };

    // Обновляем список модулей после удаления
    const refreshModules = () => {
        ModuleService.getModulesByProjectId(projectId)
            .then(response => setModules(response.data))
            .catch(error => console.error('Ошибка при обновлении модулей', error));
    };

    return (
        <div>
        <div><Navbar /></div>
            <Layout style={{ marginLeft: 48 }}>
                <Sider style={{background: 'transparent', padding: 0, width: 256, borderRight: '1px solid #f0f0f0',}}>
                    <Sidebar projectId={projectId} />
                </Sider>
                <Content style={{ padding: '24px', background: '#fff', minHeight: '100vh', paddingTop: '100px' }}>
                    
                <h1>{project.title}</h1>
                <p>{project.description}</p>
            
            {/* Кнопка для перехода на страницу редактирования */}
            <Button type="dashed" onClick={handleEditClick}>Редактировать проект</Button>

            {/* Кнопка для добавления пользователя */}
            <Button type="primary" style={{ marginLeft: 8 }} onClick={openAddMemberModal}>Добавить пользователя в проект </Button>
                    <AddMemberModal
                        visible={isAddMemberVisible}
                        onCancel={closeAddMemberModal}
                        projectId={projectId}
                        refreshProject={refreshProject} // Обновление данных после добавления
                    />

            {/* Кнопка для перехода на страницу тест-планов */}
            <Button type="primary" style={{ marginLeft: 8 }} onClick={handleTestPlansClick}>Перейти к тест-планам</Button>

            {/* Кнопка для перехода на страницу создания тест-плана */}
            <Button type="primary" style={{ marginLeft: 8 }} onClick={handleCreateTestPlanClick}>Создать тест-план</Button>

            {/* Список модулей проекта */}
            <ModuleList modules={modules} projectId={projectId} refreshModules={refreshModules} />

        
            {/* Ссылка на страницу создания модуля для данного проекта */}
            
            <Button type="primary" onClick={openModal}>Создать модуль</Button>
            <ModuleFormModal
                visible={isModalVisible}
                onCancel={closeModal}
                onOk={closeModal}
                projectId={projectId}
            />
            
      </Content>
        </Layout>

            
        </div>
    );
};

export default ProjectDetailsPage;
