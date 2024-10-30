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
                console.error('Error get product`s category', error);
            }
        };
        fetchCartItems();
    }, []);

    const addItem = async (item) => {
        try {
            await axios.post('/cart', item, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setCartItems((prevItems) => [...prevItems, item]);
        } catch (error) {
            console.error('Error to add basket', error);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, addItem }}>
            {children}
        </CartContext.Provider>
    );
}
