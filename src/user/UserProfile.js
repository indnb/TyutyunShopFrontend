import React, { useContext, useEffect, useState } from 'react';
import axios from '../axiosConfig';
import './UserProfile.css';
import Logo from './user_logo.png';
import { AuthContext } from '../context/AuthContext';
import OrdersTable from "./OrdersTable";
import OrderDetailsModal from "./OrderDetailsModal";
import { Form } from 'react-bootstrap';
import ChangePasswordModal from "./ChangePasswordModal";
import { validateField } from "../utils/validation";
import { AlertContext } from "../template/Template";

function UserProfile() {
    const { logout } = useContext(AuthContext);
    const { showAlert } = useContext(AlertContext);

    const [userData, setUserData] = useState({
        id: 0,
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        address: '',
    });
    const [errors, setErrors] = useState({});
    const [orders, setOrders] = useState([]);
    const [orderDetails, setOrderDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

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
                    logout();
                }
            }
        };
        fetchUserData();
    }, [logout]);

    useEffect(() => {
        if (userData.id) {
            fetchUserOrders(statusFilter);
        }
    }, [userData.id, statusFilter]);

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

    const handleStatusChange = (e) => {
        const selectedStatus = e.target.value || null;
        setStatusFilter(selectedStatus);
        fetchUserOrders(selectedStatus);
    };

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setUserData({ ...userData, [name]: value });
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const validationErrors = {};
        Object.keys(userData).forEach((field) => {
            const error = validateField(field, userData[field]);
            if (error) validationErrors[field] = error;
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await axios.post("/user/update", userData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            showAlert("Дані збережено!");
        } catch (error) {
            console.error("Error updating profile:", error);
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
                        <button
                            type="button"
                            className="btn save-button"
                            onClick={() => setShowPasswordModal(true)}
                        >
                            Змінити пароль
                        </button>
                        <button type="submit" className="btn save-button" onClick={handleSave}>
                            Зберегти
                        </button>
                        <button type="button" className="btn logout-button" onClick={handleLogout}>
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
                                <label>Логін</label>
                                <input
                                    type="text"
                                    name="username"
                                    className="form-control"
                                    value={userData.username}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.username && <small className="error-text">{errors.username}</small>}
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
            <h3 style={{ marginTop: 10 }}>Мої замовлення</h3>
            <Form.Group controlId="statusFilter" className="mb-3">
                <Form.Label>Фільтр по статусу:</Form.Label>
                <Form.Select value={statusFilter} onChange={handleStatusChange}>
                    <option value="">Всі</option>
                    <option value="pending">В очікуванні</option>
                    <option value="processing">В обробці</option>
                    <option value="completed">Завершено</option>
                </Form.Select>
            </Form.Group>
            <ChangePasswordModal
                showModal={showPasswordModal}
                setShowModal={setShowPasswordModal}
            />
            <OrdersTable orders={orders} fetchOrderDetails={fetchOrderDetails} />
            <OrderDetailsModal
                orderDetails={orderDetails}
                showModal={showModal}
                setShowModal={setShowModal}
            />
        </div>
    );
}

export default UserProfile;
