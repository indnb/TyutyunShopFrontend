// routes/categoryRouter.js

const express = require('express');
const router = express.Router();
const { Category } = require('../models/models');

// Эндпоинт для создания новой категории
router.post('/', async (req, res) => {
    const { name } = req.body;
    try {
        const category = await Category.create({ name });
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании категории' });
    }
});

// Эндпоинт для получения списка категорий
router.get('/', async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении категорий' });
    }
});

module.exports = router;
