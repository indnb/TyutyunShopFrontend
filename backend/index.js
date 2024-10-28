// server.js
require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const models = require('./models/models');
const cors = require('cors');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlerMiddleware');
const path = require('path');

const PORT = process.env.PORT || 5000;
const app = express();

// Обслуживание статических файлов из папки 'image'

// Другие настройки приложения
// server.js
app.use('/image', express.static(path.resolve(__dirname, 'image')));

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));

// Маршруты
app.use('/api', router);

// Обработка ошибок
app.use(errorHandler);

app.get('/', (req, res) => {
   res.status(200).json({
       message: 'Welcome to the server!'
   });
});

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
};

start();
