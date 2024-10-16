import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Button, Layout } from 'antd';
import ProjectService from '../../services/ProjectService';
import Navbar from '../../components/Navbar';

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const { Sider, Content } = Layout; 

    useEffect(() => {
        ProjectService.getAllProjects()
            .then(response => setProjects(response.data))
            .catch(error => console.error('Ошибка при загрузке проектов', error));
    }, []);

    const handleDelete = (projectId) => {
        if (window.confirm("Вы уверены, что хотите удалить этот проект?")) {
            ProjectService.deleteProject(projectId)
                .then(() => {
                    setProjects(projects.filter(project => project.id !== projectId));
                    alert("Проект удален!");
                })
                .catch(error => console.error('Ошибка при удалении проекта', error));
        }
    };

    return (
        <div>
            <Navbar />
            
                <h1>Мои проекты</h1>
                <div style={{ paddingTop: '45px', paddingLeft: '12px', paddingRight: '12px' }}>
                <Row gutter={[16, 16]}>
                    {/* Оборачиваем в Row с отступами между колонками */}
                    {projects.map(project => (
                        <Col key={project.id} xs={24} sm={12} md={12} lg={8} xl={8}> {/* Два элемента в ряд на малых экранах */}
                            <Card
                                title={project.title}
                                extra={<Link to={`/projects/${project.id}`}>Подробнее</Link>}
                                actions={[
                                    <Button type="primary" danger onClick={() => handleDelete(project.id)}>
                                        Удалить
                                    </Button>
                                ]}
                            >
                                <p>{project.description}</p>
                            </Card>
                        </Col>
                    ))}
                </Row>
                <Button type="primary" ><Link to="/projects/new">Создать новый проект</Link></Button>
                </div>
        </div>
    );
};

export default ProjectsPage;
