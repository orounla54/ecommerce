import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface PaymentMethod {
  method: 'PayPal' | 'Credit Card' | 'Stripe';
}

interface CartItem {
  _id: string;
  name: string;
  image: string;
  price: number;
  countInStock: number;
  qty: number;
}

interface CartState {
  cartItems: CartItem[];
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  shippingAddress: ShippingAddress | null;
  paymentMethod: PaymentMethod | null;
}

const initialState: CartState = {
  cartItems: [],
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
  shippingAddress: null,
  paymentMethod: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? { ...x, qty: x.qty + 1 } : x
        );
      } else {
        state.cartItems = [...state.cartItems, { ...item, qty: 1 }];
      }
      // Calculate prices after adding to cart
      cartSlice.caseReducers.calculatePrices(state);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      // Calculate prices after removing from cart
      cartSlice.caseReducers.calculatePrices(state);
    },
    updateCartItemQty: (
      state,
      action: PayloadAction<{ id: string; qty: number }>
    ) => {
      const { id, qty } = action.payload;
      state.cartItems = state.cartItems.map((x) =>
        x._id === id ? { ...x, qty: qty } : x
      );
      // Calculate prices after updating quantity
      cartSlice.caseReducers.calculatePrices(state);
    },
    clearCart: (state) => {
      state.cartItems = [];
      // Calculate prices after clearing cart
      cartSlice.caseReducers.calculatePrices(state);
    },
    calculatePrices: (state) => {
      state.itemsPrice = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      );
      state.shippingPrice = state.itemsPrice > 100 ? 0 : 10;
      state.taxPrice = Number((state.itemsPrice * 0.15).toFixed(2));
      state.totalPrice = Number(
        (state.itemsPrice + state.shippingPrice + state.taxPrice).toFixed(2)
      );
      // Also update localStorage here to persist cart state
      localStorage.setItem('cart', JSON.stringify(state));
    },
    saveShippingAddress: (state, action: PayloadAction<ShippingAddress>) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    savePaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', JSON.stringify(action.payload));
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartItemQty,
  clearCart,
  calculatePrices,
  saveShippingAddress,
  savePaymentMethod,
} = cartSlice.actions;

// Alias pour la compatibilité avec le code existant
export const clearCartItems = clearCart;

export const selectCart = (state: RootState) => state.cart;
export const selectCartItems = (state: RootState) => state.cart.cartItems;
export const selectCartTotal = (state: RootState) => state.cart.totalPrice;
export const selectShippingAddress = (state: RootState) => state.cart.shippingAddress;
export const selectPaymentMethod = (state: RootState) => state.cart.paymentMethod;

export default cartSlice.reducer;