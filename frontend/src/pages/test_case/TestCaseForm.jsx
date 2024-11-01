import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { Form, Button, Row, Col, Card, Drawer } from 'antd';
import TestCaseService from '../../services/TestCaseService';
import TagService from '../../services/TagService';
import ProfileService from '../../services/ProfileService';
import TestCaseSteps from '../../components/test_case/TestCaseSteps';
import TagSelect from '../../components/test_case/TagSelect';
import TestCaseUrlDisplay from '../../components/test_case/TestCaseUrlDisplay';
import TestCaseMainInfo from '../../components/test_case/TestCaseMainInfo';
import TestCaseAdditionalInfo from '../../components/test_case/TestCaseAdditionalInfo';

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

                {/* Отображение URL тест-кейса */}
                {testCaseId && <TestCaseUrlDisplay testCaseId={testCaseId} />}

                <Row gutter={24}>
                    {/* Левая часть */}
                    <Col span={16}>
                    
                    {/* Основная информация тест-кейса */}
                    <TestCaseMainInfo title={title} setTitle={setTitle} preconditions={preconditions} setPreconditions={setPreconditions} />

                    {/* Шаги тест-кейса */}
                    <TestCaseSteps steps={steps} setSteps={setSteps} />
                    </Col>

                    {/* Правая часть */}
                    <Col span={8}>
                        <Card title="Дополнительная информация" bordered={true} style={{ marginBottom: '24px' }}>
                             {/* Блокс дополнительной информацией тест-кейса */}
                            <TestCaseAdditionalInfo
                                description={description}
                                setDescription={setDescription}
                                priority={priority}
                                setPriority={setPriority}
                                severity={severity}
                                setSeverity={setSeverity}
                                status={status}
                                setStatus={setStatus}
                                requirements={requirements}
                                setRequirements={setRequirements}
                            />

                            {/* Теги тест-кейса */}
                            <TagSelect value={tagNames} onChange={handleTagChange} allTags={allTags} projectId={projectId} />
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
