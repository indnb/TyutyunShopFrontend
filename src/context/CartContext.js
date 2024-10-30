import React, { createContext, useState, useEffect } from 'react';
import axios from '../axiosConfig';

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get('/cart', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setCartItems(response.data);
            } catch (error) {
                console.error('Error getting cart items', error);
                setCartItems([]);
            }
        };
        fetchCartItems();
    }, []);

    const addItem = async (item) => {
        setCartItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex(
                (cartItem) =>
                    cartItem.id === item.id &&
                    cartItem.size === item.size &&
                    cartItem.name === item.name
            );
            if (existingItemIndex >= 0) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += item.quantity;
                return updatedItems;
            } else {
                return [...prevItems, item];
            }
        });

        try {
            await axios.post('/cart', item, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
        } catch (error) {
            console.error('Error adding to cart', error);
        }
    };

    const removeItem = async (item) => {
        setCartItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex(
                (cartItem) =>
                    cartItem.id === item.id &&
                    cartItem.size === item.size &&
                    cartItem.name === item.name
            );
            if (existingItemIndex >= 0) {
                const updatedItems = [...prevItems];
                if (updatedItems[existingItemIndex].quantity > 1) {
                    updatedItems[existingItemIndex].quantity -= item.quantity;
                } else {
                    updatedItems.splice(existingItemIndex, 1);
                }
                return updatedItems;
            }
            return prevItems;
        });

        try {
            await axios.delete('/cart', {
                data: item,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
        } catch (error) {
            console.error('Error removing from cart', error);
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
