import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import ModuleService from '../../services/ModuleService';
import TagService from '../../services/TagService';
import TestPlanService from '../../services/TestPlanService';

const { Option } = Select;

const CreateTestPlanModal = ({ projectId, onTestPlanCreated }) => {
    const [modules, setModules] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedModules, setSelectedModules] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        const fetchModulesAndTags = async () => {
            try {
                if (projectId) {
                    const modulesResponse = await ModuleService.getModulesByProjectId(projectId);
                    const tagsResponse = await TagService.getAllTags();
                    setModules(modulesResponse.data || []);
                    setTags(tagsResponse.data || []);
                }
            } catch (error) {
                message.error('Ошибка загрузки данных');
            }
        };

        fetchModulesAndTags();
    }, [projectId]);

    const onFinish = async (values) => {
        const { name } = values;

        try {
            await TestPlanService.createTestPlan(name, projectId, selectedModules, selectedTags);
            message.success('Тест-план успешно создан');
            if (onTestPlanCreated) {
                onTestPlanCreated(); // уведомляем родительский компонент
            }
        } catch (error) {
            message.error(error.message || 'Ошибка при создании тест-плана');
        }
    };

    return (
        <Form onFinish={onFinish} layout="vertical">
            <Form.Item
                label="Название тест-плана"
                name="name"
                rules={[{ required: true, message: 'Пожалуйста, введите название тест-плана!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item label="Выберите модули">
                <Select
                    mode="multiple"
                    placeholder="Выберите модули"
                    value={selectedModules}
                    onChange={setSelectedModules}
                >
                    {modules.map((module) => (
                        <Option key={module.id} value={module.id}>
                            {module.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item label="Выберите теги">
                <Select
                    mode="multiple"
                    placeholder="Выберите теги"
                    value={selectedTags}
                    onChange={setSelectedTags}
                >
                    {tags.map((tag) => (
                        <Option key={tag.id} value={tag.id}>
                            {tag.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Создать тест-план
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CreateTestPlanModal;
