import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import type { ReactPayPalScriptOptions } from '@paypal/react-paypal-js/dist/types/types/scriptProviderTypes';
import type { PayPalButtonsComponentProps } from '@paypal/react-paypal-js/dist/types/types/paypalButtonTypes';
import { toast } from 'react-toastify';
import { useCreateOrderMutation } from '../store/slices/ordersApiSlice';
import { useCart } from '../contexts/CartContext';
import { ApiErrorResponse, getErrorMessage, PaymentMethod, PaymentDetails } from '../types';
import CheckoutSteps from '../components/CheckoutSteps';
import PaymentMethodIcon from '../components/PaymentMethodIcon';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart, savePaymentMethod } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PayPal');

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const [createOrder, { isLoading }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart?.items?.length) {
      navigate('/cart');
    }
    if (!cart?.shippingAddress) {
      navigate('/shipping');
    }
    paypalDispatch({
      type: 'resetOptions' as const,
      value: {
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: 'EUR',
      } as ReactPayPalScriptOptions,
    });
  }, [cart, navigate, paypalDispatch]);

  const onApprove = async (_data: any, actions: any) => {
    try {
      const details = await actions.order.capture();
      const paymentDetails: PaymentDetails = {
        id: details.id,
        status: details.status,
        update_time: details.update_time,
        email_address: details.payer.email_address,
      };

      const order = await createOrder({
        orderItems: cart.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        })),
        shippingAddress: cart.shippingAddress!,
        paymentMethod,
        paymentDetails,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();

      clearCart();
      navigate(`/order/${order._id}`);
    } catch (err) {
      toast.error(getErrorMessage(err as ApiErrorResponse));
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
            value: cart?.totalPrice.toString() || '0',
          },
        },
      ],
    });
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    savePaymentMethod(paymentMethod);
    if (paymentMethod === 'PayPal') {
      // PayPal button will handle the payment
      return;
    }
    // Handle other payment methods
    navigate('/placeorder');
  };

  return (
    <>
      <Helmet>
        <title>Payment Method</title>
      </Helmet>

      <CheckoutSteps step1 step2 step3 />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Payment Method</h1>

        <form onSubmit={submitHandler} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="paypal"
                name="paymentMethod"
                value="PayPal"
                checked={paymentMethod === 'PayPal'}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              />
              <label htmlFor="paypal" className="ml-2 block text-sm font-medium text-gray-700">
                PayPal
              </label>
              <PaymentMethodIcon method="PayPal" className="ml-2" />
            </div>

            <div className="flex items-center">
              <input
                type="radio"
                id="stripe"
                name="paymentMethod"
                value="Stripe"
                checked={paymentMethod === 'Stripe'}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              />
              <label htmlFor="stripe" className="ml-2 block text-sm font-medium text-gray-700">
                Stripe
              </label>
              <PaymentMethodIcon method="Stripe" className="ml-2" />
            </div>
          </div>

          {paymentMethod === 'PayPal' && !isPending && (
            <div className="mt-4">
              <PayPalButtons
                createOrder={createPayPalOrder}
                onApprove={onApprove}
                onError={onError}
                style={{ layout: 'vertical' }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {isLoading ? 'Processing...' : 'Continue'}
          </button>
        </form>
      </div>
    </>
  );
};

export default PaymentPage;