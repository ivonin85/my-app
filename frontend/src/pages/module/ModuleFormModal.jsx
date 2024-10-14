import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import ModuleService from '../../services/ModuleService';
import { ModuleActions } from '../../hooks/ModuleActions';

const ModuleFormModal = ({ visible, onCancel, onOk, projectId, moduleId }) => {
    const [form] = Form.useForm();
    const [modules, setModules] = useState([]); // Список доступных модулей (для выбора родительского модуля)
    const [isEditMode, setIsEditMode] = useState(false); // Режим редактирования
    const { moduleCreate, moduleUpdate } = ModuleActions(projectId);

    useEffect(() => {
        // Если moduleId существует, значит мы в режиме редактирования
        if (moduleId) {
            setIsEditMode(true);
            // Загружаем данные модуля для редактирования
            ModuleService.getModuleById(moduleId)
                .then(response => {
                    form.setFieldsValue({
                        name: response.data.name,
                        parentId: response.data.parentId
                    });
                })
                .catch(error => console.error('Ошибка при загрузке модуля', error));
        }

        // Получаем все модули для выбора родительского
        ModuleService.getModulesByProjectId(projectId)
            .then(response => {
                // Исключаем текущий модуль из списка родительских, если это редактирование
                const availableModules = moduleId
                    ? response.data.filter(module => module.id !== parseInt(moduleId))
                    : response.data;
                setModules(availableModules);
            })
            .catch(error => console.error('Ошибка при загрузке модулей', error));
    }, [projectId, moduleId, form]);

    const handleSubmit = () => {
        form
            .validateFields()
            .then(values => {
                const moduleData = { ...values, projectId };
                if (isEditMode) {
                    // Обновляем модуль
                    moduleUpdate(moduleId, moduleData);
                } else {
                    // Создаём новый модуль
                    moduleCreate(moduleData);
                }
                onOk(); // Закрытие модального окна после успешного создания/обновления
            })
            .catch(error => console.error('Ошибка при валидации формы', error));
    };

    return (
        <Modal
            title={isEditMode ? 'Редактирование модуля' : 'Создать новый модуль'}
            visible={visible}
            onCancel={onCancel}
            onOk={handleSubmit}
            okText={isEditMode ? 'Обновить' : 'Создать'}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="Название модуля"
                    rules={[{ required: true, message: 'Введите название модуля' }]}
                >
                    <Input placeholder="Введите название модуля" />
                </Form.Item>
                <Form.Item name="parentId" label="Родительский модуль (необязательно)">
                    <Select placeholder="Выберите родительский модуль">
                        <Select.Option value={null}>Нет</Select.Option>
                        {modules.map(module => (
                            <Select.Option key={module.id} value={module.id}>
                                {module.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModuleFormModal;
