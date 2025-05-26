const orders = [
  {
    user: '000000000000000000000000',
    orderItems: [
      {
        name: 'iPhone 14 Pro Max',
        qty: 1,
        image: '/images/products/iphone.jpg',
        price: 1299.99,
        product: '000000000000000000000001',
      },
    ],
    shippingAddress: {
      address: '123 Main St',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
    },
    paymentMethod: 'PayPal',
    paymentResult: {
      id: 'PAY-123456789',
      status: 'COMPLETED',
      update_time: '2023-01-01T00:00:00.000Z',
      email_address: 'john@example.com',
    },
    itemsPrice: 1299.99,
    taxPrice: 259.99,
    shippingPrice: 0,
    totalPrice: 1559.98,
    isPaid: true,
    paidAt: '2023-01-01T00:00:00.000Z',
    isDelivered: true,
    deliveredAt: '2023-01-02T00:00:00.000Z',
  },
  {
    user: '000000000000000000000000',
    orderItems: [
      {
        name: 'Samsung Galaxy S23 Ultra',
        qty: 1,
        image: '/images/products/samsung.jpg',
        price: 1199.99,
        product: '000000000000000000000002',
      },
    ],
    shippingAddress: {
      address: '456 Oak St',
      city: 'Lyon',
      postalCode: '69001',
      country: 'France',
    },
    paymentMethod: 'Stripe',
    paymentResult: {
      id: 'pi_123456789',
      status: 'succeeded',
      update_time: '2023-01-03T00:00:00.000Z',
      email_address: 'jane@example.com',
    },
    itemsPrice: 1199.99,
    taxPrice: 239.99,
    shippingPrice: 0,
    totalPrice: 1439.98,
    isPaid: true,
    paidAt: '2023-01-03T00:00:00.000Z',
    isDelivered: false,
  },
]

export default orders 