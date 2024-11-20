import React, { createContext, useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useHistory } from 'react-router-dom';
import {clearCookies} from "../utils/cookie";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const history = useHistory();

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            try {
                const response = await axios.get('/user/role', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setIsAdmin(response.data.role === 'ADMIN');
            } catch (error) {
                console.error("Error fetching user's role:", error);
            }
        } else {
            setIsAuthenticated(false);
            setIsAdmin(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const logout = () => {
        clearCookies();
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setIsAdmin(false);
        history.push('/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isAdmin, setIsAuthenticated, setIsAdmin, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}
