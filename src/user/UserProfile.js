import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import './UserProfile.css';
import { useHistory } from 'react-router-dom';


function UserProfile() {
    const history = useHistory();
    const [userData, setUserData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        address: '',
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/user/profile');
                setUserData(response.data);
            } catch (error) {
                console.error('Ошибка при получении данных пользователя', error);
                if (error.response && error.response.status === 401) {
                    history.push('/login');
                }
            }
        };
        fetchUserData();
    }, [history]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await axios.put('/user/profile', userData);
            alert('Дані успішно збережено!');
        } catch (error) {
            console.error('Ошибка при сохранении данных пользователя', error);
            alert('Ошибка при сохранении данных. Пожалуйста, попробуйте еще раз.');
        }
    };

    const handleCancel = () => {
        history.go(0);
    };

    return (
        <div className="user-profile container mt-5 py-4 px-xl-5">
            <h1 className="text-center mb-4">Персональний кабінет</h1>
            <form onSubmit={handleSave}>
                <div className="form-group mb-3">
                    <label>Ім'я</label>
                    <input
                        type="text"
                        className="form-control"
                        value={userData.first_name}
                        onChange={e => setUserData({ ...userData, first_name: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Прізвище</label>
                    <input
                        type="text"
                        className="form-control"
                        value={userData.last_name}
                        onChange={e => setUserData({ ...userData, last_name: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={userData.email}
                        disabled
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Телефон</label>
                    <input
                        type="tel"
                        className="form-control"
                        value={userData.phone_number}
                        onChange={e => setUserData({ ...userData, phone_number: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Адреса доставки</label>
                    <input
                        type="text"
                        className="form-control"
                        value={userData.address}
                        onChange={e => setUserData({ ...userData, address: e.target.value })}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary me-2">Зберегти</button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>Відмінити</button>
            </form>
        </div>
    );

}

export default UserProfile;
