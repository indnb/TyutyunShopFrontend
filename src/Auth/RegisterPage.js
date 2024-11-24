import React, { useState, useEffect } from "react";
import axios from '../axiosConfig';
import "./Auth.css";
import { validateField } from "../utils/validation";
import Cookies from 'js-cookie';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        address: "",
    });
    const [errors, setErrors] = useState({});
    const [serverMessage, setServerMessage] = useState("");
    const [timer, setTimer] = useState(0);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    useEffect(() => {
        const savedCooldown = parseInt(Cookies.get('registerCooldown') || '0', 10);
        if (savedCooldown > 0) {
            const remainingTime = Math.max(0, savedCooldown - Math.floor(Date.now() / 1000));
            setTimer(remainingTime);
            if (remainingTime > 0) {
                setIsButtonDisabled(true);
            }
        }
    }, []);

    useEffect(() => {
        if (timer > 0) {
            Cookies.set('registerCooldown', Math.floor(Date.now() / 1000) + timer, { expires: 1 / 48 });
        } else {
            Cookies.remove('registerCooldown');
        }
    }, [timer]);

    useEffect(() => {
        if (isButtonDisabled && timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setIsButtonDisabled(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isButtonDisabled, timer]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        const error = validateField(name, value, formData);
        if (!error) {
            setErrors((prevErrors) => {
                const { [name]: removedError, ...restErrors } = prevErrors;
                return restErrors;
            });
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
        }

        setFormData({ ...formData, [name]: value });
        setServerMessage("");
    };


    const startCooldown = () => {
        setTimer(30);
        setIsButtonDisabled(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerMessage("");

        const validationErrors = {};
        Object.keys(formData).forEach((field) => {
            const error = validateField(field, formData[field]);
            if (error) validationErrors[field] = error;
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            startCooldown();
            await axios.post(`/user/try_registration`, formData);
            setServerMessage("Реєстрація успішна. Перевірте вашу пошту для підтвердження.");
            setFormData({
                username: "",
                email: "",
                password: "",
                first_name: "",
                last_name: "",
                phone_number: "",
                address: "",
            });
            setErrors({});
        } catch (error) {
            if (error.response) {
                const { message } = error.response.data;
                setServerMessage(message || "Сталася помилка. Будь ласка, спробуйте ще раз.");
            } else {
                setServerMessage("Сталася помилка. Будь ласка, спробуйте ще раз.");
            }
        }
    };

    return (
        <div className="auth-container margin-top">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Реєстрація</h2>
                <div className="form-group">
                    <label htmlFor="username">Логін</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    {errors.username && <small className="server-message error">{errors.username}</small>}
                </div>
                <div className="form-group">
                    <label htmlFor="email">Електронна адреса</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <small className="server-message error">{errors.email}</small>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Пароль</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors.password && <small className="server-message error">{errors.password}</small>}
                </div>
                <div className="form-group">
                    <label htmlFor="first_name">Ім'я</label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                    />
                    {errors.first_name && <small className="server-message error">{errors.first_name}</small>}
                </div>
                <div className="form-group">
                    <label htmlFor="last_name">Прізвище</label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                    />
                    {errors.last_name && <small className="server-message error">{errors.last_name}</small>}
                </div>
                <div className="form-group">
                    <label htmlFor="phone_number">Телефон</label>
                    <input
                        type="text"
                        id="phone_number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                    />
                    {errors.phone_number && <small className="server-message error">{errors.phone_number}</small>}
                </div>
                <button className="mt-4" type="submit" disabled={isButtonDisabled}>
                    {isButtonDisabled ? `Повторна спроба через ${timer} с` : "Зареєструватись"}
                </button>
                {serverMessage && <p className={`server-message ${(errors.username || errors.email || errors.phone_number) ? 'error' : 'success'}`}>{serverMessage}</p>}
            </form>
        </div>
    );
};

export default RegisterPage;
