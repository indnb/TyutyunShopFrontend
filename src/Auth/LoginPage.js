import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { useHistory } from 'react-router-dom';
import './Auth.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/user/login', { email, password });
            const { token } = response.data;
            localStorage.setItem('token', token);
            history.push('/user/profile');
        } catch (error) {
            console.error('Error login user', error);
            alert('Помилка при вході. Будь ластка, перевірте свої дані.');
        }
    };

    return (
        <div className="auth-container margin-top margin-bottom">
            <h2>Вхід</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Пароль:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Увійти</button>
            </form>
        </div>
    );
}

export default LoginPage;
