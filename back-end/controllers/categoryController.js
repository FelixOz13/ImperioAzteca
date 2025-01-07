import Category from '../models/categoryModel.js';
import asyncHandler from '../middleware/asyncHandler.js';

// GET - Fetch all categories
const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
});

// GET - Fetch a single category by ID
const getCategoryById = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
});

// POST - Create a new category
const createCategory = asyncHandler(async (req, res) => {
    const category = new Category({
        name: req.body.name,
        description: req.body.description
    });

    const newCategory = await category.save();
    res.status(201).json(newCategory);
});

// PUT - Update a category by ID
const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }

    category.name = req.body.name || category.name;
    category.description = req.body.description || category.description;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
});

// DELETE - Delete a category by ID
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }

    await category.remove();
    res.json({ message: 'Category deleted' });
});

export default {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};

