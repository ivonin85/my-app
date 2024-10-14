import React from 'react';
import { Select, Form } from 'antd';

const TagSelect = ({ value, onChange, allTags }) => {
    return (
        <Form.Item label="Теги">
            <Select
                mode="tags"
                value={value}
                onChange={(selectedTags) => {
                    onChange(selectedTags);
                }}
                tokenSeparators={[',']}
                options={allTags.map(tag => ({ value: tag.name, label: tag.name }))}
                placeholder="Введите теги или выберите из списка"
            />
        </Form.Item>
    );
};

export default TagSelect;
