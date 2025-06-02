const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  paypalClientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
};

export default config; 