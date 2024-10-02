import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const VerificationPage = () => {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const handleVerification = async () => {
        try {
            await axios.get(`http://localhost:8080/api/auth/verify?token=${token}`);
            setMessage("Ваш email успешно подтвержден!");
            setTimeout(() => navigate('/login'), 2000); // Перенаправление на страницу логина через 2 секунды
        } catch (error) {
            setError("Ошибка подтверждения. Возможно, токен неверен или истек.");
        }
    };

    return (
        <div>
            <h2>Подтверждение Email</h2>
            <button onClick={handleVerification}>Подтвердить Email</button>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default VerificationPage;
