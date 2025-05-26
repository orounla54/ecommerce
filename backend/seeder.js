import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Category from './models/categoryModel.js';
import Order from './models/orderModel.js';
import connectDB from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lire les fichiers JSON
const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'users.json'), 'utf-8'));
const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf-8'));
const categories = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'categories.json'), 'utf-8'));

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    const createdUsers = await User.insertMany(users);

    const adminUser = createdUsers[0]._id;

    const createdCategories = await Category.insertMany(categories);

    const sampleProducts = products.map((product, index) => {
      // Distribute products across categories
      const categoryIndex = index % createdCategories.length;
      return {
        ...product,
        user: adminUser,
        category: createdCategories[categoryIndex]._id,
      };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}