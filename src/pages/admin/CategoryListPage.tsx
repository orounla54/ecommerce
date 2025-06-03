import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
  useCreateCategoryMutation,
} from '../../store/slices/categoriesApiSlice';
import { Category, ApiErrorResponse, getErrorMessage } from '../../types';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const CategoryListPage = () => {
  const navigate = useNavigate();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState('');

  const { data: categories, isLoading, refetch, error } = useGetCategoriesQuery({ pageNumber: 1 });
  const [deleteCategory, { isLoading: loadingDelete }] = useDeleteCategoryMutation();
  const [createCategory, { isLoading: loadingCreate }] = useCreateCategoryMutation();

  const deleteHandler = (id: string) => {
    setCategoryToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCategory(categoryToDelete as string).unwrap();
      refetch();
      setDeleteModalOpen(false);
      toast.success('Category deleted');
    } catch (err) {
      toast.error(getErrorMessage(err as ApiErrorResponse));
    }
  };

  const confirmCreate = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      await createCategory({
        name: newCategoryName,
        description: newCategoryDescription,
        image: newCategoryImage,
      }).unwrap();
      
      refetch();
      setCreateModalOpen(false);
      setNewCategoryName('');
      setNewCategoryDescription('');
      setNewCategoryImage('');
      toast.success('Category created');
    } catch (err) {
      toast.error(getErrorMessage(err as ApiErrorResponse));
    }
  };

  return (
    <>
      <Helmet>
        <title>Categories | Admin</title>
      </Helmet>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h1 className="text-xl font-bold">Categories</h1>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="btn btn-primary flex items-center"
          >
            <Plus size={18} className="mr-1" /> Add Category
          </button>
        </div>

        {loadingDelete && <Loader />}
        {loadingCreate && <Loader />}
        
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {getErrorMessage(error as ApiErrorResponse)}
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
                    NAME
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DESCRIPTION
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories?.map((category: Category) => (
                  <tr key={category._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                      <button
                        onClick={() => navigate(`/admin/category/${category._id}/edit`)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-dark hover:bg-primary-light hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        <Pencil size={14} className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => deleteHandler(category._id)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <Trash2 size={14} className="mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-medium mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this category?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="btn bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create category modal */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto w-full">
            <h3 className="text-lg font-medium mb-4">Create Category</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Enter category description"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  className="form-control"
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="image" className="block text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  id="image"
                  placeholder="Enter image URL"
                  value={newCategoryImage}
                  onChange={(e) => setNewCategoryImage(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setCreateModalOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={confirmCreate}
                className="btn btn-primary"
                disabled={loadingCreate}
              >
                {loadingCreate ? <Loader /> : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryListPage;