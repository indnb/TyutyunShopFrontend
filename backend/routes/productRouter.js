// routes/productRouter.js
const Router = require('express');
const router = new Router();
const productController = require('../controllers/productController');
const checkRole = require('../middleware/CheckRoleMiddleware');
const multer = require('multer');
const path = require('path');

// Настройка Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, '..', 'image'));
    },
    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() + '-' + file.originalname.replace(/\s/g, '_')
        );
    },
});
const upload = multer({ storage });

// Используем middleware multer и checkRole
router.post('/', checkRole('ADMIN'), upload.single('image'), productController.create);
router.get('/', productController.getAll);
router.get('/:id', productController.getOne);

module.exports = router;
