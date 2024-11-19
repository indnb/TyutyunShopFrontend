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
    const [cooldown, setCooldown] = useState(0); // Cooldown time in seconds
    const [failedAttempts, setFailedAttempts] = useState(0); // Track failed login attempts
    const history = useHistory();
    const { checkAuth } = useContext(AuthContext);

    // Load cooldown and failed attempts state from cookies on component mount
    useEffect(() => {
        const savedCooldown = parseInt(Cookies.get('loginCooldown') || '0', 10);
        const savedAttempts = parseInt(Cookies.get('failedAttempts') || '0', 10);

        if (savedCooldown > 0) {
            const remainingTime = Math.max(0, savedCooldown - Math.floor(Date.now() / 1000));
            setCooldown(remainingTime);
        }

        setFailedAttempts(savedAttempts);
    }, []);

    // Save cooldown and failed attempts to cookies when they change
    useEffect(() => {
        if (cooldown > 0) {
            Cookies.set('loginCooldown', Math.floor(Date.now() / 1000) + cooldown, { expires: 1 / 48 }); // Expires in 30 minutes
        } else {
            Cookies.remove('loginCooldown'); // Remove cookie when cooldown ends
        }

        Cookies.set('failedAttempts', failedAttempts, { expires: 1 / 48 }); // Save failed attempts
    }, [cooldown, failedAttempts]);

    // Cooldown timer
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
            setFailedAttempts(0); // Reset failed attempts on success
            history.push('/user/profile');
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 404)) {
                setError('Невірні дані.');
                setFailedAttempts((prev) => prev + 1); // Increment failed attempts
                if (failedAttempts + 1 >= 3) {
                    setCooldown(30); // Start 30-second cooldown after 3 failed attempts
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
                <button type="submit" disabled={cooldown > 0}>
                    {cooldown > 0 ? `Зачекайте ${cooldown} с` : 'Увійти'}
                </button>
            </form>
        </div>
    );
}

export default LoginPage;
