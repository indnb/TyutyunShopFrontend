import React, { useContext, useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';
import Cookies from 'js-cookie';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [cooldown, setCooldown] = useState(0);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const history = useHistory();
    const { checkAuth } = useContext(AuthContext);

    useEffect(() => {
        const savedCooldown = parseInt(Cookies.get('loginCooldown') || '0', 10);
        const savedAttempts = parseInt(Cookies.get('failedAttempts') || '0', 10);

        if (savedCooldown > 0) {
            const remainingTime = Math.max(0, savedCooldown - Math.floor(Date.now() / 1000));
            setCooldown(remainingTime);
        }

        setFailedAttempts(savedAttempts);
    }, []);

    useEffect(() => {
        if (cooldown > 0) {
            Cookies.set('loginCooldown', Math.floor(Date.now() / 1000) + cooldown, { expires: 1 / 48 });
        } else {
            Cookies.remove('loginCooldown');
        }

        Cookies.set('failedAttempts', failedAttempts, { expires: 1 / 48 });
    }, [cooldown, failedAttempts]);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setInterval(() => {
                setCooldown((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [cooldown]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (cooldown > 0) {
            setError(`Зачекайте ${cooldown} секунд перед повторною спробою.`);
            return;
        }

        try {
            const response = await axios.post('/user/login', { email, password });
            const { token, role } = response.data;
            console.log(role);
            localStorage.setItem('token', token);
            await checkAuth();
            setFailedAttempts(0);
            history.push('/user/profile');
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 404)) {
                setError('Невірні дані.');
                setFailedAttempts((prev) => prev + 1);
                if (failedAttempts + 1 >= 3) {
                    setCooldown(30);
                }
            } else {
                setError('Сталася помилка. Спробуйте ще раз.');
            }
            console.error('Error logging in user', error);
        }
    };

    return (
        <div className="auth-container margin-top margin-bottom">
            <h2>Вхід</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <label>
                    Пошта:
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
                <button className="mt-4" type="submit" disabled={cooldown > 0}>
                    {cooldown > 0 ? `Зачекайте ${cooldown} с` : 'Увійти'}
                </button>
            </form>
        </div>
    );
}

export default LoginPage;
