// middleware/CheckRoleMiddleware.js
const jwt = require('jsonwebtoken');
const ApiError = require('../error/ApiError');

module.exports = (role) => {
    return (req, res, next) => {
        if (req.method === 'OPTIONS') {
            next();
        }
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return next(ApiError.unauthorized('No token provided'));
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            if (decoded.role !== role) {
                return next(ApiError.forbidden('Access denied'));
            }
            req.user = decoded;
            next();
        } catch (error) {
            return next(ApiError.unauthorized('Invalid token'));
        }
    };
};
