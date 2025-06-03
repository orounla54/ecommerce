export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  image: string;
  description: string;
  brand: string;
  category: Category | string;
  price: number;
  countInStock: number;
  rating: number;
  numReviews: number;
  reviews: Review[];
  featured?: boolean;
  isNewProduct: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  user: string;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  orderItems: OrderItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentResult?: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  _id: string;
  name: string;
  qty: number;
  image: string;
  price: number;
  product: string;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
}

export interface PaymentDetails {
  orderId: string;
  paymentId: string;
  status: string;
  update_time?: string;
  email_address?: string;
}

export interface ApiErrorResponse {
  status: number;
  data: {
    message: string;
    stack?: string;
  };
}

export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null) {
    if ('data' in error && typeof error.data === 'object' && error.data !== null) {
      if ('message' in error.data && typeof error.data.message === 'string') {
        return error.data.message;
      }
    }
    if ('error' in error && typeof error.error === 'string') {
      return error.error;
    }
  }
  return 'An error occurred';
};

export interface CartItem {
  product: string;
  name: string;
  image: string;
  price: number;
  countInStock: number;
  qty: number;
}

export interface CartState {
  cartItems: CartItem[];
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}

export interface AuthState {
  userInfo: UserInfo | null;
}

export interface RootState {
  auth: AuthState;
  cart: CartState;
}

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
}

export interface PayPalScriptOptions {
  clientId: string;
  currency: string;
}

export interface PayPalOrderResponse {
  id: string;
  status: string;
  purchase_units: Array<{
    payments: {
      captures: Array<{
        id: string;
      }>;
    };
  }>;
  payer: {
    email_address: string;
  };
} 