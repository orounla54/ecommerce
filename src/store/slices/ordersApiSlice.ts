import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../types';
import { Order, PaymentDetails, OrderItem } from '../../types';

interface CreateOrderRequest {
  orderItems: {
    product: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentDetails?: PaymentDetails;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}

interface UpdateOrderToPaidRequest {
  id: string;
  paymentDetails: PaymentDetails;
}

interface UpdateOrderToDeliveredRequest {
  id: string;
}

interface GetOrdersResponse {
  orders: Order[];
  page: number;
  pages: number;
}

interface GetOrdersRequest {
  pageNumber?: number;
  keyword?: string;
}

export const ordersApiSlice = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.userInfo?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    getOrders: builder.query<{ orders: Order[]; page: number; pages: number }, GetOrdersRequest>({
      query: ({ pageNumber = 1, keyword = '' }) => ({
        url: `/api/orders?pageNumber=${pageNumber}&keyword=${keyword}`,
      }),
      providesTags: ['Order'],
    }),
    getOrderById: builder.query<Order, string>({
      query: (id) => ({
        url: `/api/orders/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    createOrder: builder.mutation<Order, Partial<Order>>({
      query: (order) => ({
        url: '/api/orders',
        method: 'POST',
        body: order,
      }),
      invalidatesTags: ['Order'],
    }),
    updateOrderToPaid: builder.mutation<Order, UpdateOrderToPaidRequest>({
      query: ({ id, paymentDetails }) => ({
        url: `/api/orders/${id}/pay`,
        method: 'PUT',
        body: paymentDetails,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Order', id }],
    }),
    updateOrderToDelivered: builder.mutation<Order, UpdateOrderToDeliveredRequest>({
      query: ({ id }) => ({
        url: `/api/orders/${id}/deliver`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Order', id }],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderToPaidMutation,
  useUpdateOrderToDeliveredMutation,
} = ordersApiSlice;