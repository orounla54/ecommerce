import React from 'react';
import { useSelector } from 'react-redux';
import ProductCard from './ProductCard';
import { selectProducts, selectProductStatus, selectProductError } from '../store/slices/productSlice';
import Loader from './Loader';
import Message from './Message';

const ProductGrid: React.FC = () => {
  const products = useSelector(selectProducts);
  const status = useSelector(selectProductStatus);
  const error = useSelector(selectProductError);

  if (status === 'loading') {
    return <Loader />;
  }

  if (status === 'failed') {
    return <Message variant="danger">{error}</Message>;
  }

  if (products.length === 0) {
    return <Message>Aucun produit trouvé</Message>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid; 