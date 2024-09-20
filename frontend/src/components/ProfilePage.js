import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

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
                    <h1>Добро пожаловать, {userProfile.name || 'Нет имени'} {userProfile.surname || 'Нет фамилии'}</h1>
                    {editable ? (
                        <div>
                            <input
                                type="text"
                                name="name"
                                value={userProfile.name || ''}
                                onChange={handleInputChange}
                                placeholder="Имя"
                            />
                            <input
                                type="text"
                                name="surname"
                                value={userProfile.surname || ''}
                                onChange={handleInputChange}
                                placeholder="Фамилия"
                            />
                            <input
                                type="text"
                                name="patronymic"
                                value={userProfile.patronymic || ''}
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
                            <p><strong>Имя:</strong> {userProfile.name || 'Нет данных'}</p>
                            <p><strong>Фамилия:</strong> {userProfile.surname || 'Нет данных'}</p>
                            <p><strong>Отчество:</strong> {userProfile.patronymic || 'Нет данных'}</p>
                            <p><strong>Дата рождения:</strong> {userProfile.dateOfBirth || 'Нет данных'}</p>
                            <p><strong>Фото:</strong> {userProfile.photoUrl ? <img src={userProfile.photoUrl} alt="Фото профиля" width="300" height="300"/> : 'Нет фото'}</p>
                            <button onClick={() => setEditable(true)}>Редактировать</button>
                            <Link to="/projects">Мои проекты</Link>
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
