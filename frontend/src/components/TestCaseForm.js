import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Select, Button, Typography, Row, Col } from 'antd';
import TestCaseService from '../services/TestCaseService';
import TagService from '../services/TagService';
import ProfileService from '../services/ProfileService';

const { TextArea } = Input;
const { Title } = Typography;

const TestCaseForm = () => {
    const { testCaseId } = useParams();
    const location = useLocation();
    const { projectId, moduleId: initialModuleId } = location.state || {};
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [preconditions, setPreconditions] = useState('');
    const [steps, setSteps] = useState([{ action: '', expectedResult: '' }]);
    const [priority, setPriority] = useState('medium');
    const [severity, setSeverity] = useState('minor');
    const [status, setStatus] = useState('Not Passed');
    const [requirements, setRequirements] = useState('');
    const [comments, setComments] = useState('');
    const [tags, setTags] = useState([]);
    const [allTags, setAllTags] = useState([]);
    const [executorId, setExecutorId] = useState(null);
    const [moduleId, setModuleId] = useState(initialModuleId);
    const navigate = useNavigate();

    useEffect(() => {
        TagService.getAllTags()
            .then(response => setAllTags(response.data))
            .catch(error => console.error('Ошибка при загрузке тегов', error));

        ProfileService.getUserProfile()
            .then(response => setExecutorId(response.data.id))
            .catch(error => console.error('Ошибка при загрузке профиля', error));

        if (testCaseId) {
            TestCaseService.getTestCase(testCaseId)
                .then(response => {
                    const testCase = response.data;
                    setTitle(testCase.title);
                    setDescription(testCase.description);
                    setPreconditions(testCase.preconditions);
                    setSteps(testCase.steps);
                    setPriority(testCase.priority);
                    setSeverity(testCase.severity);
                    setStatus(testCase.status);
                    setRequirements(testCase.requirements);
                    setComments(testCase.comments);
                    setTags(testCase.tags.map(tag => tag.id));
                    setExecutorId(testCase.executor?.id || null);
                    setModuleId(testCase.moduleId);
                })
                .catch(error => console.error('Ошибка при загрузке тест-кейса', error));
        }
    }, [testCaseId]);

    const handleStepChange = (index, field, value) => {
        const newSteps = [...steps];
        newSteps[index][field] = value;
        setSteps(newSteps);
    };

    const addStep = () => {
        setSteps([...steps, { action: '', expectedResult: '' }]);
    };

    const removeStep = (index) => {
        setSteps(steps.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        const testCaseData = {
            title,
            description,
            preconditions,
            steps,
            priority,
            severity,
            status,
            requirements,
            comments,
            tags,
            executorId,
            moduleId
        };

        const request = testCaseId
            ? TestCaseService.updateTestCase(testCaseId, testCaseData)
            : TestCaseService.createTestCase(testCaseData);

        request
            .then(() => {
                alert(`Тест-кейс ${testCaseId ? 'обновлен' : 'создан'} успешно!`);
                navigate(`/projects/${projectId}/modules/${moduleId}`, { state: { projectId, moduleId } });
            })
            .catch(error => console.error(`Ошибка при ${testCaseId ? 'обновлении' : 'создании'} тест-кейса`, error));
    };

    return (
        <div>
            <Title level={2}>{testCaseId ? 'Редактирование тест-кейса' : 'Создание тест-кейса'}</Title>
            <Form onFinish={handleSubmit} layout="vertical">
                <Form.Item label="Заголовок" required>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Введите заголовок"
                    />
                </Form.Item>
                <Form.Item label="Описание" required>
                    <TextArea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Введите описание"
                        rows={3}
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
                <Form.Item label="Шаги">
                    {steps.map((step, index) => (
                        <div key={index} style={{ marginBottom: '16px' }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Input
                                        placeholder="Действие"
                                        value={step.action}
                                        onChange={(e) => handleStepChange(index, 'action', e.target.value)}
                                        style={{ marginBottom: '8px' }}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Input
                                        placeholder="Ожидаемый результат"
                                        value={step.expectedResult}
                                        onChange={(e) => handleStepChange(index, 'expectedResult', e.target.value)}
                                    />
                                </Col>
                            </Row>
                            <Button type="dashed" onClick={() => removeStep(index)} style={{ marginTop: '8px' }}>
                                Удалить шаг
                            </Button>
                        </div>
                    ))}
                    <Button type="dashed" onClick={addStep}>Добавить шаг</Button>
                </Form.Item>
                <Form.Item label="Приоритет">
                    <Select value={priority} onChange={setPriority}>
                        <Select.Option value="high">Высокий</Select.Option>
                        <Select.Option value="medium">Средний</Select.Option>
                        <Select.Option value="low">Низкий</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Серьезность">
                    <Select value={severity} onChange={setSeverity}>
                        <Select.Option value="critical">Критическая</Select.Option>
                        <Select.Option value="major">Серьезная</Select.Option>
                        <Select.Option value="minor">Незначительная</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Статус">
                    <Select value={status} onChange={setStatus}>
                        <Select.Option value="Passed">Пройден</Select.Option>
                        <Select.Option value="Not Passed">Не пройден</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Теги">
                    <Select
                        mode="multiple"
                        value={tags}
                        onChange={setTags}
                        options={allTags.map(tag => ({ value: tag.id, label: tag.name }))}
                    />
                </Form.Item>
                <Form.Item label="Требования">
                    <TextArea
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        placeholder="Введите требования"
                        rows={3}
                    />
                </Form.Item>
                <Form.Item label="Комментарии">
                    <TextArea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Введите комментарии"
                        rows={3}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        {testCaseId ? 'Обновить тест-кейс' : 'Создать тест-кейс'}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default TestCaseForm;
