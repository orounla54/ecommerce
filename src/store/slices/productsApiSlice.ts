import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Product } from '../../types';
import config from '../../config';
import { PRODUCTS_URL, UPLOAD_URL } from '../../constants';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: config.apiUrl }),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query<{ products: Product[]; pages: number; page: number }, { keyword?: string; pageNumber?: number }>({
      query: ({ keyword = '', pageNumber = 1 }) => ({
        url: `/products?keyword=${keyword}&pageNumber=${pageNumber}`,
      }),
      providesTags: ['Product'],
    }),
    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation<Product, { id: string; product: Partial<Product> }>({
      query: ({ id, product }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
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
      invalidatesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }],
    }),
    getProductsByCategory: builder.query<{ products: Product[]; pages: number; page: number }, { categoryId: string; pageNumber?: number }>({
      query: ({ categoryId, pageNumber = 1 }) => ({
        url: `/products/category/${categoryId}?pageNumber=${pageNumber}`,
      }),
      providesTags: ['Product'],
    }),
    getTopProducts: builder.query<Product[], void>({
      query: () => '/products/top',
      providesTags: ['Product'],
    }),
    getFeaturedProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/featured`,
      }),
      keepUnusedDataFor: 5,
    }),
    getNewProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/new`,
      }),
      keepUnusedDataFor: 5,
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: UPLOAD_URL,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateProductReviewMutation,
  useGetProductsByCategoryQuery,
  useGetTopProductsQuery,
  useGetFeaturedProductsQuery,
  useGetNewProductsQuery,
  useUploadProductImageMutation,
} = productsApi;