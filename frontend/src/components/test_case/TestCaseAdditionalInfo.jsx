import React from 'react';
import { Form, Input, Select, Row, Col } from 'antd';

const { TextArea } = Input;

const TestCaseAdditionalInfo = ({
    description,
    setDescription,
    priority,
    setPriority,
    severity,
    setSeverity,
    status,
    setStatus,
    requirements,
    setRequirements,
}) => (
    <div>
        <Form.Item label="Описание" required>
            <TextArea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Введите описание"
                rows={3}
            />
        </Form.Item>
        <Row gutter={16}>
            <Col span={24}>
                <Form.Item label="Приоритет">
                    <Select value={priority} onChange={setPriority}>
                        <Select.Option value="Высокий">Высокий</Select.Option>
                        <Select.Option value="Средний">Средний</Select.Option>
                        <Select.Option value="Низкий">Низкий</Select.Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col span={24}>
                <Form.Item label="Серьезность">
                    <Select value={severity} onChange={setSeverity}>
                        <Select.Option value="Критическая">Критическая</Select.Option>
                        <Select.Option value="Серьезная">Серьезная</Select.Option>
                        <Select.Option value="Незначительная">Незначительная</Select.Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col span={24}>
                <Form.Item label="Статус">
                    <Select value={status} onChange={setStatus}>
                        <Select.Option value="Готов">Готов</Select.Option>
                        <Select.Option value="Не готов">Не готов</Select.Option>
                        <Select.Option value="На редактировании">На редактировании</Select.Option>
                        <Select.Option value="Необходимо актуализировать">Необходимо актуализировать</Select.Option>
                    </Select>
                </Form.Item>
            </Col>
        </Row>
        <Form.Item label="Требования">
            <TextArea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Введите требования"
            />
        </Form.Item>
    </div>
);

export default TestCaseAdditionalInfo;
