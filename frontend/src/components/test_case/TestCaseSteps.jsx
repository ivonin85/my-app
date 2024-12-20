import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { Card, Row, Col, Button, Input } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const TestCaseSteps = ({ steps, setSteps }) => {
    const actionRefs = useRef([]);
    const expectedRefs = useRef([]);

    const syncHeight = (index) => {
        const actionTextArea = actionRefs.current[index];
        const expectedTextArea = expectedRefs.current[index];

        if (actionTextArea && expectedTextArea) {
            const maxHeight = Math.max(
                actionTextArea.scrollHeight,
                expectedTextArea.scrollHeight
            );
            if (actionTextArea.style) {
                actionTextArea.style.height = `${maxHeight}px`;
            }
            if (expectedTextArea.style) {
                expectedTextArea.style.height = `${maxHeight}px`;
            }
        }
    };

    useLayoutEffect(() => {
        steps.forEach((_, index) => syncHeight(index));
    }, [steps]);

    const addStep = () => {
        setSteps([...steps, { action: '', expectedResult: '' }]);
    };

    const removeStep = (index) => {
        setSteps(steps.filter((_, i) => i !== index));
    };

    return (
        <Card title="Шаги тест-кейса" bordered={true} style={{ marginBottom: '24px' }}>
            {steps.map((step, index) => (
                <Row key={index} gutter={16} align="middle" style={{ marginBottom: '16px' }}>
                    <Col span={1} style={{ paddingRight: '5px' }}>
                        <span>{index + 1}</span>
                    </Col>
                    <Col span={11} style={{ paddingRight: '5px' }}>
                        <TextArea
                            ref={(el) => (actionRefs.current[index] = el)}
                            placeholder="Действие"
                            value={step.action}
                            onChange={(e) => {
                                const newSteps = [...steps];
                                newSteps[index].action = e.target.value;
                                setSteps(newSteps);
                                syncHeight(index);
                            }}
                            style={{ width: '100%' }}
                            autoSize={{ minRows: 1, maxRows: 6 }}
                        />
                    </Col>
                    <Col span={11} style={{ paddingRight: '5px' }}>
                        <TextArea
                            ref={(el) => (expectedRefs.current[index] = el)}
                            placeholder="Ожидаемый результат"
                            value={step.expectedResult}
                            onChange={(e) => {
                                const newSteps = [...steps];
                                newSteps[index].expectedResult = e.target.value;
                                setSteps(newSteps);
                                syncHeight(index);
                            }}
                            style={{ width: '100%' }}
                            autoSize={{ minRows: 1, maxRows: 6 }}
                        />
                    </Col>
                    <Col span={1} style={{ paddingLeft: '5px' }}>
                        <Button type="link" icon={<DeleteOutlined />} onClick={() => removeStep(index)} />
                    </Col>
                </Row>
            ))}
            <Button type="dashed" onClick={addStep} style={{ marginTop: '16px' }}>
                Добавить шаг
            </Button>
        </Card>
    );
};

export default TestCaseSteps;