import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import { Clock, CheckCircle } from 'lucide-react';
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
  useDeliverOrderMutation,
} from '../store/slices/ordersApiSlice';
import { RootState } from '../store';
import Loader from '../components/Loader';
import Message from '../components/Message';

const OrderPage = () => {
  const { id: orderId } = useParams();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId as string);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPaypalClientIdQuery({});

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId: orderId as string, details }).unwrap();
        refetch();
        toast.success('Order is paid');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });
  }

  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  const deliverHandler = async () => {
    await deliverOrder(orderId as string);
    refetch();
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">
      {error?.data?.message || error.error}
    </Message>
  ) : (
    <>
      <Helmet>
        <title>Order {order._id} | TechShop</title>
      </Helmet>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold mb-4">Order {order._id}</h1>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4">Shipping</h2>
              <p className="text-gray-700 mb-1">
                <strong>Name:</strong> {order.user.name}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Email:</strong> {order.user.email}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Address:</strong> {order.shippingAddress.address},{' '}
                {order.shippingAddress.city} {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              
              <div className="mt-4">
                {order.isDelivered ? (
                  <Message variant="success">
                    <div className="flex items-center">
                      <CheckCircle size={18} className="mr-2" />
                      Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                    </div>
                  </Message>
                ) : (
                  <Message variant="warning">
                    <div className="flex items-center">
                      <Clock size={18} className="mr-2" />
                      Not Delivered
                    </div>
                  </Message>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4">Payment Method</h2>
              <p className="text-gray-700 mb-1">
                <strong>Method:</strong> {order.paymentMethod}
              </p>
              
              <div className="mt-4">
                {order.isPaid ? (
                  <Message variant="success">
                    <div className="flex items-center">
                      <CheckCircle size={18} className="mr-2" />
                      Paid on {new Date(order.paidAt).toLocaleDateString()}
                    </div>
                  </Message>
                ) : (
                  <Message variant="warning">
                    <div className="flex items-center">
                      <Clock size={18} className="mr-2" />
                      Not Paid
                    </div>
                  </Message>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4">Order Items</h2>
              
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center py-2">
                    <div className="w-16 h-16">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <Link
                        to={`/product/${item.product}`}
                        className="text-gray-900 hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <div className="text-right">
                      {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>${order.itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${order.shippingPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${order.taxPrice}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-3">
                <span>Total:</span>
                <span>${order.totalPrice}</span>
              </div>
            </div>

            {!order.isPaid && (
              <div>
                {loadingPay && <Loader />}
                {isPending ? (
                  <Loader />
                ) : (
                  <div>
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                    ></PayPalButtons>
                  </div>
                )}
              </div>
            )}

            {loadingDeliver && <Loader />}
            
            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                <div className="mt-4">
                  <button
                    type="button"
                    className="btn btn-primary w-full"
                    onClick={deliverHandler}
                  >
                    Mark As Delivered
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderPage;