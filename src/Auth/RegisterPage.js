// src/Auth/RegisterPage.js

import React, { useState } from 'react';
import axios from '../axiosConfig';
import { useHistory } from 'react-router-dom';
import './Auth.css';

function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        address: '',
    });
    const history = useHistory();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/user/registration', formData);
//.            alert('Реєстрація успішна! Тепер ви можете увійти.');
            history.push('/login');
        } catch (error) {
            console.error('Error registration', error);
            alert('Помилка при реєстрації. Будь ласка, перевірте введені дані.');
        }
    };

    return (
        <div className="auth-container margin-top margin-bottom">
            <h2>Реєстрація</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Логін:
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Пароль:
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Ім'я:
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Прізвище:
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Номер телефону:
                    <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Адреса:
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </label>
                <button type="submit">Зареєструватися</button>
            </form>
        </div>
    );
}

export default RegisterPage;
