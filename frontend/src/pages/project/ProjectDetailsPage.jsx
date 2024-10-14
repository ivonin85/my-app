import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ModuleList from '../../components/ModuleList';
import ModuleService from '../../services/ModuleService';
import ProjectService from '../../services/ProjectService';
import Navbar from '../../components/Navbar';
import Sidebar  from '../../components/Sidebar';
import { Layout, Button} from 'antd';
import ModuleFormModal from '../module/ModuleFormModal';


const ProjectDetailsPage = () => {
    const { id } = useParams(); // Получаем id проекта из URL
    const navigate = useNavigate(); // Для навигации на страницу редактирования
    const [project, setProject] = useState(null);
    const [modules, setModules] = useState([]); // Для хранения списка модулей
    const { Sider, Content } = Layout; 

    const [isModalVisible, setIsModalVisible] = useState(false);
    const openModal = () => setIsModalVisible(true);
    const closeModal = () => setIsModalVisible(false);

    useEffect(() => {
        ProjectService.getProjectById(id)
            .then(response => setProject(response.data))
            .catch(error => console.error('Ошибка при загрузке проекта', error));
    }, [id]);


    useEffect(() => {
        ModuleService.getModulesByProjectId(id)
            .then(response => setModules(response.data))
            .catch(error => console.error('Ошибка при загрузке модулей', error));
    }, [id]);

    if (!project) {
        return <p>Загрузка...</p>;
    }

    const handleEditClick = () => {
        navigate(`/projects/${id}/edit`);
    };

    // Обновляем список модулей после удаления
    const refreshModules = () => {
        ModuleService.getModulesByProjectId(id)
            .then(response => setModules(response.data))
            .catch(error => console.error('Ошибка при обновлении модулей', error));
    };

    return (
        <div>
        <div><Navbar /></div>
            <Layout style={{ marginLeft: 48 }}>
                <Sider style={{background: 'transparent', padding: 0, width: 256, borderRight: '1px solid #f0f0f0',}}>
                    <Sidebar projectId={id} />
                </Sider>
                <Content style={{ padding: '24px', background: '#fff', minHeight: '100vh' }}>
                    <h1>{project.title}</h1>
                    <p>{project.description}</p>
            
            {/* Кнопка для перехода на страницу редактирования */}
            <Button type="dashed" onClick={handleEditClick}>Редактировать проект</Button>

            {/* Список модулей проекта */}
            <ModuleList modules={modules} projectId={id} refreshModules={refreshModules} />

        
            {/* Ссылка на страницу создания модуля для данного проекта */}
            
            <Button type="primary" onClick={openModal}>Создать модуль</Button>
            <ModuleFormModal
                visible={isModalVisible}
                onCancel={closeModal}
                onOk={closeModal}
                projectId={id}
            />
            
      </Content>
        </Layout>

            
        </div>
    );
};

export default ProjectDetailsPage;
