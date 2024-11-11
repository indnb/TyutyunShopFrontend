import React, { useState, useEffect, useContext } from 'react';
import axios from '../axiosConfig';
import './UserProfile.css';
import { useHistory } from 'react-router-dom';
import Logo from './user_logo.png';
import { AuthContext } from '../context/AuthContext';

function UserProfile() {
    const { logout } = useContext(AuthContext);
    const [userData, setUserData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        address: '',
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
                console.error('Error fetching profile info:', error);
                if (error.response && error.response.status === 401) {
                    logout(); // Use the context logout function if token is invalid
                }
            }
        };
        fetchUserData();
    }, [logout]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/user/update', userData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log('Profile data saved successfully!');
        } catch (error) {
            console.error('Error updating profile', error);
        }
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="user-profile container mt-5 py-4 px-xl-5">
            <h2 className="label-profile">Мій акаунт</h2>
            <div className="profile-content">
                <div className="profile-header">
                    <div className="user-image">
                        <img src={Logo} alt="User" />
                    </div>
                    <div className="form-buttons">
                        <button type="submit" className="btn btn-secondary save-button" onClick={handleSave}>
                            Зберегти
                        </button>
                        <button type="button" className="btn btn-dark logout-button" onClick={handleLogout}>
                            Вийти з акаунту
                        </button>
                    </div>
                </div>
                <div className="profile-sections">
                    <form onSubmit={handleSave} className="profile-form">
                        <div className="section-title">
                            <span>Особисті дані</span>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Ім'я</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={userData.first_name}
                                    onChange={(e) => setUserData({ ...userData, first_name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Прізвище</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={userData.last_name}
                                    onChange={(e) => setUserData({ ...userData, last_name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={userData.email}
                                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Телефон</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    value={userData.phone_number}
                                    onChange={(e) => setUserData({ ...userData, phone_number: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="section-title">
                            <span>Адреса доставки</span>
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                value={userData.address}
                                onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                                required
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
