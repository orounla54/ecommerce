import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Product } from '../../types';
import config from '../../config';
import { PRODUCTS_URL, UPLOAD_URL } from '../../constants';

interface CreateProductRequest {
  name: string;
  price: number;
  description: string;
  image: string;
  brand: string;
  category: string;
  countInStock: number;
}

interface UpdateProductRequest {
  id: string;
  product: Partial<CreateProductRequest>;
}

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.userInfo?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query<{ products: Product[]; pages: number; page: number }, { pageNumber: number; keyword?: string }>({
      query: ({ pageNumber, keyword = '' }) => ({
        url: `/api/products?pageNumber=${pageNumber}&keyword=${keyword}`,
      }),
      providesTags: ['Product'],
    }),
    getProductById: builder.query<Product, string>({
      query: (id) => ({
        url: `/api/products/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    getProductsByCategory: builder.query<{ products: Product[]; pages: number; page: number }, { categoryId: string; pageNumber: number }>({
      query: ({ categoryId, pageNumber }) => ({
        url: `/api/products/category/${categoryId}?pageNumber=${pageNumber}`,
      }),
      providesTags: (result, error, { categoryId }) => [{ type: 'Product', id: categoryId }],
    }),
    createProduct: builder.mutation<Product, CreateProductRequest>({
      query: (product) => ({
        url: '/api/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation<Product, UpdateProductRequest>({
      query: ({ id, product }) => ({
        url: `/api/products/${id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    createProductReview: builder.mutation<
      void,
      { productId: string; review: { rating: number; comment: string } }
    >({
      query: ({ productId, review }) => ({
        url: `/products/${productId}/reviews`,
        method: 'POST',
        body: review,
      }),
      invalidatesTags: (_result, _error, { productId }) => [{ type: 'Product', id: productId }],
    }),
    getTopProducts: builder.query<Product[], void>({
      query: () => '/products/top',
      providesTags: ['Product'],
    }),
    getFeaturedProducts: builder.query<Product[], void>({
      query: () => ({
        url: `${PRODUCTS_URL}/featured`,
      }),
      keepUnusedDataFor: 5,
    }),
    getNewProducts: builder.query<Product[], void>({
      query: () => ({
        url: `${PRODUCTS_URL}/new`,
      }),
      keepUnusedDataFor: 5,
    }),
    uploadProductImage: builder.mutation<{ image: string }, FormData>({
      query: (formData) => ({
        url: '/api/upload',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductsByCategoryQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateProductReviewMutation,
  useGetTopProductsQuery,
  useGetFeaturedProductsQuery,
  useGetNewProductsQuery,
  useUploadProductImageMutation,
} = productsApi;