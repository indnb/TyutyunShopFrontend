import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import './UserProfile.css';
import { useHistory } from 'react-router-dom';

function UserProfile() {
    const history = useHistory();
    const [userData, setUserData] = useState({
        username:'',
        first_name:'',
        last_name: '',
        email:'',
        phone_number: '123',
        address: '',
        password:'123123'
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/user/profile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
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
        console.log("Data to be sent:", userData); // Log data to check structure
        try {
            const response = await axios.post('/user/update', {
                "username":"loler222",
                "first_name": "lol",
                "last_name": "UpdatedLa11st21Name",
                "email":"loler@gmai21133l.com",
                "phone_number": "+12311451167890",
                "address": "123 Upd123123ated Address St.",
                "password":"123123"
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('Дані успішно збережено!');
        } catch (error) {
            console.error('Ошибка при сохранении данных пользователя', error);
            alert('Ошибка при сохранении данных. Пожалуйста, попробуйте еще раз.');
        }
    };


    const handleCancel = () => {
        history.go(0); // Refresh the page to reset form data
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
