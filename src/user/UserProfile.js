import React, { useContext, useEffect, useState, useRef } from 'react';
import axios from '../axiosConfig';
import './UserProfile.css';
import '../cart/CartPage.css';
import Logo from './user_logo.png';
import { AuthContext } from '../context/AuthContext';
import OrdersTable from "./OrdersTable";
import OrderDetailsModal from "./OrderDetailsModal";
import { Form } from 'react-bootstrap';
import ChangePasswordModal from "./ChangePasswordModal";
import { validateField } from "../utils/validation";
import { AlertContext } from "../template/Template";
import Cookies from 'js-cookie';

function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

const Dropdown = React.memo(
    ({ options, onSelect, placeholder, value, onSearch, isVisible, onFocus }) => {
        const containerRef = useRef(null);

        useEffect(() => {
            const handleClickOutside = (event) => {
                if (containerRef.current && !containerRef.current.contains(event.target)) {
                    onFocus(false);
                }
            };

            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [onFocus]);

        return (
            <div ref={containerRef} className="dropdown-container">
                <input
                    className={"form-control"}
                    type="text"
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => onSearch(e.target.value)}
                    onFocus={() => onFocus(true)}
                    required
                />
                {isVisible && options.length > 0 && (
                    <ul className="dropdown-list">
                        {options.map((option, index) => (
                            <li
                                key={index}
                                onClick={() => onSelect(option)}
                                className="dropdown-item"
                            >
                                {option.Description}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }
);

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
        city: '',
    });
    const [errors, setErrors] = useState({});
    const [serverMessage, setServerMessage] = useState("");
    const [orders, setOrders] = useState([]);
    const [orderDetails, setOrderDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const [cities, setCities] = useState([]);
    const [isCityDropdownVisible, setIsCityDropdownVisible] = useState(false);

    const debouncedCitySearch = useDebounce(userData.city, 300);

    const [cooldown, setCooldown] = useState(0);
    const [failedAttempts, setFailedAttempts] = useState(0);

    useEffect(() => {
        const savedCooldown = parseInt(Cookies.get('saveCooldown') || '0', 10);
        const savedAttempts = parseInt(Cookies.get('saveFailedAttempts') || '0', 10);

        if (savedCooldown > 0) {
            const remainingTime = Math.max(0, savedCooldown - Math.floor(Date.now() / 1000));
            setCooldown(remainingTime);
        }

        setFailedAttempts(savedAttempts);
    }, []);

    useEffect(() => {
        if (cooldown > 0) {
            Cookies.set('saveCooldown', Math.floor(Date.now() / 1000) + cooldown, { expires: 1 / 48 });
        } else {
            Cookies.remove('saveCooldown');
        }

        Cookies.set('saveFailedAttempts', failedAttempts, { expires: 1 / 48 });
    }, [cooldown, failedAttempts]);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setInterval(() => {
                setCooldown((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [cooldown]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/user/profile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data = response.data;

                let city = '';
                if (data.address) {
                    city = data.address;
                }
                setUserData({
                    ...data,
                    city,
                });
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
                response.data.shipping.address = response.data.shipping.city;
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
        setFailedAttempts((prevFailedAttempts) => {
            const newFailedAttempts = prevFailedAttempts + 1;
            if (newFailedAttempts >= 3) {
                setCooldown(30);
            }
            return newFailedAttempts;
        });
        e.preventDefault();
        setServerMessage('');

        if (cooldown > 0) {
            setServerMessage(`Зачекайте ${cooldown} секунд перед повторною спробою.`);
            return;
        }

        const validationErrors = {};
        Object.keys(userData).forEach((field) => {
            const error = validateField(field, userData[field]);
            if (error) validationErrors[field] = error;
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const updatedUserData = {
            ...userData,
            address: userData.city,
        };

        try {
            await axios.post("/user/update", updatedUserData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            showAlert("Дані збережено!");
        } catch (error) {
            console.error("Error updating profile:", error);
            if (error.response) {
                const { error: serverError, message } = error.response.data;

                const newErrors = {};
                if (serverError === "EmailError") {
                    newErrors.email = "Ця електронна адреса вже використовується.";
                } else if (serverError === "PhoneError") {
                    newErrors.phone_number = "Цей номер телефону вже використовується.";
                } else if (serverError === "UsernameError") {
                    newErrors.username = "Цей логін вже використовується.";
                } else {
                    setServerMessage(message || "Сталася помилка.");
                }
                setErrors(newErrors);


            } else {
                setServerMessage("Сталася помилка. Спробуйте ще раз.");
            }
        }
    };

    const handleLogout = () => {
        logout();
    };

    const handleCitySearch = (query) => {
        setIsCityDropdownVisible(true);
        setUserData((prev) => ({ ...prev, city: query }));
        const error = validateField('city', query);
        setErrors((prevErrors) => ({ ...prevErrors, city: error }));

        if (query.trim() === "") {
            loadDefaultCities();
            return;
        }

        axios
            .post("https://api.novaposhta.ua/v2.0/json/", {
                apiKey: "618b7e802eba725d1094c7c56c13dddc",
                modelName: "Address",
                calledMethod: "getCities",
                methodProperties: { FindByString: query },
            })
            .then((response) => {
                if (response.data.success) {
                    const cities = response.data.data;
                    setCities(cities);

                    const matchedCity = cities.find(
                        (city) => city.Description.toLowerCase() === query.toLowerCase()
                    );

                    if (matchedCity) {
                        handleCitySelect(matchedCity);
                    }
                } else {
                    setCities([]);
                }
            })
            .catch((error) => console.error("Error fetching cities:", error));
    };

    const handleCitySelect = async (city) => {
        setUserData((prev) => ({ ...prev, city: city.Description }));
        setErrors((prevErrors) => ({ ...prevErrors, city: null }));
        setIsCityDropdownVisible(false);
    };

    useEffect(() => {
        if (debouncedCitySearch.trim() === "") {
            loadDefaultCities();
            return;
        }

        axios
            .post("https://api.novaposhta.ua/v2.0/json/", {
                apiKey: "618b7e802eba725d1094c7c56c13dddc",
                modelName: "Address",
                calledMethod: "getCities",
                methodProperties: { FindByString: debouncedCitySearch },
            })
            .then((response) => {
                if (response.data.success) {
                    setCities(response.data.data);
                } else {
                    setCities([]);
                }
            })
            .catch((error) => console.error("Error fetching cities:", error));
    }, [debouncedCitySearch]);

    const mostPopularCities = [
        "Київ",
        "Одеса",
        "Харків",
        "Дніпро",
        "Полтава",
    ];

    const loadDefaultCities = () => {
        axios
            .post(
                "https://api.novaposhta.ua/v2.0/json/",
                {
                    apiKey: "618b7e802eba725d1094c7c56c13dddc",
                    modelName: "Address",
                    calledMethod: "getCities",
                    methodProperties: { FindByString: "" },
                }
            )
            .then((response) => {
                if (response.data.success) {
                    const filteredCities = response.data.data.filter((city) =>
                        mostPopularCities.includes(city.Description)
                    );
                    setCities(filteredCities);
                } else {
                    setCities([]);
                }
            })
            .catch((error) => console.error("Error fetching full city list:", error));
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
                        <button
                            type="button"
                            className="btn save-button"
                            onClick={() => setShowPasswordModal(true)}
                        >
                            Змінити пароль
                        </button>
                        <button
                            type="submit"
                            className="btn save-button"
                            onClick={handleSave}
                            disabled={cooldown > 0}
                        >
                            {cooldown > 0 ? `Зачекайте ${cooldown} с` : 'Зберегти'}
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
                            {serverMessage && <p className="server-message error" style={{marginBottom: -1, marginTop: 4}}>{serverMessage}</p>}
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
                                {errors.first_name &&
                                    <small className="server-message error error-text-margin-minus">{errors.first_name}</small>}
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
                                {errors.last_name && <small className="server-message error error-text-margin-minus">{errors.last_name}</small>}
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
                                {errors.username && <small className="server-message error error-text-margin-minus">{errors.username}</small>}
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
                                {errors.phone_number &&
                                    <small className="server-message error error-text-margin-minus">{errors.phone_number}</small>}
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Місто</label>
                                <Dropdown
                                    options={cities}
                                    onSelect={handleCitySelect}
                                    placeholder="Введіть ваше місто"
                                    value={userData.city}
                                    onSearch={handleCitySearch}
                                    isVisible={isCityDropdownVisible}
                                    onFocus={setIsCityDropdownVisible}
                                />
                                {errors.city && <small className="server-message error error-text-margin-minus">{errors.city}</small>}
                            </div>
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
                                {errors.email && <small className="server-message error error-text-margin-minus">{errors.email}</small>}
                            </div>
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
            <ChangePasswordModal
                showModal={showPasswordModal}
                setShowModal={setShowPasswordModal}
            />
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
