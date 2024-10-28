// controllers/userController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/models');
const ApiError = require('../error/ApiError');
const { Op } = require('sequelize');

const generateJwt = (id, email, role) => {
    return jwt.sign(
        { id, email, role },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    );
};

class UserController {
    async registration(req, res, next) {
        const { email, password, role, username, first_name, last_name, phone_number } = req.body;
        if (!email || !password) {
            return next(ApiError.badRequest('Invalid email or password'));
        }
        const candidate = await User.findOne({ where: { email } });
        if (candidate) {
            return next(ApiError.badRequest('Email already registered'));
        }
        const hashedPassword = await bcrypt.hash(password, 5);
        const user = await User.create({
            email,
            username,
            password_hash: hashedPassword,
            role: role || 'USER',
            first_name,
            last_name,
            phone_number,
        });
        const token = generateJwt(user.id, user.email, user.role);
        return res.json({ token });
    }

    async login(req, res, next) {
        const { emailOrUsername, password } = req.body;
        if (!emailOrUsername || !password) {
            return next(ApiError.badRequest('Invalid email or password'));
        }
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { email: emailOrUsername },
                    { username: emailOrUsername },
                ],
            },
        });
        if (!user) {
            return next(ApiError.internal('User not found'));
        }
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return next(ApiError.internal('Incorrect password'));
        }
        const token = generateJwt(user.id, user.email, user.role);
        return res.json({ token });
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role);
        return res.json({ token });
    }
}

module.exports = new UserController();
