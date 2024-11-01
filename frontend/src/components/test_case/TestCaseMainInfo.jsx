import React from 'react';
import { Card, Form, Input } from 'antd';

const { TextArea } = Input;

const TestCaseMainInfo = ({ title, setTitle, preconditions, setPreconditions }) => {
    return (
        <Card title="Основная информация" bordered={true} style={{ marginBottom: '24px' }}>
            <Form.Item label="Заголовок" required>
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Введите заголовок"
                />
            </Form.Item>
            <Form.Item label="Предусловия">
                <TextArea
                    value={preconditions}
                    onChange={(e) => setPreconditions(e.target.value)}
                    placeholder="Введите предусловия"
                    rows={3}
                />
            </Form.Item>
        </Card>
    );
};

export default TestCaseMainInfo;
