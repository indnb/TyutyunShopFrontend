import React, { useState, useEffect } from "react";
import axios from '../axiosConfig';
import "./Auth.css";
import {validateField} from "../utils/validation";

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validateField(name, value);
        setServerMessage("");
    };

    const startCooldown = () => {
        setTimer(30);
        setIsButtonDisabled(true);
    };

    useEffect(() => {
        if (isButtonDisabled) {
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
    }, [isButtonDisabled]);

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
            await axios.post(
                `/user/try_registration`,
                formData,
            );
            setServerMessage("Реєстрація успішна. Перевірте вашу пошту для підтвердження.");
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setServerMessage("Ця електронна адреса вже зареєстрована.");
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
                    {errors.username && <small className="error-text">{errors.username}</small>}
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
                    {errors.email && <small className="error-text">{errors.email}</small>}
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
                    {errors.password && <small className="error-text">{errors.password}</small>}
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
                    {errors.first_name && <small className="error-text">{errors.first_name}</small>}
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
                    {errors.last_name && <small className="error-text">{errors.last_name}</small>}
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
                    {errors.phone_number && <small className="error-text">{errors.phone_number}</small>}
                </div>
                <button type="submit" disabled={isButtonDisabled}>
                    {isButtonDisabled ? `Повторна спроба через ${timer} с` : "Зареєструватись"}
                </button>
                {serverMessage && <p className="server-message">{serverMessage}</p>}
            </form>
        </div>
    );
};

export default RegisterPage;
