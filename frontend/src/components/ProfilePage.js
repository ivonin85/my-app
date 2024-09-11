import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/api/users/profile', { withCredentials: true })
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error('Ошибка при загрузке профиля', error);
                navigate('/login');
            });
    }, [navigate]);

    return (
        <div>
            {user ? <h1>Welcome, {user.email}</h1> : <h1>Сережа, привет! Это статика ...</h1>}
        </div>
    );
};

export default ProfilePage;
