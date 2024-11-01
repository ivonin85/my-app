import React from 'react';
import { Row, Col, Input, Typography, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

const { Text } = Typography;

const TestCaseUrlDisplay = ({ testCaseId }) => {
    const handleCopyUrl = () => {
        const testCaseUrl = `${window.location.origin}/testcases/${testCaseId}`;
        navigator.clipboard.writeText(testCaseUrl)
            .then(() => {
                message.success('URL тест-кейса скопирован в буфер обмена!');
            })
            .catch(() => {
                message.error('Не удалось скопировать URL.');
            });
    };

    return (
        <Row align="middle" style={{ marginBottom: '16px' }}>
            <Col>
                <Text strong style={{ fontSize: '16px', marginRight: '8px' }}>
                    URL тест-кейса:
                </Text>
            </Col>
            <Col>
                <Input
                    value={`${window.location.origin}/testcases/${testCaseId}`}
                    readOnly
                    style={{ width: '300px' }}
                    addonAfter={<CopyOutlined onClick={handleCopyUrl} style={{ cursor: 'pointer' }} />}
                />
            </Col>
        </Row>
    );
};

export default TestCaseUrlDisplay;
