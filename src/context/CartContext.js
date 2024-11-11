import React, { createContext, useState, useEffect } from 'react';
import axios from '../axiosConfig';

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        const fetchCartItems = async () => {
            if (!localStorage.getItem('cartItems')) {
                try {
                    const response = await axios.get('/cart', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    });
                    setCartItems(response.data);
                    localStorage.setItem('cartItems', JSON.stringify(response.data));
                } catch (error) {
                    console.error('Error getting cart items', error);
                    setCartItems([]);
                }
            }
        };
        fetchCartItems();
    }, []);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addItem = (item) => {
        setCartItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex(
                (cartItem) =>
                    cartItem.id === item.id &&
                    cartItem.size === item.size &&
                    cartItem.name === item.name &&
                    cartItem.category === item.category
            );
            if (existingItemIndex >= 0) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + (item.quantity || 1),
                };
                return updatedItems;
            } else {
                return [...prevItems, { ...item, quantity: item.quantity || 1 }];
            }
        });
    };

    const addOneItem = (item) => {
        addItem({ ...item, quantity: 1 });
    };

    const removeOneItem = (item) => {
            setCartItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex(
                (cartItem) =>
                    cartItem.id === item.id &&
                    cartItem.size === item.size &&
                    cartItem.name === item.name &&
                    cartItem.category === item.category
            );

            if (existingItemIndex >= 0) {
                const updatedItems = [...prevItems];
                const currentItem = updatedItems[existingItemIndex];

                if (currentItem.quantity > 1) {
                    console.log('Removing one item:', item);
                    updatedItems[existingItemIndex] = {
                        ...currentItem,
                        quantity: currentItem.quantity - 1,
                    };
                } else {
                    updatedItems.splice(existingItemIndex, 1);
                }
                return updatedItems;
            }
            return prevItems;
        });
    };


    const removeItem = (item) => {
        setCartItems((prevItems) =>
            prevItems.filter(
                (cartItem) =>
                    cartItem.id !== item.id ||
                    cartItem.size !== item.size ||
                    cartItem.name !== item.name ||
                    cartItem.category !== item.category
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
    };

    return (
        <CartContext.Provider value={{ cartItems, addItem, removeItem, clearCart, addOneItem, removeOneItem }}>
            {children}
        </CartContext.Provider>
    );
}
