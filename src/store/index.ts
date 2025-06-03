import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './slices/authApiSlice';
import { productsApi } from './slices/productsApiSlice';
import { categoriesApi } from './slices/categoriesApiSlice';
import { ordersApiSlice } from './slices/ordersApiSlice';
import { usersApi } from './slices/usersApiSlice';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [ordersApiSlice.reducerPath]: ordersApiSlice.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    auth: authReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      productsApi.middleware,
      categoriesApi.middleware,
      ordersApiSlice.middleware,
      usersApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;