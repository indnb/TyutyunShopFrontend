import axios from 'axios';

const instance = axios.create({
    baseURL: '/api',
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.url.startsWith("/api")) {
            console.log('Adding Authorization header:', token);
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.log('Skipping Authorization header for:', config.url);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default instance;
