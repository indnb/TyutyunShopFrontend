import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://0.0.0.0:1666/api',
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('Adding Authorization header:', token);
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
