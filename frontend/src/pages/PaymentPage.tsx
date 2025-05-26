import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { savePaymentMethod } from '../store/slices/cartSlice';
import { RootState } from '../store';
import CheckoutSteps from '../components/CheckoutSteps';
import PaymentMethodIcon from '../components/PaymentMethodIcon';

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state: RootState) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(savePaymentMethod({ method: paymentMethod as 'PayPal' | 'Credit Card' | 'Stripe' }));
    navigate('/placeorder');
  };

  return (
    <>
      <Helmet>
        <title>Payment Method | TechShop</title>
      </Helmet>

      <CheckoutSteps step1 step2 step3 />

      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Payment Method</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={submitHandler}>
            <div className="mb-6">
              <label className="block text-gray-700 mb-4 font-medium">
                Select Method
              </label>
              
              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="PayPal"
                    checked={paymentMethod === 'PayPal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <span className="ml-3 flex items-center">
                    <PaymentMethodIcon method="paypal" className="w-6 h-6 text-blue-500 mr-2" />
                    PayPal or Credit Card
                  </span>
                </label>
                
                <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Stripe"
                    checked={paymentMethod === 'Stripe'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <span className="ml-3 flex items-center">
                    <PaymentMethodIcon method="stripe" className="w-6 h-6 text-purple-500 mr-2" />
                    Stripe
                  </span>
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Continue
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;