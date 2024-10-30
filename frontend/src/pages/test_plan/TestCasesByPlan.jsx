import React, { useEffect, useState } from 'react';
import { Table, Collapse, Spin, message, Layout } from 'antd';
import { useLocation } from 'react-router-dom';
import TestPlanService from '../../services/TestPlanService';
import Navbar from '../../components/Navbar';

const { Panel } = Collapse;

const TestCasesByPlan = () => {
    const location = useLocation();
    const { testPlanId } = location.state || {};
    const [testCasesByModuleAndTag, setTestCasesByModuleAndTag] = useState({});
    const [loading, setLoading] = useState(false);
    const { Content } = Layout; 

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

    if (loading) return <Spin />;

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Название', dataIndex: 'title', key: 'title' },
        { title: 'Приоритет', dataIndex: 'priority', key: 'priority' },
        { title: 'Статус', dataIndex: 'status', key: 'status' }
    ];

    const contentStyle = {padding: '24px', background: '#fff', minHeight: '100vh', paddingTop: '120px'};

    return (
        <div><div><Navbar /></div>
        <Content style={contentStyle}>  
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
                                />
                            </div>
                        ))}
                    </Panel>
                </Collapse>
            ))}
            </Content>
        </div>
    );
};

export default TestCasesByPlan;