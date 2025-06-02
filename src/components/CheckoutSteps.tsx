import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

interface CheckoutStepsProps {
  step1?: boolean;
  step2?: boolean;
  step3?: boolean;
  step4?: boolean;
}

const CheckoutSteps = ({ step1, step2, step3, step4 }: CheckoutStepsProps) => {
  return (
    <div className="flex flex-wrap justify-between items-center mb-8 max-w-3xl mx-auto">
      <div className="flex items-center">
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
          }`}
        >
          {step1 ? <Check size={16} /> : '1'}
        </div>
        <div
          className={`ml-2 text-sm ${
            step1 ? 'text-primary font-medium' : 'text-gray-500'
          }`}
        >
          {step1 ? (
            <Link to="/login">Sign In</Link>
          ) : (
            'Sign In'
          )}
        </div>
      </div>
      
      <div className="hidden sm:block w-12 h-0.5 bg-gray-200"></div>
      
      <div className="flex items-center">
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
          }`}
        >
          {step2 ? <Check size={16} /> : '2'}
        </div>
        <div
          className={`ml-2 text-sm ${
            step2 ? 'text-primary font-medium' : 'text-gray-500'
          }`}
        >
          {step2 ? (
            <Link to="/shipping">Shipping</Link>
          ) : (
            'Shipping'
          )}
        </div>
      </div>
      
      <div className="hidden sm:block w-12 h-0.5 bg-gray-200"></div>
      
      <div className="flex items-center">
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
          }`}
        >
          {step3 ? <Check size={16} /> : '3'}
        </div>
        <div
          className={`ml-2 text-sm ${
            step3 ? 'text-primary font-medium' : 'text-gray-500'
          }`}
        >
          {step3 ? (
            <Link to="/payment">Payment</Link>
          ) : (
            'Payment'
          )}
        </div>
      </div>
      
      <div className="hidden sm:block w-12 h-0.5 bg-gray-200"></div>
      
      <div className="flex items-center">
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step4 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
          }`}
        >
          {step4 ? <Check size={16} /> : '4'}
        </div>
        <div
          className={`ml-2 text-sm ${
            step4 ? 'text-primary font-medium' : 'text-gray-500'
          }`}
        >
          {step4 ? (
            <Link to="/placeorder">Place Order</Link>
          ) : (
            'Place Order'
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;