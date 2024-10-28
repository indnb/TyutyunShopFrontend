// cart/CartPage.js

import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import './CartPage.css';

function CartPage() {
    const { cartItems, addItem, removeItem, clearCart } = useContext(CartContext);

    const totalCost = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handlePurchase = () => {
        // Логика оформления покупки
    };

    return (
        <div className="cart-page">
            <h1>Кошик</h1>
            <button className="clear-cart-button" onClick={clearCart}>
                Очистити кошик
            </button>
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
                    <tr key={item.uniqueKey}>
                        <td>{item.name}</td>
                        <td>{item.size || 'N/A'}</td>
                        <td>{item.quantity}</td>
                        <td>{item.price} грн</td>
                        <td>
                            <button onClick={() => addItem(item)}>+</button>
                            <button onClick={() => removeItem(item)}>-</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <h3>Загальна вартість: {totalCost} грн</h3>

            {/* Блок покупки */}
            <div className="purchase-block">
                <h2>Дані для відправки</h2>
                <form onSubmit={handlePurchase}>
                    <div>
                        <label>Ім'я</label>
                        <input type="text" name="firstName" required />
                    </div>
                    <div>
                        <label>Прізвище</label>
                        <input type="text" name="lastName" required />
                    </div>
                    <div>
                        <label>Email</label>
                        <input type="email" name="email" required />
                    </div>
                    <div>
                        <label>Телефон</label>
                        <input type="tel" name="phone" required />
                    </div>
                    <div>
                        <label>Адреса доставки</label>
                        <input type="text" name="address" required />
                    </div>
                    <button type="submit">Підтвердити купівлю</button>
                    <button type="button" onClick={() => { /* Логика отмены покупки */ }}>
                        Відмінити
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CartPage;
