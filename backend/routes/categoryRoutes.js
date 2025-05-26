import express from 'express';
import {
  getCategories,
  getCategoryById,
  deleteCategory,
  createCategory,
  updateCategory,
  getFeaturedCategories,
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
router.route('/').get(getCategories).post(protect, admin, createCategory);

// @desc    Fetch single category
// @route   GET /api/categories/:id
// @access  Public
router.get('/featured', getFeaturedCategories);

router
  .route('/:id')
  .get(getCategoryById)
  .delete(protect, admin, deleteCategory)
  .put(protect, admin, updateCategory);

export default router;