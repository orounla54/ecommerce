import express from 'express';
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  getFeaturedProducts,
  getNewProducts,
  getProductsByCategory,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.route('/').get(getProducts).post(protect, admin, createProduct);

// @desc    Fetch products by category
// @route   GET /api/products/category/:categoryId
// @access  Public
router.get('/category/:categoryId', getProductsByCategory);

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
router.get('/featured', getFeaturedProducts);

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
router.get('/top', getTopProducts);

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', getProductById);

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, createProduct);

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, updateProduct);

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteProduct);

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
router.post('/:id/reviews', protect, createProductReview);

// @desc    Get new products
// @route   GET /api/products/new
// @access  Public
router.get('/new', getNewProducts);

export default router;