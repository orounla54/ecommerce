import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { Category } from '../../types';

interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
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
  name: 'category',
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
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
        state.categories = action.payload;
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

export const { setCategories, setSelectedCategory, setError } = categorySlice.actions;

// Sélecteurs
export const selectCategories = (state: { categoriesApi: { queries: Record<string, { data?: { categories: Category[] } }> } }) => {
  const result = Object.values(state.categoriesApi.queries).find(
    (query) => query.data?.categories
  );
  return result?.data?.categories || [];
};

export const selectSelectedCategory = (state: { categoriesApi: { queries: Record<string, { data?: Category }> } }) => {
  const selectedId = state.categoriesApi.queries['getCategoryById(undefined)']?.data?._id;
  return selectedId ? state.categoriesApi.queries[`getCategoryById(${selectedId})`]?.data : null;
};

export const selectCategoryStatus = (state: RootState) => {
  const query = state.categoriesApi.queries['getCategories(undefined)'];
  if (!query) return 'idle';
  if (query.status === 'pending') return 'loading';
  if (query.status === 'fulfilled') return 'succeeded';
  if (query.status === 'rejected') return 'failed';
  return 'idle';
};

export const selectCategoryError = (state: { category: { error: string | null } }) => state.category.error;

export default categorySlice.reducer; 