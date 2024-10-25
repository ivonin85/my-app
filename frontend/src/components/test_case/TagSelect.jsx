import React, { useState } from 'react';
import { Select, Form, message } from 'antd';
import TagService from '../../services/TagService';

const TagSelect = ({ value, onChange, allTags, projectId }) => {
    const [loading, setLoading] = useState(false);

    const handleTagChange = (selectedTags) => {
        onChange(selectedTags);
    };

    const handleTagCreate = async (inputValue) => {
        // Проверяем, существует ли тег с таким именем
        const existingTag = allTags.find(tag => tag.name === inputValue);
        if (existingTag) {
            return; // Не создаем тег, если он уже есть
        }

        setLoading(true);
        try {
            const response = await TagService.createTag(inputValue, projectId);
            const newTag = response.data;
            allTags.push(newTag); // Добавляем новый тег в общий список
            handleTagChange([...value, newTag.name]); // Обновляем выбранные теги
            message.success(`Тег "${inputValue}" успешно создан!`);
        } catch (error) {
            console.error('Ошибка при создании тега:', error);
            message.error('Ошибка при создании нового тега');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form.Item label="Теги">
            <Select
                mode="tags"
                value={value}
                onChange={handleTagChange}
                onDeselect={(deselectedTag) => handleTagChange(value.filter(tag => tag !== deselectedTag))}
                tokenSeparators={[',']}
                options={allTags.map(tag => ({ value: tag.name, label: tag.name }))}
                placeholder="Введите теги или выберите из списка"
                notFoundContent={loading ? 'Создание нового тега...' : null}
                onBlur={(e) => {
                    const inputValue = e.target.value.trim();
                    if (inputValue) {
                        handleTagCreate(inputValue);
                    }
                }}
            />
        </Form.Item>
    );
};

export default TagSelect;
