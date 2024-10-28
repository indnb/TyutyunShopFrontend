// routes/adminRouter.js

const Router = require('express');
const router = new Router();
const adminController = require('../controllers/adminController');
const checkRole = require('../middleware/CheckRoleMiddleware');

router.get('/dashboard', checkRole('ADMIN'), adminController.getDashboard);

// ... другие маршруты администратора ...

module.exports = router;
