import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { ArrowLeft, Upload } from 'lucide-react';
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../../store/slices/productsApiSlice';
import { useGetCategoriesQuery } from '../../store/slices/categoriesApiSlice';
import { ApiErrorResponse, getErrorMessage } from '../../types';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const ProductEditPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);

  const { data: product, isLoading, error } = useGetProductByIdQuery(productId ?? '');
  const { data: categories } = useGetCategoriesQuery({});

  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(typeof product.category === 'string' ? product.category : product.category._id);
      setCountInStock(product.countInStock);
      setDescription(product.description);
      setFeatured(product.featured || false);
    }
  }, [product]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      await updateProduct({
        id: productId ?? '',
        product: {
          name,
          price,
          description,
          image,
          brand,
          category,
          countInStock,
          featured,
        },
      }).unwrap();
      
      toast.success('Product updated');
      navigate('/admin/productlist');
    } catch (err: any) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    formData.append('image', file);
    
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success('Image uploaded');
      setImage(res.image);
    } catch (err: any) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Edit Product | Admin</title>
      </Helmet>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <Link to="/admin/productlist" className="text-primary hover:text-primary-dark inline-flex items-center mb-4">
            <ArrowLeft size={16} className="mr-1" /> Back to Products
          </Link>
          <h1 className="text-xl font-bold">Edit Product</h1>
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
              <label htmlFor="price" className="block text-gray-700 mb-2">
                Price
              </label>
              <input
                type="number"
                id="price"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="form-control"
                required
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-gray-700 mb-2">
                Image
              </label>
              <input
                type="text"
                id="image"
                placeholder="Enter image url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="form-control"
                required
              />
              <div className="mt-2">
                <label htmlFor="imageFile" className="btn btn-outline flex items-center w-full">
                  <Upload size={16} className="mr-2" />
                  Choose File
                  <input
                    type="file"
                    id="imageFile"
                    onChange={uploadFileHandler}
                    className="hidden"
                  />
                </label>
                {loadingUpload && <Loader />}
              </div>
            </div>

            <div>
              <label htmlFor="brand" className="block text-gray-700 mb-2">
                Brand
              </label>
              <input
                type="text"
                id="brand"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-control"
                required
              >
                <option value="">Select a category</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="countInStock" className="block text-gray-700 mb-2">
                Count In Stock
              </label>
              <input
                type="number"
                id="countInStock"
                placeholder="Enter count in stock"
                value={countInStock}
                onChange={(e) => setCountInStock(Number(e.target.value))}
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
                rows={5}
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-control"
                required
              ></textarea>
            </div>

            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-gray-700">
                  Featured Product
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

export default ProductEditPage;