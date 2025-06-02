import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

export interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

interface CategoryState {
  items: Category[];
  selectedCategory: Category | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CategoryState = {
  items: [],
  selectedCategory: null,
  status: 'idle',
  error: null,
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const { data } = await axios.get('/api/categories');
    return data;
  }
);

export const fetchCategoryById = createAsyncThunk(
  'categories/fetchCategoryById',
  async (id: string) => {
    const { data } = await axios.get(`/api/categories/${id}`);
    return data;
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Une erreur est survenue';
      })
      // Fetch Category by ID
      .addCase(fetchCategoryById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Une erreur est survenue';
      });
  },
});

export const { clearSelectedCategory } = categorySlice.actions;

// Sélecteurs avec vérification de sécurité
export const selectCategories = (state: RootState) => state.categories?.items || [];
export const selectSelectedCategory = (state: RootState) => state.categories?.selectedCategory || null;
export const selectCategoryStatus = (state: RootState) => state.categories?.status || 'idle';
export const selectCategoryError = (state: RootState) => state.categories?.error || null;

export default categorySlice.reducer; 