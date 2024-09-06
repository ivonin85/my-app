import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const [user, setUser] = useState(null);  // Состояние для пользователя
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Если токена нет, перенаправляем на страницу логина
            navigate('/login');
        } else {
            // Запрашиваем данные пользователя с использованием токена
            axios.get('http://localhost:8080/api/auth/profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                setUser(response.data);  // Устанавливаем данные пользователя
            })
            .catch(error => {
                console.error('Ошибка при загрузке профиля', error);
                navigate('/login');  // Если ошибка, перенаправляем на страницу логина
            });
        }
    }, [navigate]);

    return (
        <div>
            {user ? <h1>Welcome, {user.email}</h1> : <h1>Сережа, привет! Это статика ... </h1>}
        </div>
    );
};

export default ProfilePage;
