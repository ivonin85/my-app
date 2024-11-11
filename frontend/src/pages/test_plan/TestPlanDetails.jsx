import React, { useEffect, useState } from 'react';
import { Table, Collapse, Spin, message, Layout, Button, Modal, Drawer } from 'antd';
import TestPlanService from '../../services/TestPlanService';
import TestRunService from '../../services/TestRunService';
import TestCaseForm from '../test_case/TestCaseForm';

const { Panel } = Collapse;
const { Content } = Layout;

const TestPlanDetails = ({ testPlanId, projectId, onClose }) => {
    const [testCasesByModuleAndTag, setTestCasesByModuleAndTag] = useState({});
    const [loading, setLoading] = useState(false);
    const [testPlanDetails, setTestPlanDetails] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedTestCaseId, setSelectedTestCaseId] = useState(null);

    useEffect(() => {
        const fetchTestCases = async () => {
            setLoading(true);
            try {
                const data = await TestPlanService.getTestCases(testPlanId);
                setTestCasesByModuleAndTag(data);
            } catch (error) {
                message.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTestCases();
    }, [testPlanId]);

    useEffect(() => {
        const fetchTestPlanDetails = async () => {
            try {
                const details = await TestPlanService.getTestPlanById(testPlanId);
                setTestPlanDetails(details);
            } catch (error) {
                message.error('Не удалось загрузить детали тест-плана');
            }
        };

        if (testPlanId) {
            fetchTestPlanDetails();
        }
    }, [testPlanId]);

    if (loading) return <Spin />;

    const handleCreateTestRun = async () => {
        const testRunName = `${testPlanDetails.name} - ${new Date().toLocaleDateString()}`;
        try {
            await TestRunService.createTestRun(testPlanId, projectId, testRunName);
            message.success(`Тест-ран "${testRunName}" успешно создан`);
            setIsModalOpen(false);
        } catch (error) {
            message.error('Не удалось создать тест-ран');
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Название', dataIndex: 'title', key: 'title' },
        { title: 'Приоритет', dataIndex: 'priority', key: 'priority' },
        { title: 'Статус', dataIndex: 'status', key: 'status' }
    ];

    const onRowClick = (record) => ({
        onClick: () => {
            setSelectedTestCaseId(record.id);
            setDrawerVisible(true);
        }
    });

    const contentStyle = { padding: '24px', background: '#fff', minHeight: '100vh' };

    return (
        <Content style={contentStyle}>
            <h2>{testPlanDetails.name || 'Тест-план'}</h2>
            <Button style={{ marginBottom: '8px' }} type="primary" onClick={() => setIsModalOpen(true)}>
                Создать тест-ран
            </Button>
            <Button style={{ marginBottom: '8px', marginLeft: '8px' }} onClick={onClose}>
                Назад к тест-планам
            </Button>
            <Modal
                title="Создание тест-рана"
                visible={isModalOpen}
                onOk={handleCreateTestRun}
                onCancel={() => setIsModalOpen(false)}
                okText="Создать"
                cancelText="Отмена"
            >
                <p>Название тест-рана: {`${testPlanDetails.name} - ${new Date().toLocaleDateString()}`}</p>
            </Modal>
            {Object.keys(testCasesByModuleAndTag).map(moduleName => (
                <Collapse key={moduleName}>
                    <Panel header={moduleName}>
                        {Object.keys(testCasesByModuleAndTag[moduleName]).map(tag => (
                            <div key={tag}>
                                <h4>{tag}</h4>
                                <Table
                                    dataSource={testCasesByModuleAndTag[moduleName][tag]}
                                    columns={columns}
                                    rowKey="id"
                                    pagination={false}
                                    onRow={onRowClick}
                                />
                            </div>
                        ))}
                    </Panel>
                </Collapse>
            ))}
            <Drawer
                title="Просмотр тест-кейса"
                placement="left"
                visible={drawerVisible}
                onClose={() => setDrawerVisible(false)}
                width="95%"
            >
                <TestCaseForm
                    drawerVisible={drawerVisible}
                    closeDrawer={() => setDrawerVisible(false)}
                    projectId={projectId}
                    moduleId={null}
                    testCaseId={selectedTestCaseId}
                    isReadOnly={true}
                />
            </Drawer>
        </Content>
    );
};

export default TestPlanDetails;
