import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from '../../store/slices/usersApiSlice';
import { ApiErrorResponse, getErrorMessage } from '../../types';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const UserEditPage = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const { data: user, isLoading, error, refetch } = useGetUserByIdQuery(userId ?? '');
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      await updateUser({
        id: userId ?? '',
        user: {
          name,
          email,
          isAdmin,
        },
      }).unwrap();
      
      refetch();
      toast.success('User updated');
      navigate('/admin/userlist');
    } catch (err: any) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Edit User | Admin</title>
      </Helmet>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <Link to="/admin/userlist" className="text-primary hover:text-primary-dark inline-flex items-center mb-4">
            <ArrowLeft size={16} className="mr-1" /> Back to Users
          </Link>
          <h1 className="text-xl font-bold">Edit User</h1>
        </div>
        
        {loadingUpdate && <Loader />}
        
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {getErrorMessage(error as ApiErrorResponse)}
          </Message>
        ) : (
          <form onSubmit={submitHandler} className="p-6 space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAdmin"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="isAdmin" className="ml-2 block text-gray-700">
                  Is Admin
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loadingUpdate}>
              Update
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default UserEditPage;