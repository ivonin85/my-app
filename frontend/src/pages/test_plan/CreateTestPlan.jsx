import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import ModuleService from '../../services/ModuleService';
import TagService from '../../services/TagService';

const { Option } = Select;

const CreateTestPlan = () => {
    const [modules, setModules] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedModules, setSelectedModules] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        // Загрузка модулей и тегов из API
        const fetchModulesAndTags = async () => {
            try {
                const modulesResponse = await ModuleService.getModulesByProjectId(149); // Дождаться ответа
                const tagsResponse = await TagService.getAllTags(); // Дождаться ответа
                setModules(modulesResponse.data || []); // Проверка на наличие данных
                setTags(tagsResponse.data || []); // Проверка на наличие данных
            } catch (error) {
                message.error('Ошибка загрузки данных');
            }
        };

        fetchModulesAndTags();
    }, []);

    const onFinish = async (values) => {
        const { name } = values;

        try {
            const response = await axios.post('http://localhost:8080/api/testplans/create', {
                name,
                moduleIds: selectedModules,
                tagIds: selectedTags,
            }, { withCredentials: true });
            message.success('Тест-план успешно создан');
            console.log(response.data);
            // Очистка формы или дополнительная логика
        } catch (error) {
            message.error('Ошибка при создании тест-плана');
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
                    {modules.map(module => (
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
                    {tags.map(tag => (
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

export default CreateTestPlan;
