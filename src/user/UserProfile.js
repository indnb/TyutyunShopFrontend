// user/UserProfile.js

import React, { useState, useEffect } from 'react';
import './UserProfile.css';

function UserProfile() {
    const [userData, setUserData] = useState({
        name: '',
        surname: '',
        email: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        // Получить данные пользователя из API или контекста
        // setUserData({...});
    }, []);

    const handleSave = () => {
        // Логика сохранения данных
    };

    return (
        <div className="user-profile">
            <h1>Персональний кабінет</h1>
            <form onSubmit={handleSave}>
                <div>
                    <label>Ім'я</label>
                    <input
                        type="text"
                        value={userData.name}
                        onChange={e => setUserData({ ...userData, name: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Прізвище</label>
                    <input
                        type="text"
                        value={userData.surname}
                        onChange={e => setUserData({ ...userData, surname: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" value={userData.email} disabled />
                </div>
                <div>
                    <label>Телефон</label>
                    <input
                        type="tel"
                        value={userData.phone}
                        onChange={e => setUserData({ ...userData, phone: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Адреса доставки</label>
                    <input
                        type="text"
                        value={userData.address}
                        onChange={e => setUserData({ ...userData, address: e.target.value })}
                        required
                    />
                </div>
                <button type="submit">Зберегти</button>
                <button type="button">Відмінити</button>
            </form>
        </div>
    );
}

export default UserProfile;
