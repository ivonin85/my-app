import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [editable, setEditable] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/api/users/profile', { withCredentials: true })
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
        axios.put('http://localhost:8080/api/users/profile', userProfile, { withCredentials: true })
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
            {userProfile ? (
                <div>
                    <h1>Добро пожаловать, {userProfile.firstName || 'Нет имени'} {userProfile.lastName || 'Нет фамилии'}</h1>
                    {editable ? (
                        <div>
                            <input
                                type="text"
                                name="firstName"
                                value={userProfile.firstName || ''}
                                onChange={handleInputChange}
                                placeholder="Имя"
                            />
                            <input
                                type="text"
                                name="lastName"
                                value={userProfile.lastName || ''}
                                onChange={handleInputChange}
                                placeholder="Фамилия"
                            />
                            <input
                                type="text"
                                name="middleName"
                                value={userProfile.middleName || ''}
                                onChange={handleInputChange}
                                placeholder="Отчество"
                            />
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={userProfile.dateOfBirth || ''}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="photoUrl"
                                value={userProfile.photoUrl || ''}
                                onChange={handleInputChange}
                                placeholder="URL фото"
                            />
                            <button onClick={handleSave}>Сохранить</button>
                        </div>
                    ) : (
                        <div>
                            <p><strong>Имя:</strong> {userProfile.firstName || 'Нет данных'}</p>
                            <p><strong>Фамилия:</strong> {userProfile.lastName || 'Нет данных'}</p>
                            <p><strong>Отчество:</strong> {userProfile.middleName || 'Нет данных'}</p>
                            <p><strong>Дата рождения:</strong> {userProfile.dateOfBirth || 'Нет данных'}</p>
                            <p><strong>Фото:</strong> {userProfile.photoUrl ? <img src={userProfile.photoUrl} alt="Фото профиля" width="235" height="300"/> : 'Нет фото'}</p>
                            <button onClick={() => setEditable(true)}>Редактировать</button>
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
