import React, { useState, useEffect } from 'react';
import { Table, Button, message, Modal, Drawer } from 'antd';
import TestPlanService from '../../services/TestPlanService';
import CreateTestPlanModal from '../../pages/test_plan/CreateTestPlanModal';
import TestPlanDetails from '../../pages/test_plan/TestPlanDetails';

const TestPlansTab = ({ tabsStyle, handleTestPlansClick, projectId }) => {
    const [testPlans, setTestPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false); // состояние для видимости Drawer
    const [selectedTestPlan, setSelectedTestPlan] = useState(null); // выбранный тест-план

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
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const handleTestPlanCreated = () => {
        fetchTestPlans();
        setIsModalVisible(false);
    };

    const handleRowClick = (record) => {
        setSelectedTestPlan(record); // сохраняем выбранный тест-план
        setIsDrawerVisible(true); // открываем Drawer
    };

    const handleDrawerClose = () => {
        setIsDrawerVisible(false);
        setSelectedTestPlan(null); // очищаем выбранный тест-план при закрытии
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
                    onTestPlanCreated={handleTestPlanCreated}
                />
            </Modal>

            {/* Drawer для отображения деталей тест-плана */}
            <Drawer
                title="Детали тест-плана"
                placement="left"
                width="95%"
                onClose={handleDrawerClose}
                visible={isDrawerVisible}
            >
                {selectedTestPlan && (
                    <TestPlanDetails
                        testPlanId={selectedTestPlan.id}
                        projectId={projectId}
                        onClose={handleDrawerClose} // закрытие Drawer
                    />
                )}
            </Drawer>
        </div>
    );
};

export default TestPlansTab;
