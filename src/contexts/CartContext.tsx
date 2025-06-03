import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product, ShippingAddress } from '../types';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  shippingAddress: ShippingAddress | null;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}

type CartAction =
  | { type: 'CART_ADD_ITEM'; payload: CartItem }
  | { type: 'CART_REMOVE_ITEM'; payload: string }
  | { type: 'CART_SAVE_SHIPPING_ADDRESS'; payload: ShippingAddress }
  | { type: 'CART_SAVE_PAYMENT_METHOD'; payload: string }
  | { type: 'CART_CLEAR_ITEMS' };

const initialState: CartState = {
  items: [],
  shippingAddress: null,
  paymentMethod: 'PayPal',
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
};

const CartContext = createContext<{
  cart: CartState;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  saveShippingAddress: (address: ShippingAddress) => void;
  savePaymentMethod: (method: string) => void;
  clearCart: () => void;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      const existItem = state.items.find(
        (x) => x.product._id === action.payload.product._id
      );

      if (existItem) {
        return {
          ...state,
          items: state.items.map((x) =>
            x.product._id === existItem.product._id ? action.payload : x
          ),
        };
      } else {
        return {
          ...state,
          items: [...state.items, action.payload],
        };
      }
    }
    case 'CART_REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((x) => x.product._id !== action.payload),
      };
    case 'CART_SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        shippingAddress: action.payload,
      };
    case 'CART_SAVE_PAYMENT_METHOD':
      return {
        ...state,
        paymentMethod: action.payload,
      };
    case 'CART_CLEAR_ITEMS':
      return {
        ...state,
        items: [],
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (item: CartItem) => {
    dispatch({ type: 'CART_ADD_ITEM', payload: item });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: id });
  };

  const saveShippingAddress = (address: ShippingAddress) => {
    dispatch({ type: 'CART_SAVE_SHIPPING_ADDRESS', payload: address });
  };

  const savePaymentMethod = (method: string) => {
    dispatch({ type: 'CART_SAVE_PAYMENT_METHOD', payload: method });
  };

  const clearCart = () => {
    dispatch({ type: 'CART_CLEAR_ITEMS' });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        saveShippingAddress,
        savePaymentMethod,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext; 