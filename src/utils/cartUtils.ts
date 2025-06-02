import { CartState } from '../store/slices/cartSlice';

export const addDecimals = (num: number): number => {
  return Math.round(num * 100) / 100;
};

export const updateCart = (state: CartState): CartState => {
  // Calculate items price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // Calculate shipping price (Free shipping for orders over $100, otherwise $10 shipping)
  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);

  // Calculate tax price (15% tax)
  state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));

  // Calculate total price
  state.totalPrice = addDecimals(
    state.itemsPrice + state.shippingPrice + state.taxPrice
  );

  localStorage.setItem('cart', JSON.stringify(state));

  return state;
};