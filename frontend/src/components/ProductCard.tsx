import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../store/slices/productSlice';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';
import axios from 'axios';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchImageUrl = async () => {
      if (!product || !product.image) return;
      try {
        const response = await axios.get(product.image, { responseType: 'text' });
        setImageUrl(response.data);
      } catch (error) {
        console.error(`Error fetching image URL for ${product.name}:`, error);
        setImageUrl('');
      }
    };

    if (product?.image) {
      fetchImageUrl();
    }
  }, [product?.image, product?.name]);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success('Produit ajouté au panier');
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-sm overflow-hidden transition-transform duration-200 hover:shadow-lg hover:-translate-y-1">
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100">
          <div className="flex-shrink-0 w-16 h-16 overflow-hidden bg-gray-100">
            {imageUrl === undefined ? (
              <div className="flex items-center justify-center h-full w-full bg-gray-200 text-gray-500">Loading...</div>
            ) : imageUrl === '' ? (
              <div className="flex items-center justify-center h-full w-full bg-gray-300 text-gray-600 text-xs">Image non disponible</div>
            ) : (
              <img
                src={imageUrl}
                alt={product.name}
                className="h-full w-full object-cover object-center group-hover:opacity-75"
              />
            )}
            {product.isNewProduct && (
               <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">Nouveau</span>
            )}
          </div>
        </div>
        
        <div className="p-3">
          <p className="text-xs text-gray-500 mb-1">{product.category}</p>
          
          <h3 className="text-sm font-medium text-gray-900 truncate leading-tight">
            {product.name}
          </h3>
          
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-yellow-400 text-sm">★</span>
              <span className="ml-0.5 text-xs text-gray-600">
                {product.rating.toFixed(1)}
              </span>
              {product.numReviews > 0 && (
                <span className="ml-2 text-xs text-gray-500">({product.numReviews} avis)</span>
              )}
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {product.price.toFixed(2)} €
            </p>
          </div>
        </div>
      </Link>
      <div className="p-3 pt-0">
        <button
          onClick={addToCartHandler}
          disabled={product.countInStock === 0}
          className={`w-full flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors duration-200
            ${
              product.countInStock === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {product.countInStock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;