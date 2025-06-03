import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import {
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from '../../store/slices/categoriesApiSlice';
import { ApiErrorResponse, getErrorMessage } from '../../types';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const CategoryEditPage = () => {
  const { id: categoryId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const { data: category, isLoading, error } = useGetCategoryByIdQuery(categoryId ?? '');
  const [updateCategory, { isLoading: loadingUpdate }] = useUpdateCategoryMutation();

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || '');
      setImage(category.image || '');
    }
  }, [category]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      await updateCategory({
        id: categoryId ?? '',
        category: {
          name,
          description,
          image,
          productCount: category?.productCount || 0,
        },
      }).unwrap();
      
      toast.success('Category updated');
      navigate('/admin/categorylist');
    } catch (err: any) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Edit Category | Admin</title>
      </Helmet>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <Link to="/admin/categorylist" className="text-primary hover:text-primary-dark inline-flex items-center mb-4">
            <ArrowLeft size={16} className="mr-1" /> Back to Categories
          </Link>
          <h1 className="text-xl font-bold">Edit Category</h1>
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
              <label htmlFor="description" className="block text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-control"
              ></textarea>
            </div>

            <div>
              <label htmlFor="image" className="block text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="text"
                id="image"
                placeholder="Enter image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="form-control"
              />
              {image && (
                <div className="mt-2">
                  <img 
                    src={image} 
                    alt={name} 
                    className="w-24 h-24 object-cover rounded"
                  />
                </div>
              )}
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

export default CategoryEditPage;