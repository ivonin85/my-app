import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Select, Button, Typography, Row, Col, Card } from 'antd';
import TestCaseService from '../../services/TestCaseService';
import TagService from '../../services/TagService';
import ProfileService from '../../services/ProfileService';

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
    const [priority, setPriority] = useState('Низкий');
    const [severity, setSeverity] = useState('Незначительная');
    const [status, setStatus] = useState('Не готов');
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
                <Row gutter={24}>
                    {/* Левая часть */}
                    <Col span={16}>
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

                        {/* Шаги тест-кейса */}
                        <Card
                            title="Шаги тест-кейса"
                            bordered={true}
                            style={{ marginBottom: '24px', backgroundColor: '#f0f2f5', border: '2px dashed #d9d9d9' }}
                        >
                            {steps.map((step, index) => (
                                <div key={index} style={{ marginBottom: '16px' }}>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <TextArea
                                                placeholder="Действие"
                                                value={step.action}
                                                onChange={(e) => handleStepChange(index, 'action', e.target.value)}
                                                style={{ marginBottom: '8px', width: '100%' }}
                                                autoSize={{ minRows: 1, maxRows: 6 }}
                                            />
                                        </Col>
                                        <Col span={12}>
                                            <TextArea
                                                placeholder="Ожидаемый результат"
                                                value={step.expectedResult}
                                                onChange={(e) => handleStepChange(index, 'expectedResult', e.target.value)}
                                                style={{ width: '100%' }}
                                                autoSize={{ minRows: 1, maxRows: 6 }}
                                            />
                                        </Col>
                                    </Row>
                                    <Button type="dashed" onClick={() => removeStep(index)} style={{ marginTop: '8px' }}>
                                        Удалить шаг
                                    </Button>
                                </div>
                            ))}
                            <Button type="dashed" onClick={addStep}>Добавить шаг</Button>
                        </Card>

                        <Card title="Теги" bordered={true} style={{ marginBottom: '24px' }}>
                            <Form.Item label="Теги">
                                <Select
                                    mode="multiple"
                                    value={tags}
                                    onChange={setTags}
                                    options={allTags.map(tag => ({ value: tag.id, label: tag.name }))}
                                />
                            </Form.Item>
                        </Card>
                    </Col>

                    {/* Правая часть */}
                    <Col span={8}>
                        <Card title="Дополнительная информация" bordered={true} style={{ marginBottom: '24px' }}>
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
                        </Card>
                    </Col>
                </Row>

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