import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ProfileService from '../services/ProfileService';
import Navbar from '../components/Navbar';
import { Form, Input, Button, Image, Space, Descriptions } from 'antd';

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [editable, setEditable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    ProfileService.getUserProfile()
      .then(response => {
        setUserProfile(response.data);
      })
      .catch(error => {
        console.error('Ошибка при загрузке профиля', error);
        navigate('/login');
      });
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile({ ...userProfile, [name]: value });
  };

  const handleSave = () => {
    ProfileService.updateUserProfile(userProfile)
      .then(response => {
        setEditable(false);
        setUserProfile(response.data);
      })
      .catch(error => {
        console.error('Ошибка при обновлении профиля', error);
      });
  };

  return (
    <div>
      <div><Navbar /></div>
      {userProfile ? (
        <div>
          <h1>Добро пожаловать, {userProfile.name || 'Нет имени'} {userProfile.surname || 'Нет фамилии'}</h1>
          {editable ? (
            <Form layout="vertical">
              <Form.Item label="Имя">
                <Input type="text" name="name" value={userProfile.name || ''} onChange={handleInputChange} placeholder="Имя" />
              </Form.Item>
              <Form.Item label="Фамилия">
                <Input type="text" name="surname" value={userProfile.surname || ''} onChange={handleInputChange} placeholder="Фамилия" />
              </Form.Item>
              <Form.Item label="Отчество">
                <Input type="text" name="patronymic" value={userProfile.patronymic || ''} onChange={handleInputChange} placeholder="Отчество" />
              </Form.Item>
              <Form.Item label="Дата рождения">
                <Input type="date" name="dateOfBirth" value={userProfile.dateOfBirth || ''} onChange={handleInputChange} />
              </Form.Item>
              <Form.Item label="URL фото">
                <Input type="text" name="photoUrl" value={userProfile.photoUrl || ''} onChange={handleInputChange} placeholder="URL фото" />
              </Form.Item>
              <Button type="primary" onClick={handleSave}>Сохранить</Button>
            </Form>
          ) : (
            <div>
                <Space direction="vertical" size="large">
                    <Descriptions title="Профиль" layout="vertical">
                    <Descriptions.Item label="Имя">{userProfile.name || 'Нет данных'}</Descriptions.Item>
                    <Descriptions.Item label="Фамилия">{userProfile.surname || 'Нет данных'}</Descriptions.Item>
                    <Descriptions.Item label="Отчество">{userProfile.patronymic || 'Нет данных'}</Descriptions.Item>
                    <Descriptions.Item label="Дата рождения">{userProfile.dateOfBirth || 'Нет данных'}</Descriptions.Item>
                    <Descriptions.Item label="Фото">
                        {userProfile.photoUrl ? (
                        <Image src={userProfile.photoUrl} alt="Фото профиля" width={300} height={300} />
                        ) : (
                        'Нет фото'
                        )}
                    </Descriptions.Item>
                    </Descriptions>
                    <Space>
                    <Button type="primary" onClick={() => setEditable(true)}>Редактировать</Button>
                    <Link to="/projects">Мои проекты</Link>
                    </Space>
                </Space>
            </div>
          )}
        </div>
      ) : (
        <h1>Загрузка...</h1>
      )}
    </div>
  );
};

export default ProfilePage;