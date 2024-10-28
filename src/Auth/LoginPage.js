import React, { useState } from 'react';
import './Auth.css';

function LoginPage() {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Логіка відправки даних на сервер
    };

    return (
        <div className="auth-container margin-top margin-bottom">
            <h2>Вхід</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Логін або Email:
                    <input
                        type="text"
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
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
