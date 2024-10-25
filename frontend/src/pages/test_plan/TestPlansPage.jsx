import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import { useLocation } from 'react-router-dom';

const TestPlansPage = () => {
  const [testPlans, setTestPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const location = useLocation();
  const { projectId } = location.state || {};

  useEffect(() => {
    if (projectId) {
      fetchTestPlans();
    }
  }, [projectId]);

  const fetchTestPlans = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/testplan/project/${projectId}`, { withCredentials: true });
      setTestPlans(response.data);
    } catch (error) {
      console.error('Error fetching test plans:', error);
      message.error('Failed to load test plans');
    } finally {
      setLoading(false);
    }
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
      render: (date) => new Date(date).toLocaleString(), // Форматирование даты
    },
  ];

  return (
    <div>
      
      {/* Добавление индикатора загрузки */}
      <Table 
        dataSource={Array.isArray(testPlans) ? testPlans : []} 
        columns={columns} 
        rowKey="id" 
        loading={loading} 
      />

    </div>
  );
};

export default TestPlansPage;