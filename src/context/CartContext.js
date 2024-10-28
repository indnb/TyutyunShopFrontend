// context/CartContext.js

import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    const addItem = item => {
        // Уникальный ключ для товара, основанный на id и размере (или категории, если необходимо)
        const uniqueKey = `${item.id}-${item.size || ''}-${item.category || ''}`;

        const existingItem = cartItems.find(ci => ci.uniqueKey === uniqueKey);

        if (existingItem) {
            // Увеличиваем количество, если товар уже существует
            setCartItems(
                cartItems.map(ci =>
                    ci.uniqueKey === uniqueKey ? { ...ci, quantity: ci.quantity + item.quantity } : ci
                )
            );
        } else {
            // Добавляем новый товар с уникальным ключом
            setCartItems([...cartItems, { ...item, quantity: item.quantity, uniqueKey }]);
        }
    };

    const removeItem = item => {
        const uniqueKey = `${item.id}-${item.size || ''}-${item.category || ''}`;
        const existingItem = cartItems.find(ci => ci.uniqueKey === uniqueKey);

        if (existingItem.quantity > 1) {
            setCartItems(
                cartItems.map(ci =>
                    ci.uniqueKey === uniqueKey ? { ...ci, quantity: ci.quantity - 1 } : ci
                )
            );
        } else {
            // Удаляем товар, если его количество стало равно 0
            setCartItems(cartItems.filter(ci => ci.uniqueKey !== uniqueKey));
        }
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addItem, removeItem, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}
