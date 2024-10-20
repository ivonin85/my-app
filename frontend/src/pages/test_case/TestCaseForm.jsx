import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { Form, Input, Select, Button, Typography, Row, Col, Card, message, Drawer } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import TestCaseService from '../../services/TestCaseService';
import TagService from '../../services/TagService';
import ProfileService from '../../services/ProfileService';
import TestCaseSteps from '../../components/test_case/TestCaseSteps';
import TagSelect from '../../components/test_case/TagSelect';

const { TextArea } = Input;
const { Title, Text } = Typography;

const TestCaseForm = ({ drawerVisible, openDrawer, closeDrawer, projectId, moduleId, testCaseId, onUpdate }) => {
    const location = useLocation();
    const { projectId: initialProjectId, moduleId: initialModuleId } = location.state || {};
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
    const [tagIds, setTagIds] = useState([]);
    const [tagNames, setTagNames] = useState([]);
    const [allTags, setAllTags] = useState([]);
    const [executorId, setExecutorId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        TagService.getAllTags()
            .then(response => setAllTags(response.data))
            .catch(error => console.error('Ошибка при загрузке тегов', error));

        ProfileService.getUserProfile()
            .then(response => setExecutorId(response.data.userId))
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
                    
                    TagService.getTagsByTestCaseId(testCaseId)
                        .then(response => {
                            const tags = response.data;
                            setTagIds(tags.map(tag => tag.id));
                            setTagNames(tags.map(tag => tag.name));
                        })
                        .catch(error => {
                            console.error('Ошибка при загрузке тегов тест-кейса', error);
                            setTagIds([]);
                            setTagNames([]);
                        });
                    setExecutorId(testCase.executor?.id || null);
                })
                .catch(error => console.error('Ошибка при загрузке тест-кейса', error));
        }
    }, [testCaseId]);

    const handleTagChange = (selectedTags) => {
        setTagNames(selectedTags);
        const selectedTagObjects = allTags.filter(tag => selectedTags.includes(tag.name));
        setTagIds(selectedTagObjects.map(tag => tag.id));
    };

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

    const handleCopyUrl = () => {
        const testCaseUrl = `${window.location.origin}/testcases/${testCaseId}`;
        navigator.clipboard.writeText(testCaseUrl).then(() => {
            message.success('URL тест-кейса скопирован в буфер обмена!');
        }).catch(() => {
            message.error('Не удалось скопировать URL.');
        });
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
            tags: tagNames,
            executorId,
            moduleId: moduleId,
            projectId: projectId,
        };

        const request = testCaseId
            ? TestCaseService.updateTestCase(testCaseId, testCaseData)
            : TestCaseService.createTestCase(testCaseData);

        request
            .then(() => {
                alert(`Тест-кейс ${testCaseId ? 'обновлен' : 'создан'} успешно!`);
                closeDrawer();
              
                if (onUpdate && typeof onUpdate === 'function') {
                    onUpdate();
                }
                navigate(`/projects/${projectId}/modules/${moduleId}`, { state: { projectId, moduleId } });
            })
            .catch(error => console.error(`Ошибка при ${testCaseId ? 'обновлении' : 'создании'} тест-кейса`, error));
    };



    return (
        <div>
        
            <Drawer
                title={testCaseId ? 'Редактирование тест-кейса' : 'Создание тест-кейса'}
                placement="left"
                onClose={closeDrawer}
                visible={drawerVisible}
                width="95%"
            >
                <Form onFinish={handleSubmit} layout="vertical">
                {testCaseId && (
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
                        style={{ width: '300px'}}
                        addonAfter={<CopyOutlined onClick={handleCopyUrl} style={{ cursor: 'pointer' }} />}
                    />
                </Col>
            </Row>
        )}
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
                        <TestCaseSteps
                            steps={steps}
                            onStepChange={handleStepChange}
                            onAddStep={addStep}
                            onRemoveStep={removeStep}
                        />
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
                                />
                            </Form.Item>

                            {/* Теги тест-кейса */}
                            <TagSelect
                                value={tagNames}
                                onChange={handleTagChange}
                                allTags={allTags}
                            />
                        </Card>
                    </Col>
                </Row>

                <Button type="primary" htmlType="submit">
                    {testCaseId ? 'Сохранить изменения' : 'Создать тест-кейс'}
                </Button>
                

                <Button onClick={closeDrawer} style={{ marginLeft: '8px' }}>
                    Отменить
                </Button>
                </Form>
            </Drawer>
        </div>
    );
};

export default TestCaseForm;
