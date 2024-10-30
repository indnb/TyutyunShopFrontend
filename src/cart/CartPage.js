import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import axios from '../axiosConfig';
import './CartPage.css';

function CartPage() {
    const { cartItems, addItem, removeItem, clearCart } = useContext(CartContext);
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
            console.error('Error ', error);
            alert('Помилка при оформленні замовлення');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingData({
            ...shippingData,
            [name]: value,
        });
    };

    const handleCancelPurchase = () => {
        setShippingData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
        });
    };

    return (
        <div className="cart-page" style={{
            marginTop: '56px',
        }}>
            <h1>Кошик</h1>
            {cartItems.length > 0 ? (<button className="clear-cart-button" onClick={clearCart}>
                Очистити кошик
            </button>) : <></>}
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
                        {cartItems.map(item => (
                            <tr key={`${item.id}-${item.size}-${item.name}`}>
                                <td>{item.name}</td>
                                <td>{item.size || 'N/A'}</td>
                                <td>{item.quantity}</td>
                                <td>{item.price} грн</td>
                                <td>
                                    <button onClick={() => addItem({ ...item, quantity: 1 })}>+</button>
                                    <button onClick={() => removeItem({ ...item, quantity: 1 })}>-</button>
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
                                <input type="text" name="firstName" value={shippingData.firstName}
                                       onChange={handleInputChange} required/>
                            </div>
                            <div>
                                <label>Прізвище</label>
                                <input type="text" name="lastName" value={shippingData.lastName}
                                       onChange={handleInputChange} required/>
                            </div>
                            <div>
                                <label>Email</label>
                                <input type="email" name="email" value={shippingData.email} onChange={handleInputChange}
                                       required/>
                            </div>
                            <div>
                                <label>Телефон</label>
                                <input type="tel" name="phone" value={shippingData.phone} onChange={handleInputChange}
                                       required/>
                            </div>
                            <div>
                                <label>Адреса доставки</label>
                                <input type="text" name="address" value={shippingData.address}
                                       onChange={handleInputChange} required/>
                            </div>
                            <div className="button-group">
                                <button type="button" onClick={handleCancelPurchase}>Відмінити</button>
                                <button type="submit">Підтвердити купівлю</button>
                            </div>

                        </form>
                    </div>
                </>
            ) : (
                <h4>Ваш кошик порожній</h4>
            )}
        </div>
    );
}

export default CartPage;
