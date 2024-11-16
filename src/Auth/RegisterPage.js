import React, {useState} from 'react';
import axios from '../axiosConfig';
import {useHistory} from 'react-router-dom';
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
    const [errors, setErrors] = useState({});
    const history = useHistory();

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'username':
                if (!value) {
                    error = 'Логін є обов’язковим';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    error = 'Некоректний формат email';
                }
                break;
            case 'password':
                if (value.length < 6) {
                    error = 'Пароль має містити щонайменше 6 символів';
                }
                break;
            case 'phone_number':
                const phoneRegex = /^\+?\d{10,13}$/;
                if (!phoneRegex.test(value)) {
                    error = 'Некоректний номер телефону';
                }
                break;
            default:
                break;
        }
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate all fields before submitting
        Object.keys(formData).forEach((field) => validateField(field, formData[field]));
        if (Object.values(errors).some((error) => error)) {
            console.error('Please correct the errors before submitting.');
            return;
        }
        try {
            await axios.post('/user/registration', formData);
            alert('Реєстрація успішна! Тепер ви можете увійти.');
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
                    {errors.username && <small className="error-text">{errors.username}</small>}
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
                    {errors.email && <small className="error-text">{errors.email}</small>}
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
                    {errors.password && <small className="error-text">{errors.password}</small>}
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
                    {errors.phone_number && <small className="error-text">{errors.phone_number}</small>}
                </label>
                <button type="submit">Зареєструватися</button>
            </form>
        </div>
    );
}

export default RegisterPage;
