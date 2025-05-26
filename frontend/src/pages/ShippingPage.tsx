import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { saveShippingAddress } from '../store/slices/cartSlice';
import { RootState } from '../store';
import CheckoutSteps from '../components/CheckoutSteps';
import { MapPin } from 'lucide-react';

const ShippingPage = () => {
  const cart = useSelector((state: RootState) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <>
      <Helmet>
        <title>Shipping | TechShop</title>
      </Helmet>

      <CheckoutSteps step1 step2 />

      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Shipping</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label htmlFor="address" className="block text-gray-700 mb-2">
                Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="address"
                  placeholder="Enter address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="form-control pl-10"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="city" className="block text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                id="city"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="postalCode" className="block text-gray-700 mb-2">
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                placeholder="Enter postal code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="country" className="block text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                id="country"
                placeholder="Enter country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="form-control"
                required
              />
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

export default ShippingPage;