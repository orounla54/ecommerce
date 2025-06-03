import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { Product } from '../../types';

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  user: string;
  createdAt: string;
}

export interface ProductState {
  products: Product[];
  featured: Product[];
  selectedProduct: Product | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  page: number;
  pages: number;
}

const initialState: ProductState = {
  products: [],
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
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
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
        state.products = action.payload.products;
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

export const { clearSelectedProduct, setProducts, setSelectedProduct, setError } = productSlice.actions;

// Sélecteurs avec vérification de sécurité
export const selectProducts = (state: { productsApi: { queries: Record<string, { data?: { products: Product[] } }> } }) => {
  const result = Object.values(state.productsApi.queries).find(
    (query) => query.data?.products
  );
  return result?.data?.products || [];
};

export const selectFeaturedProducts = (state: RootState) => {
  const result = state.productsApi.queries['getFeaturedProducts(undefined)']?.data;
  return result || [];
};

export const selectSelectedProduct = (state: { productsApi: { queries: Record<string, { data?: Product }> } }) => {
  const selectedId = state.productsApi.queries['getProductById(undefined)']?.data?._id;
  return selectedId ? state.productsApi.queries[`getProductById(${selectedId})`]?.data : null;
};

export const selectProductStatus = (state: RootState) => {
  const query = state.productsApi.queries['getProducts(undefined)'];
  if (!query) return 'idle';
  if (query.status === 'pending') return 'loading';
  if (query.status === 'fulfilled') return 'succeeded';
  if (query.status === 'rejected') return 'failed';
  return 'idle';
};

export const selectProductError = (state: { product: { error: string | null } }) => state.product.error;

export const selectProductPage = (state: { productsApi: { queries: Record<string, { data?: { page: number } }> } }) => {
  const result = Object.values(state.productsApi.queries).find(
    (query) => query.data?.page !== undefined
  );
  return result?.data?.page || 1;
};

export const selectProductPages = (state: { productsApi: { queries: Record<string, { data?: { pages: number } }> } }) => {
  const result = Object.values(state.productsApi.queries).find(
    (query) => query.data?.pages !== undefined
  );
  return result?.data?.pages || 1;
};

export default productSlice.reducer; 