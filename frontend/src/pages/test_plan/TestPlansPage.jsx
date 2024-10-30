import React, { useState, useEffect } from 'react';
import { Table, message, Layout } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import TestPlanService from '../../services/TestPlanService';
import Navbar from '../../components/Navbar';

const TestPlansPage = () => {
    const [testPlans, setTestPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const { projectId } = location.state || {};
    const navigate = useNavigate(); // Используем navigate для перенаправления
    const { Content } = Layout;

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

    const handleRowClick = (record) => {
        navigate(`/testplan_details`, { state: { testPlanId: record.id } }); // Передаем testPlanId
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleString(),
        },
    ];

    const contentStyle = { padding: '24px', background: '#fff', minHeight: '100vh', paddingTop: '120px' };

    return (
        <div><div><Navbar /></div>
            <Content style={contentStyle}>
                <Table
                    dataSource={Array.isArray(testPlans) ? testPlans : []}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                    onRow={(record) => ({
                        onClick: () => handleRowClick(record),
                    })}
                />
            </Content>
        </div>
    );
};

export default TestPlansPage;
