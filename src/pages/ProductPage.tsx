import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { Minus, Plus, Star, Truck, ShieldCheck, RotateCcw, ShoppingCart } from 'lucide-react';
import {
  useGetProductByIdQuery,
  useCreateProductReviewMutation,
} from '../store/slices/productsApiSlice';
import { addToCart } from '../store/slices/cartSlice';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { RootState } from '../store';
import axios from 'axios';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { SerializedError } from '@reduxjs/toolkit';

const ProductPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const { userInfo } = useSelector((state: RootState) => state.auth);

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductByIdQuery(productId as string);

  const [createReview, { isLoading: loadingReview }] = useCreateProductReviewMutation();

  useEffect(() => {
    const fetchImageUrl = async () => {
      if (!product || !product.image) return;
      try {
        const response = await axios.get(product.image, { responseType: 'text' });
        setImageUrl(response.data);
      } catch (error) {
        console.error(`Error fetching image URL for ${product.name}:`, error);
        setImageUrl(''); // Set to empty string or a default placeholder URL on error
      }
    };

    if (product?.image) {
      fetchImageUrl();
    }
  }, [product?.image, product?.name]);

  const increaseQty = () => {
    if (product && qty < product.countInStock) {
      setQty(qty + 1);
    }
  };

  const decreaseQty = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  const addToCartHandler = () => {
    if (!product) return;
    
    dispatch(
      addToCart({
        ...product,
        qty,
      })
    );
    navigate('/cart');
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await createReview({
        productId: productId as string,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success('Review submitted');
      setRating(0);
      setComment('');
    } catch (err: any) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const getErrorMessage = (error: FetchBaseQueryError | SerializedError | any): string => {
    if ('data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
      return (error.data as any).message; // Access message from data object
    } else if ('error' in error && typeof error.error === 'string') {
      return error.error; // Access error string
    } else if ('message' in error && typeof error.message === 'string') {
      return error.message; // Access message string
    } else {
      return error.toString(); // Fallback to string representation
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {getErrorMessage(error)}
        </Message>
      ) : product ? (
        <>
          <Helmet>
            <title>{product.name} | TechShop</title>
          </Helmet>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Product Image */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm p-4 flex items-center justify-center">
              {imageUrl === undefined ? (
                <div className="flex items-center justify-center h-96 w-full bg-gray-200 text-gray-500">Loading...</div>
              ) : imageUrl === '' ? (
                <div className="flex items-center justify-center h-96 w-full bg-gray-300 text-gray-600">Image not available</div>
              ) : (
              <img
                  src={imageUrl}
                alt={product.name}
                className="w-full h-auto max-h-96 object-contain"
              />
              )}
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-secondary-dark mb-2">
                {product.name}
              </h1>
              
              <div className="flex items-center mb-4">
                <Rating value={product.rating} />
                <span className="ml-2 text-gray-500">
                  {product.numReviews} reviews
                </span>
              </div>
              
              <div className="text-2xl font-bold text-primary mb-6">
                ${product.price.toFixed(2)}
              </div>
              
              {/* Stock Status */}
              <div className="mb-6">
                {product.countInStock > 0 ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    In Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Out of Stock
                  </span>
                )}
              </div>
              
              {/* Benefits */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <Truck size={18} className="mr-2 text-primary" />
                  <span>Free shipping over $100</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <ShieldCheck size={18} className="mr-2 text-primary" />
                  <span>2-year warranty</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <RotateCcw size={18} className="mr-2 text-primary" />
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
              
              {/* Quantity Selector */}
              {product.countInStock > 0 && (
                <div className="flex items-center mb-6">
                  <span className="mr-4 font-medium">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={decreaseQty}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      disabled={qty <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-1 border-x border-gray-300">
                      {qty}
                    </span>
                    <button
                      onClick={increaseQty}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      disabled={qty >= product.countInStock}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Add to Cart Button */}
              <button
                className="btn btn-primary w-full md:w-auto flex items-center justify-center"
                disabled={product.countInStock === 0}
                onClick={addToCartHandler}
              >
                <ShoppingCart size={18} className="mr-2" />
                Add to Cart
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="flex border-b">
              <button
                className={`py-2 px-4 text-sm font-medium ${
                  activeTab === 'description'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button
                className={`py-2 px-4 text-sm font-medium ${
                  activeTab === 'specifications'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
                onClick={() => setActiveTab('specifications')}
              >
                Specifications
              </button>
              <button
                className={`py-2 px-4 text-sm font-medium ${
                  activeTab === 'reviews'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({product.reviews.length})
              </button>
            </div>
            
            <div className="py-4">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <p>{product.description}</p>
                </div>
              )}
              
              {activeTab === 'specifications' && (
                <div className="prose max-w-none">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium bg-gray-50">Brand</td>
                        <td className="py-2 px-4">{product.brand}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium bg-gray-50">Category</td>
                        <td className="py-2 px-4">{product.category.name}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium bg-gray-50">In Stock</td>
                        <td className="py-2 px-4">{product.countInStock}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Customer Reviews</h3>
                  
                  {product.reviews.length === 0 ? (
                    <Message>No reviews yet</Message>
                  ) : (
                    <div className="space-y-4 mb-6">
                      {product.reviews.map((review) => (
                        <div key={review._id} className="border-b pb-4">
                          <div className="flex items-center mb-1">
                            <span className="font-medium">{review.name}</span>
                          </div>
                          <div className="flex items-center mb-2">
                            <Rating value={review.rating} />
                            <span className="text-gray-400 text-sm ml-2">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <h3 className="text-lg font-medium mb-4">Write a Review</h3>
                  
                  {userInfo ? (
                    <form onSubmit={submitHandler}>
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Rating</label>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <button
                              type="button"
                              key={i}
                              onClick={() => setRating(i)}
                              className="focus:outline-none"
                            >
                              <Star
                                size={24}
                                className={i <= rating ? "text-yellow-500 fill-current" : "text-gray-300"}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="comment" className="block text-gray-700 mb-2">
                          Comment
                        </label>
                        <textarea
                          id="comment"
                          rows={4}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="form-control"
                          required
                        ></textarea>
                      </div>
                      
                      <button
                        type="submit"
                        disabled={loadingReview}
                        className="btn btn-primary"
                      >
                        Submit Review
                      </button>
                      
                      {loadingReview && <Loader />}
                    </form>
                  ) : (
                    <Message>
                      Please <a href="/login" className="text-primary hover:underline">sign in</a> to write a review
                    </Message>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default ProductPage;