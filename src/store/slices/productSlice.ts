import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  user: string;
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  image: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  countInStock: number;
  rating: number;
  numReviews: number;
  reviews: Review[];
  featured: boolean;
  isNewProduct: boolean;
}

interface ProductState {
  items: Product[];
  featured: Product[];
  selectedProduct: Product | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  page: number;
  pages: number;
}

const initialState: ProductState = {
  items: [],
  featured: [],
  selectedProduct: null,
  status: 'idle',
  error: null,
  page: 1,
  pages: 1,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ keyword = '', pageNumber = 1 }: { keyword?: string; pageNumber?: number }) => {
    const { data } = await axios.get(
      `/api/products?keyword=${keyword}&pageNumber=${pageNumber}`
    );
    return data;
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: string) => {
    const { data } = await axios.get(`/api/products/${id}`);
    return data;
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async () => {
    const { data } = await axios.get('/api/products/featured');
    return data;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Une erreur est survenue';
      })
      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Une erreur est survenue';
      })
      // Fetch Featured Products
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.featured = action.payload;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Une erreur est survenue';
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;

// Sélecteurs avec vérification de sécurité
export const selectProducts = (state: RootState) => state.products?.items || [];
export const selectFeaturedProducts = (state: RootState) => state.products?.featured || [];
export const selectSelectedProduct = (state: RootState) => state.products?.selectedProduct || null;
export const selectProductStatus = (state: RootState) => state.products?.status || 'idle';
export const selectProductError = (state: RootState) => state.products?.error || null;
export const selectProductPage = (state: RootState) => state.products?.page || 1;
export const selectProductPages = (state: RootState) => state.products?.pages || 1;

export default productSlice.reducer; 