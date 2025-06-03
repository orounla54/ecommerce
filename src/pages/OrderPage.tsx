import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { PayPalButtons, usePayPalScriptReducer, PayPalScriptOptions } from '@paypal/react-paypal-js';
import type { PayPalButtonsComponentProps } from '@paypal/react-paypal-js/dist/types/types/paypalButtonTypes';
import { toast } from 'react-toastify';
import { Clock, CheckCircle } from 'lucide-react';
import {
  useGetOrderByIdQuery,
  useUpdateOrderToPaidMutation,
  useUpdateOrderToDeliveredMutation,
} from '../store/slices/ordersApiSlice';
import { RootState, Order, ApiErrorResponse, getErrorMessage, PayPalOrderResponse, PayPalScriptOptions as CustomPayPalScriptOptions } from '../types';
import Loader from '../components/Loader';
import Message from '../components/Message';

const OrderPage = () => {
  const { id: orderId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderByIdQuery(orderId || '');

  const [payOrder, { isLoading: loadingPay }] = useUpdateOrderToPaidMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useUpdateOrderToDeliveredMutation();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (!order?.isPaid) {
      const options: PayPalScriptOptions = {
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: 'EUR',
      };
      paypalDispatch({
        type: 'resetOptions',
        value: options,
      });
    }
  }, [order?.isPaid, paypalDispatch]);

  const onApprove = async (_data: unknown, actions: any) => {
    if (!orderId) return;
    
    try {
      const details = await actions.order.capture() as PayPalOrderResponse;
      await payOrder({
        id: orderId,
        paymentDetails: {
          orderId: details.id,
          paymentId: details.purchase_units[0].payments.captures[0].id,
          status: details.status,
          email_address: details.payer.email_address
        }
      }).unwrap();
      refetch();
      toast.success('Payment successful');
    } catch (err) {
      const error = err as unknown as ApiErrorResponse;
      toast.error(getErrorMessage(error));
    }
  };

  const onError: PayPalButtonsComponentProps['onError'] = (err) => {
    toast.error(getErrorMessage(err as ApiErrorResponse));
  };

  const createPayPalOrder: PayPalButtonsComponentProps['createOrder'] = (_data, actions) => {
    return actions.order.create({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: order?.totalPrice.toString() || '0',
          },
        },
      ],
    });
  };

  const deliverOrderHandler = async () => {
    if (!orderId) return;
    
    try {
      await deliverOrder({ id: orderId }).unwrap();
      refetch();
      toast.success('Order delivered');
    } catch (err) {
      const error = err as unknown as ApiErrorResponse;
      toast.error(getErrorMessage(error));
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{getErrorMessage(error as ApiErrorResponse)}</Message>
  ) : (
    <>
      <Helmet>
        <title>Order {order?._id}</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Order {order?._id}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Shipping</h2>
              <p>
                <strong>Name:</strong> {order?.user.name}
              </p>
              <p>
                <strong>Email:</strong>{' '}
                <a href={`mailto:${order?.user.email}`} className="text-primary hover:underline">
                  {order?.user.email}
                </a>
              </p>
              <p>
                <strong>Address:</strong> {order?.shippingAddress.address},{' '}
                {order?.shippingAddress.city} {order?.shippingAddress.postalCode},{' '}
                {order?.shippingAddress.country}
              </p>
              {order?.isDelivered ? (
                <Message variant="success">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Delivered on {new Date(order.deliveredAt!).toLocaleDateString()}
                  </div>
                </Message>
              ) : (
                <Message variant="warning">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Not Delivered
                  </div>
                </Message>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
              <p>
                <strong>Method:</strong> {order?.paymentMethod}
              </p>
              {order?.isPaid ? (
                <Message variant="success">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Paid on {new Date(order.paidAt!).toLocaleDateString()}
                  </div>
                </Message>
              ) : (
                <Message variant="warning">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Not Paid
                  </div>
                </Message>
              )}
            </div>

            {!order?.isPaid && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Pay Order</h2>
                {isPending ? (
                  <Loader />
                ) : (
                  <PayPalButtons
                    createOrder={createPayPalOrder}
                    onApprove={onApprove}
                    onError={onError}
                    style={{ layout: 'vertical' }}
                  />
                )}
              </div>
            )}

            {userInfo?.isAdmin && order?.isPaid && !order?.isDelivered && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <button
                  type="button"
                  className="btn btn-primary w-full"
                  onClick={deliverOrderHandler}
                  disabled={loadingDeliver}
                >
                  {loadingDeliver ? 'Processing...' : 'Mark As Delivered'}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Order Items</h2>
              {order?.orderItems.map((item) => (
                <div key={item.product._id} className="flex items-center py-4 border-b last:border-0">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <Link
                      to={`/product/${item.product._id}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x ${item.price.toFixed(2)} = $
                      {(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span>${order?.itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${order?.shippingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${order?.taxPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                  <span>Total</span>
                  <span>${order?.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderPage;