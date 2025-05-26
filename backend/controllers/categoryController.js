import asyncHandler from 'express-async-handler'
import Category from '../models/categoryModel.js'
import Product from '../models/productModel.js'

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({})

  const categoriesWithProductCount = await Promise.all(
    categories.map(async (category) => {
      const productCount = await Product.countDocuments({ category: category._id });
      return { ...category.toJSON(), productCount };
    })
  );

  res.json(categoriesWithProductCount);
})

// @desc    Fetch single category
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)

  if (category) {
    res.json(category)
  } else {
    res.status(404)
    throw new Error('Category not found')
  }
})

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)

  if (category) {
    await category.deleteOne()
    res.json({ message: 'Category removed' })
  } else {
    res.status(404)
    throw new Error('Category not found')
  }
})

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const category = new Category({
    name: 'Sample name',
    image: '/images/sample.jpg',
    description: 'Sample description',
    featured: false,
  })

  const createdCategory = await category.save()
  res.status(201).json(createdCategory)
})

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const { name, image, description, featured } = req.body

  const category = await Category.findById(req.params.id)

  if (category) {
    category.name = name
    category.image = image
    category.description = description
    category.featured = featured

    const updatedCategory = await category.save()
    res.json(updatedCategory)
  } else {
    res.status(404)
    throw new Error('Category not found')
  }
})

// @desc    Get featured categories
// @route   GET /api/categories/featured
// @access  Public
const getFeaturedCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ featured: true })

  res.json(categories)
})

export {
  getCategories,
  getCategoryById,
  deleteCategory,
  createCategory,
  updateCategory,
  getFeaturedCategories,
} 