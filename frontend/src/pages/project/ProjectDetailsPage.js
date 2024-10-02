import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ModuleList from '../../components/ModuleList';
import ModuleService from '../../services/ModuleService';
import ProjectService from '../../services/ProjectService';
import Navbar from '../../components/Navbar';
import Sidebar  from '../../components/Sidebar';
import { Layout, Button} from 'antd';


const ProjectDetailsPage = () => {
    const { id } = useParams(); // Получаем id проекта из URL
    const navigate = useNavigate(); // Для навигации на страницу редактирования
    const [project, setProject] = useState(null);
    const [modules, setModules] = useState([]); // Для хранения списка модулей
    const { Sider, Content } = Layout; 

    useEffect(() => {
        // Пример, если у тебя есть ProjectService
        ProjectService.getProjectById(id)
            .then(response => setProject(response.data))
            .catch(error => console.error('Ошибка при загрузке проекта', error));
    }, [id]);

    // Получаем список модулей для данного проекта
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
                <Sider style={{
            background: 'transparent', // Устанавливаем прозрачный фон или используем '#fff' для белого
            padding: 0,
            width: 256,
            borderRight: '1px solid #f0f0f0', // Добавляем тонкую линию разделителя, если нужно
        }}>
                    <Sidebar projectId={id} />
                </Sider>
                <Content style={{ padding: '24px', background: '#fff', minHeight: '100vh' }}>
                    <h1>{project.title}</h1>
                    <p>{project.description}</p>
            
            {/* Кнопка для перехода на страницу редактирования */}
            <Button type="dashed" onClick={handleEditClick}>Редактировать проект</Button>

            {/* Ссылка на страницу создания модуля для данного проекта */}
            <Link to={`/projects/${id}/modules`}>
                <Button type="dashed">Создать новый модуль</Button>
            </Link>

            {/* Список модулей проекта */}
            <ModuleList modules={modules} projectId={id} refreshModules={refreshModules} />
      </Content>
        </Layout>

            
        </div>
    );
};

export default ProjectDetailsPage;
