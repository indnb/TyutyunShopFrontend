// controllers/productController.js
const { Product, ProductImage, Category, ProductSize } = require('../models/models');
const ApiError = require('../error/ApiError');

class ProductController {
    async create(req, res, next) {
        try {
            let { name, description, price, category_id, stock_quantity } = req.body;
            const product = await Product.create({
                name,
                description,
                price,
                category_id,
                stock_quantity,
            });
            // Добавьте логику для обработки изображений и размеров, если необходимо
            return res.json(product);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

    async getAll(req, res) {
        let { category_id, limit, page } = req.query;
        limit = limit || 9;
        page = page || 1;
        let offset = limit * (page - 1);
        let products;
        if (category_id) {
            products = await Product.findAndCountAll({
                where: { category_id },
                limit,
                offset,
                include: [ProductImage, Category, ProductSize],
            });
        } else {
            products = await Product.findAndCountAll({
                limit,
                offset,
                include: [ProductImage, Category, ProductSize],
            });
        }
        return res.json(products);
    }

    async getOne(req, res) {
        const { id } = req.params;
        const product = await Product.findOne({
            where: { id },
            include: [ProductImage, Category, ProductSize],
        });
        return res.json(product);
    }
}

module.exports = new ProductController();
