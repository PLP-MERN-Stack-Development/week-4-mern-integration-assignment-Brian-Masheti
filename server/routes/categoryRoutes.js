const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { validateCategory, handleValidationErrors } = require('../middleware/validation');

// GET /api/categories
router.get('/', categoryController.getCategories);
// POST /api/categories
router.post('/', validateCategory, handleValidationErrors, categoryController.createCategory);

module.exports = router;
