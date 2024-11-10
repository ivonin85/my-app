import React, { useState, useEffect } from 'react';
import { Table, Button, message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import TestPlanService from '../../services/TestPlanService';
import CreateTestPlanModal from '../../pages/test_plan/CreateTestPlanModal';

const TestPlansTab = ({ tabsStyle, handleTestPlansClick, projectId }) => {
    const [testPlans, setTestPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false); // состояние для видимости модального окна
    const navigate = useNavigate();

    useEffect(() => {
        if (projectId) {
            fetchTestPlans();
        }
    }, [projectId]);

    const fetchTestPlans = async () => {
        setLoading(true);
        try {
            const data = await TestPlanService.getTestPlans(projectId);
            setTestPlans(data);
        } catch (error) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTestPlanClick = () => {
        setIsModalVisible(true); // показать модальное окно
    };

    const handleModalCancel = () => {
        setIsModalVisible(false); // скрыть модальное окно
    };

    const handleTestPlanCreated = () => {
        fetchTestPlans(); // обновить список тест-планов после создания нового
        setIsModalVisible(false);
    };

    const handleRowClick = (record) => {
        navigate(`/test-plan-details`, { state: { testPlanId: record.id,  projectId: projectId} });
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Дата создания',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleString(),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={handleCreateTestPlanClick}>Создать тест-план</Button>
            </div>
            <Table
                dataSource={Array.isArray(testPlans) ? testPlans : []}
                columns={columns}
                rowKey="id"
                loading={loading}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                })}
            />

            {/* Модальное окно для создания тест-плана */}
            <Modal
                title="Создать тест-план"
                visible={isModalVisible}
                onCancel={handleModalCancel}
                footer={null}
            >
                <CreateTestPlanModal
                    projectId={projectId}
                    onTestPlanCreated={handleTestPlanCreated} // обработчик успешного создания тест-плана
                />
            </Modal>
        </div>
    );
};

export default TestPlansTab;
