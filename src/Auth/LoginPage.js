import React, {useContext, useState} from 'react';
import axios from '../axiosConfig';
import {useHistory} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import './Auth.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();
    const { checkAuth } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/user/login', { email, password });
            const { token, role } = response.data;
            console.log(role);
            localStorage.setItem('token', token);
            await checkAuth();
            history.push('/user/profile');
        } catch (error) {
            console.error('Error logging in user', error);
        }
    };

    return (
        <div className="auth-container margin-top margin-bottom">
            <h2>Вхід</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Пароль:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Увійти</button>
            </form>
        </div>
    );
}

export default LoginPage;
