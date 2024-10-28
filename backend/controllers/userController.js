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
    async getProfile(req, res, next) {
        try {
            const user = await User.findByPk(req.user.id, {
                attributes: ['id', 'username', 'email', 'first_name', 'last_name', 'phone_number', 'address'],
            });
            if (!user) {
                return next(ApiError.badRequest('Користувача не знайдено'));
            }
            res.json(user);
        } catch (error) {
            next(ApiError.internal('Помилка сервера'));
        }
    }

    async updateProfile(req, res, next) {
        try {
            const { first_name, last_name, phone_number, address } = req.body;
            const user = await User.findByPk(req.user.id);
            if (!user) {
                return next(ApiError.badRequest('Користувача не знайдено'));
            }
            user.first_name = first_name;
            user.last_name = last_name;
            user.phone_number = phone_number;
            user.address = address;
            await user.save();
            res.json({ message: 'Дані успішно оновлено' });
        } catch (error) {
            next(ApiError.internal('Помилка сервера'));
        }
    }
    async getUserRole(req, res, next) {
        try {
            const user = await User.findByPk(req.user.id, {
                attributes: ['id', 'username', 'role'],
            });
            if (!user) {
                return next(ApiError.badRequest('Користувача не знайдено'));
            }
            res.json({ role: user.role });
        } catch (error) {
            next(ApiError.internal('Помилка сервера'));
        }
    }

}

module.exports = new UserController();
