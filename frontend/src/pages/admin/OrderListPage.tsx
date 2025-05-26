import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Clock, CheckCircle } from 'lucide-react';
import { useGetOrdersQuery } from '../../store/slices/ordersApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const OrderListPage = () => {
  const navigate = useNavigate();

  const { data: orders, isLoading, error } = useGetOrdersQuery({});

  return (
    <>
      <Helmet>
        <title>Orders | Admin</title>
      </Helmet>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold">Orders</h1>
        </div>
        
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    USER
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DATE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TOTAL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PAID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DELIVERED
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.user && order.user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.createdAt.substring(0, 10)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${order.totalPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {order.isPaid ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle size={16} className="mr-1" />
                          {order.paidAt.substring(0, 10)}
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-500">
                          <Clock size={16} className="mr-1" />
                          Not Paid
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {order.isDelivered ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle size={16} className="mr-1" />
                          {order.deliveredAt.substring(0, 10)}
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-500">
                          <Clock size={16} className="mr-1" />
                          Not Delivered
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => navigate(`/order/${order._id}`)}
                        className="text-primary hover:text-primary-dark"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderListPage;