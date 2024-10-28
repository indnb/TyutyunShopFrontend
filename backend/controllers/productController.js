// controllers/productController.js
const { Product, Category } = require('../models/models');

class ProductController {
    // Метод для создания продукта
    async create(req, res) {
        try {
            const { name, price, category_id } = req.body;
            const image = req.file;

            if (!image) {
                return res.status(400).json({ message: 'Изображение не загружено' });
            }

            // Получаем имя файла, сохраненного multer
            const fileName = image.filename; // Это имя файла, сгенерированное multer

            // Формируем URL для сохранения в базе данных
            const image_url = `/image/${fileName}`;

            // Сохраняем продукт в базе данных
            const newProduct = await Product.create({
                name,
                price,
                category_id,
                image_url,
            });

            res.json(newProduct);
        } catch (error) {
            console.error('Ошибка при добавлении товара на сервере:', error);
            res.status(500).json({ message: 'Ошибка при добавлении товара' });
        }
    }
    async getAll(req, res) {
        try {
            const { category_id } = req.query;
            let products;

            if (category_id) {
                products = await Product.findAll({
                    where: { category_id },
                    include: [{ model: Category, attributes: ['name'] }],
                });
            } else {
                products = await Product.findAll({
                    include: [{ model: Category, attributes: ['name'] }],
                });
            }

            res.json(products);
        } catch (error) {
            console.error('Ошибка при получении списка товаров:', error);
            res.status(500).json({ message: 'Ошибка при получении списка товаров' });
        }
    }

    // Метод для получения одного продукта по ID
    async getOne(req, res) {
        try {
            const { id } = req.params;
            const product = await Product.findOne({
                where: { id },
                include: [{ model: Category, attributes: ['name'] }],
            });

            if (!product) {
                return res.status(404).json({ message: 'Товар не найден' });
            }

            res.json(product);
        } catch (error) {
            console.error('Ошибка при получении товара:', error);
            res.status(500).json({ message: 'Ошибка при получении товара' });
        }
    }

}

module.exports = new ProductController();
