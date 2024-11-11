import React, { useEffect, useState } from 'react';
import { Table, message, Spin, Drawer } from 'antd';
import TestRunService from '../../services/TestRunService';
import TestPlanDetails from '../../pages/test_plan/TestPlanDetails';

const TestRunsTab = ({ projectId }) => {
    const [testRuns, setTestRuns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [selectedTestRun, setSelectedTestRun] = useState(null); // выбранный тест-ран

    useEffect(() => {
        const fetchTestRuns = async () => {
            try {
                const data = await TestRunService.getTestRunsByProjectId(projectId);
                setTestRuns(data);
            } catch (error) {
                message.error('Не удалось загрузить тест-раны');
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            fetchTestRuns();
        }
    }, [projectId]);

    // Функция, вызываемая при клике на строку тест-рана
    const handleRowClick = (record) => {
        setSelectedTestRun(record); // сохраняем выбранный тест-ран
        setIsDrawerVisible(true); // открываем Drawer
    };

    // Функция закрытия Drawer
    const handleDrawerClose = () => {
        setIsDrawerVisible(false);
        setSelectedTestRun(null); // очищаем выбранный тест-ран при закрытии
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Название', dataIndex: 'name', key: 'name' },
        { 
            title: 'Дата создания', 
            dataIndex: 'createdAt', 
            key: 'createdAt', 
            render: (date) => new Date(date).toLocaleString(),
        },
    ];

    if (loading) return <Spin />;

    return (
        <div>
            <Table
                dataSource={testRuns}
                columns={columns}
                rowKey="id"
                onRow={(record) => ({
                    onClick: () => handleRowClick(record), // обработчик клика на строку
                })}
            />

            {/* Drawer для отображения деталей выбранного тест-рана */}
            <Drawer
                title="Тест-кейсы тест-рана"
                placement="left"
                width="95%"
                onClose={handleDrawerClose}
                visible={isDrawerVisible}
                destroyOnClose={true}
            >
                {selectedTestRun ? (
                    <TestPlanDetails
                        testPlanId={selectedTestRun.testPlanId}
                        projectId={projectId}
                        onClose={handleDrawerClose}
                    />
                ) : (
                    <Spin /> // Показать загрузку, пока `selectedTestRun` не будет доступен
                )}
            </Drawer>
        </div>
    );
};

export default TestRunsTab;
