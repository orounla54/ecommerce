import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { useCreateOrderMutation } from '../store/slices/ordersApiSlice';
import { clearCartItems } from '../store/slices/cartSlice';
import { RootState } from '../store';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import Message from '../components/Message';

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const cart = useSelector((state: RootState) => state.cart);
  const { cartItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = cart;

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!shippingAddress) {
      navigate('/shipping');
    } else if (!paymentMethod) {
      navigate('/payment');
    }
  }, [navigate, shippingAddress, paymentMethod]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }).unwrap();
      
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error: any) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Place Order | TechShop</title>
      </Helmet>

      <CheckoutSteps step1 step2 step3 step4 />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4">Shipping</h2>
              <p className="text-gray-700 mb-1">
                <strong>Address:</strong> {shippingAddress.address}, {shippingAddress.city}{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4">Payment Method</h2>
              <p className="text-gray-700">
                <strong>Method:</strong> {paymentMethod}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4">Order Items</h2>
              
              {cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
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
                          to={`/product/${item._id}`}
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
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>${itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${shippingPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${taxPrice}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-3">
                <span>Total:</span>
                <span>${totalPrice}</span>
              </div>
            </div>

            {error && (
              <Message variant="danger">
                {error?.data?.message || error.error}
              </Message>
            )}

            <button
              type="button"
              className="btn btn-primary w-full"
              disabled={cartItems.length === 0 || isLoading}
              onClick={placeOrderHandler}
            >
              {isLoading ? <Loader /> : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderPage;