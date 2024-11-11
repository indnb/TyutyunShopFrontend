import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import axios from '../axiosConfig';
import './CartPage.css';

function CartPage() {
    const { cartItems, addOneItem, removeOneItem, removeItem, clearCart } = useContext(CartContext);
    const [shippingData, setShippingData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
    });

    const totalCost = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handlePurchase = async (e) => {
        e.preventDefault();
        try {
            const orderData = {
                items: cartItems,
                shippingData,
                totalCost,
            };
            await axios.post('/order', orderData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            alert('Замовлення успішно оформлено!');
            clearCart();
            setShippingData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                address: '',
            });
        } catch (error) {
            console.error('Error placing new order', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingData({
            ...shippingData,
            [name]: value,
        });
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
                                            onClick={(e) => {
                                                removeOneItem(item);
                                            }}
                                        >
                                            -
                                        </button>
                                        <span className="quantity">{item.quantity}</span>
                                        <button
                                            className="quantity-button"
                                            onClick={(e) => {
                                                addOneItem(item);
                                            }}
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
                            </div>
                            <button className="w-100" type="submit">
                                Підтвердити купівлю
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
