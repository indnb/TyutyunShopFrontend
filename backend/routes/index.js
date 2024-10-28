// routes/index.js
const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const productRouter = require('./productRouter');
const categoryRouter = require('./categoryRouter');
// Подключите другие роутеры при необходимости

router.use('/user', userRouter);
router.use('/product', productRouter);
// Добавьте другие роутеры

router.use('/categories', categoryRouter);

module.exports = router;
