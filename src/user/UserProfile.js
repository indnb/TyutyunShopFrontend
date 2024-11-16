import React, {useContext, useEffect, useState} from 'react';
import axios from '../axiosConfig';
import './UserProfile.css';
import Logo from './user_logo.png';
import {AuthContext} from '../context/AuthContext';
import OrdersTable from "./OrdersTable";
import OrderDetailsModal from "./OrderDetailsModal";
import {Form} from 'react-bootstrap';

function UserProfile() {
    const { logout } = useContext(AuthContext);
    const [userData, setUserData] = useState({
        id: 0,
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        address: '',
    });
    const [errors, setErrors] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
    });
    const [orders, setOrders] = useState([]);
    const [orderDetails, setOrderDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState(null);


    const fetchUserOrders = async (status = null) => {
        try {
            const response = await axios.get('/orders', {
                params: { status, user_id: userData.id },
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching user orders:', error);
        }
    };
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
                logout();
            }
        }
    };
    const handleStatusChange = (e) => {
        const selectedStatus = e.target.value || null;
        setStatusFilter(selectedStatus);
        fetchUserOrders(selectedStatus);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchUserData();
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [logout]);

    useEffect(() => {
        if (userData.id) {
            fetchUserOrders(statusFilter);
        }
    }, [userData.id, statusFilter]);


    const fetchOrderDetails = (orderId) => {
        axios.get(`/orders/${orderId}/details`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((response) => {
                setOrderDetails(response.data);
                setShowModal(true);
            })
            .catch((error) => console.error('Error fetching order details:', error));
    };
    const validateField = (fieldName, value) => {
        let error = '';
        switch (fieldName) {
            case 'first_name':
            case 'last_name':
                if (!value) {
                    error = 'Це поле є обов’язковим';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    error = 'Некоректний формат email';
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
        setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: error }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
        validateField(name, value);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        Object.keys(userData).forEach((field) => validateField(field, userData[field]));
        if (Object.values(errors).some((error) => error)) {
            console.error('Please correct the errors before saving.');
            return;
        }
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
                        <img src={Logo} alt="User"/>
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
                                    name="first_name"
                                    className="form-control"
                                    value={userData.first_name}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.first_name && <small className="error-text">{errors.first_name}</small>}
                            </div>
                            <div className="form-group">
                                <label>Прізвище</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    className="form-control"
                                    value={userData.last_name}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.last_name && <small className="error-text">{errors.last_name}</small>}
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Пошта</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={userData.email}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.email && <small className="error-text">{errors.email}</small>}
                            </div>
                            <div className="form-group">
                                <label>Телефон</label>
                                <input
                                    type="tel"
                                    name="phone_number"
                                    className="form-control"
                                    value={userData.phone_number}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.phone_number && <small className="error-text">{errors.phone_number}</small>}
                            </div>
                        </div>
                        <div className="section-title">
                            <span>Адреса доставки</span>
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="address"
                                className="form-control"
                                value={userData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </form>
                </div>
            </div>
            <h3 style={{marginTop: 10}}>Мої замовлення</h3>
            <Form.Group controlId="statusFilter" className="mb-3">
                <Form.Label>Фільтр по статусу:</Form.Label>
                <Form.Select value={statusFilter} onChange={handleStatusChange}>
                    <option value="">Всі</option>
                    <option value="pending">В очікуванні</option>
                    <option value="processing">В обробці</option>
                    <option value="completed">Завершено</option>
                </Form.Select>
            </Form.Group>
            <OrdersTable orders={orders} fetchOrderDetails={fetchOrderDetails}/>
            <OrderDetailsModal
                orderDetails={orderDetails}
                showModal={showModal}
                setShowModal={setShowModal}
            />
        </div>

    );
}

export default UserProfile;
