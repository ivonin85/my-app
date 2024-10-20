import React, { useState } from 'react';
import { Modal, Input, Button, message } from 'antd';
import ProjectService from '../../services/ProjectService';

const AddMemberModal = ({ visible, onCancel, projectId, refreshProject }) => {
    const [userId, setUserId] = useState('');

    const handleAddMember = () => {
        ProjectService.addMemberToProject(projectId, userId)
            .then(() => {
                message.success('Пользователь успешно добавлен в проект!');
                refreshProject();
                onCancel(); // Закрываем модальное окно
                setUserId(''); // Очищаем поле после успешного добавления
            })
            .catch(error => {
                console.error('Ошибка при добавлении пользователя', error);
                message.error('Не удалось добавить пользователя. Попробуйте еще раз.');
            });
    };

    return (
        <Modal
            title="Добавить пользователя в проект"
            visible={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Input
                placeholder="Введите ID пользователя"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />
            <Button type="primary" onClick={handleAddMember} style={{ marginTop: 16 }}>
                Добавить
            </Button>
        </Modal>
    );
};

export default AddMemberModal;
