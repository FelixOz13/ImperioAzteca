import express from 'express';
const router = express.Router();
import categoryController from '../controllers/categoryController.js';



// Define routes for categories

// GET all categories
router.get('/', categoryController.getAllCategories);

// GET a single category by ID
router.get('/:id', categoryController.getCategoryById);

// POST a new category
router.post('/', categoryController.createCategory);

// PUT update a category by ID
router.put('/:id', categoryController.updateCategory);

// DELETE a category by ID
router.delete('/:id', categoryController.deleteCategory);

export default router;
