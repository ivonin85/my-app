import React, { useEffect, useState } from 'react';
import { Table, Collapse, Spin, message, Layout, Button, Modal, Drawer, Tag } from 'antd';
import TestPlanService from '../../services/TestPlanService';
import TestRunService from '../../services/TestRunService';
import TestResultService from '../../services/TestResultService';
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
    const [testResults, setTestResults] = useState({});
    const [selectedTestRunId, setSelectedTestRunId] = useState(null);


    useEffect(() => {
        const fetchTestResults = async () => {
            if (!selectedTestRunId) return;
            
            try {
                const results = await TestResultService.getTestResultsByTestRunId(selectedTestRunId);
                const resultStatusMap = results.reduce((acc, result) => {
                    acc[result.testCaseId] = result.status;
                    return acc;
                }, {});
                setTestResults(resultStatusMap);
            } catch (error) {
                message.error('Не удалось загрузить статусы тестов');
            }
        };
    
        if (selectedTestRunId) {
            fetchTestResults();
        }
    }, [selectedTestRunId]);

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

    useEffect(() => {
        const fetchTestCases = async () => {
            try {
                const cases = await TestPlanService.getTestCases(testPlanId);
                setTestCasesByModuleAndTag(cases);
            } catch (error) {
                message.error('Не удалось загрузить тест-кейсы');
            }
        };
    
        if (testPlanId) {
            fetchTestCases();
        }
    }, [testPlanId]);

    if (loading) return <Spin />;

    const handleCreateTestRun = async () => {
        const testRunName = `${testPlanDetails.name} - ${new Date().toLocaleDateString()}`;
        try {
            const createdTestRun = await TestRunService.createTestRun(testPlanId, projectId, testRunName);
            message.success(`Тест-ран "${testRunName}" успешно создан`);
            setSelectedTestRunId(createdTestRun.id); // Сохраняем ID созданного тест-рана
            setIsModalOpen(false);
        } catch (error) {
            message.error('Не удалось создать тест-ран');
        }
    };



    const renderStatus = (testCaseId) => {
        const status = testResults[testCaseId] || 'Не протестирован';
        const statusMap = {
            'Не протестирован': { color: 'default', text: 'Не протестирован' },
            'Passed': { color: 'green', text: 'Пройден' },
            'Failed': { color: 'red', text: 'Провален' },
            'Blocked': { color: 'orange', text: 'Заблокирован' },
            'Retest': { color: 'blue', text: 'Ретест' },
        };
        const { color, text } = statusMap[status] || { color: 'default', text: 'Не протестирован' };
        return <Tag color={color}>{text}</Tag>;
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Название', dataIndex: 'title', key: 'title' },
        { title: 'Приоритет', dataIndex: 'priority', key: 'priority' },
        { title: 'Статус', dataIndex: 'id', key: 'status', render: renderStatus },
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
