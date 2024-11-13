import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import axios from '../axiosConfig';
import './CartPage.css';
import ToggleSwitch from "./ToggleSwitch";

function CartPage() {
    const { cartItems, addOneItem, removeOneItem, removeItem, clearCart } = useContext(CartContext);
    const [shippingData, setShippingData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
    });
    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentType, setPaymentType] = useState("Оплата картою");

    const totalCost = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'firstName':
            case 'lastName':
                if (!value) error = 'Це поле є обов’язковим';
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) error = 'Некоректний формат email';
                break;
            case 'phone':
                const phoneRegex = /^\+?\d{10,13}$/;
                if (!phoneRegex.test(value)) error = 'Некоректний номер телефону';
                break;
            case 'address':
                if (!value) error = 'Це поле є обов’язковим';
                break;
            default:
                break;
        }
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingData({ ...shippingData, [name]: value });
        validateField(name, value);
    };


    const handlePaymentToggle = (isChecked) => {
        setPaymentType(isChecked ? "Наложний платіж" : "Оплата картою");
    };
    const handlePurchase = async (e) => {
        e.preventDefault();
        Object.keys(shippingData).forEach((field) => validateField(field, shippingData[field]));
        if (Object.values(errors).some((error) => error)) {
            console.error('Please correct the errors before submitting.');
            return;
        }

        setIsProcessing(true);
        try {
            const orderData = {
                items: cartItems,
                shippingData,
                totalCost,
                paymentType,
            };

            const response = await axios.post('/order', orderData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            if (response.data && response.data.paymentUrl) {
                window.location.href = response.data.paymentUrl;
            } else {
                alert('Помилка при створенні посилання для оплати');
            }
        } catch (error) {
            console.error('Error placing new order', error);
            alert('Помилка при оформленні замовлення. Спробуйте ще раз.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="cart-page" style={{ marginTop: '56px' }}>
            <h1>Кошик</h1>
            {cartItems.length > 0 ? (
                <button className="clear-cart-button" onClick={clearCart}>
                    Очистити кошик
                </button>
            ) : null}
            {cartItems.length > 0 ? (
                <>
                    <table className="cart-table">
                        <thead>
                        <tr>
                            <th>Назва</th>
                            <th>Розмір</th>
                            <th>Кількість</th>
                            <th>Ціна за одиницю</th>
                            <th>Дії</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cartItems.map((item) => (
                            <tr key={`${item.id}-${item.size}-${item.name}`}>
                                <td>{item.name}</td>
                                <td>{item.size}</td>
                                <td>
                                    <div className="quantity-controls">
                                        <button
                                            className="quantity-button"
                                            onClick={() => removeOneItem(item)}
                                        >
                                            -
                                        </button>
                                        <span className="quantity">{item.quantity}</span>
                                        <button
                                            className="quantity-button"
                                            onClick={() => addOneItem(item)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>
                                <td>{item.price} грн</td>
                                <td>
                                    <button
                                        className="quantity-button-del"
                                        onClick={() => removeItem(item)}
                                    >
                                        Видалити
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <h3>Загальна вартість: {totalCost} грн</h3>

                    <div className="purchase-block">
                        <h2>Дані для відправки</h2>
                        <form onSubmit={handlePurchase}>
                            <div>
                                <label>Ім'я</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={shippingData.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.firstName && <small className="error-text">{errors.firstName}</small>}
                            </div>
                            <div>
                                <label>Прізвище</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={shippingData.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.lastName && <small className="error-text">{errors.lastName}</small>}
                            </div>
                            <div>
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={shippingData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.email && <small className="error-text">{errors.email}</small>}
                            </div>
                            <div>
                                <label>Телефон</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={shippingData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.phone && <small className="error-text">{errors.phone}</small>}
                            </div>
                            <div>
                                <label>Адреса доставки</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={shippingData.address}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.address && <small className="error-text">{errors.address}</small>}
                            </div>

                            <div className="payment-method mt-4">
                                <h3>Вибір способу оплати</h3>
                                <div>
                                    <ToggleSwitch
                                        label={paymentType}
                                        onChange={handlePaymentToggle}
                                    />
                                </div>
                            </div>

                            <button className="w-100 mt-4" type="submit" disabled={isProcessing}>
                                {isProcessing ? 'Обробка...' : 'Підтвердити купівлю'}
                            </button>
                        </form>
                    </div>
                </>
            ) : (
                <h2 className="text-center">порожній (</h2>
            )}
        </div>
    );
}

export default CartPage;
