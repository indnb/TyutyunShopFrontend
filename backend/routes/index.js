// routes/index.js
const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const productRouter = require('./productRouter');
// Подключите другие роутеры при необходимости

router.use('/user', userRouter);
router.use('/product', productRouter);
// Добавьте другие роутеры

module.exports = router;
