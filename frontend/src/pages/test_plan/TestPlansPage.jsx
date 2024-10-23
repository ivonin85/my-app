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

  // Функция для создания нового тест-плана
  const handleCreateTestPlan = async (values) => {
    try {
      await axios.post('http://localhost:8080/api/testplan', { ...values, projectId });
      message.success('Test plan created successfully');
      fetchTestPlans();
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error('Error creating test plan:', error);
      message.error('Failed to create test plan');
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
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Create Test Plan
      </Button>
      
      {/* Добавление индикатора загрузки */}
      <Table 
        dataSource={Array.isArray(testPlans) ? testPlans : []} 
        columns={columns} 
        rowKey="id" 
        loading={loading} 
      />

      <Modal
        title="Create Test Plan"
        open={isModalOpen}  // Ant Design 4.x -> 5.x: visible заменен на open
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateTestPlan}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter the name of the test plan!' }]}>
            <Input />
          </Form.Item>
          {/* Добавьте поля для moduleIds и tagIds, если нужно */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TestPlansPage;