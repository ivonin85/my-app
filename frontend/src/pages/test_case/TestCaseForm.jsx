import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, Drawer } from 'antd';
import TestCaseService from '../../services/TestCaseService';
import TagService from '../../services/TagService';
import ProfileService from '../../services/ProfileService';
import TestCaseSteps from '../../components/test_case/TestCaseSteps';
import TagSelect from '../../components/test_case/TagSelect';
import TestCaseUrlDisplay from '../../components/test_case/TestCaseUrlDisplay';
import TestCaseMainInfo from '../../components/test_case/TestCaseMainInfo';
import TestCaseAdditionalInfo from '../../components/test_case/TestCaseAdditionalInfo';

const TestCaseForm = ({
    drawerVisible,
    openDrawer,
    closeDrawer,
    projectId,
    moduleId,
    testCaseId,
    onUpdate,
    isReadOnly = false, // Новый проп для отключения редактирования
}) => {
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
    const [tagNames, setTagNames] = useState([]);
    const [allTags, setAllTags] = useState([]);
    const [executorId, setExecutorId] = useState(null);

    useEffect(() => {
        TagService.getAllTags()
            .then((response) => setAllTags(response.data))
            .catch((error) => console.error('Ошибка при загрузке тегов', error));

        ProfileService.getUserProfile()
            .then((response) => setExecutorId(response.data.userId))
            .catch((error) => console.error('Ошибка при загрузке профиля', error));

        if (testCaseId) {
            TestCaseService.getTestCase(testCaseId)
                .then((response) => {
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
                        .then((response) => {
                            const tags = response.data;
                            setTagNames(tags.map((tag) => tag.name));
                        })
                        .catch((error) => console.error('Ошибка при загрузке тегов тест-кейса', error));
                })
                .catch((error) => console.error('Ошибка при загрузке тест-кейса', error));
        }
    }, [testCaseId]);

    const handleTagChange = (selectedTags) => {
        if (!isReadOnly) {
            setTagNames(selectedTags);
            const selectedTagObjects = allTags.filter((tag) => selectedTags.includes(tag.name));
            setTags(selectedTagObjects.map((tag) => tag.id));
        }
    };

    const handleSubmit = () => {
        if (isReadOnly) return;

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
            })
            .catch((error) => console.error(`Ошибка при ${testCaseId ? 'обновлении' : 'создании'} тест-кейса`, error));
    };

    return (
        <Drawer
            title={testCaseId ? 'Просмотр тест-кейса' : 'Создание тест-кейса'}
            placement="left"
            onClose={closeDrawer}
            visible={drawerVisible}
            width="95%"
        >
            <Form onFinish={handleSubmit} layout="vertical">
                {testCaseId && <TestCaseUrlDisplay testCaseId={testCaseId} />}

                <Row gutter={24}>
                    <Col span={16}>
                        <TestCaseMainInfo
                            title={title}
                            setTitle={!isReadOnly ? setTitle : undefined}
                            preconditions={preconditions}
                            setPreconditions={!isReadOnly ? setPreconditions : undefined}
                        />
                        <TestCaseSteps
                            steps={steps}
                            setSteps={!isReadOnly ? setSteps : undefined}
                            isReadOnly={isReadOnly} // передаем флаг для отключения кнопок управления шагами
                        />
                    </Col>

                    <Col span={8}>
                        <Card title="Дополнительная информация" bordered={true} style={{ marginBottom: '24px' }}>
                            <TestCaseAdditionalInfo
                                description={description}
                                setDescription={!isReadOnly ? setDescription : undefined}
                                priority={priority}
                                setPriority={!isReadOnly ? setPriority : undefined}
                                severity={severity}
                                setSeverity={!isReadOnly ? setSeverity : undefined}
                                status={status}
                                setStatus={!isReadOnly ? setStatus : undefined}
                                requirements={requirements}
                                setRequirements={!isReadOnly ? setRequirements : undefined}
                            />
                            <TagSelect
                                value={tagNames}
                                onChange={!isReadOnly ? handleTagChange : undefined}
                                allTags={allTags}
                                projectId={projectId}
                            />
                        </Card>
                    </Col>
                </Row>

                {!isReadOnly && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="primary" htmlType="submit">
                            {testCaseId ? 'Сохранить изменения' : 'Создать тест-кейс'}
                        </Button>
                        <Button onClick={closeDrawer} style={{ marginLeft: '8px' }}>
                            Отменить
                        </Button>
                    </div>
                )}
            </Form>
        </Drawer>
    );
};

export default TestCaseForm;
