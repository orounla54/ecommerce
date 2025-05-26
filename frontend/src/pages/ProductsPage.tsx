import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useGetProductsQuery } from '../store/slices/productsApiSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';

const ProductsPage = () => {
  const { keyword = '', pageNumber = '1' } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      <Helmet>
        <title>{keyword ? `Search: ${keyword}` : 'All Products'} | TechShop</title>
      </Helmet>

      <h1 className="text-2xl font-bold mb-6">
        {keyword ? `Search Results for "${keyword}"` : 'All Products'}
      </h1>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          {data.products.length === 0 ? (
            <Message>
              No products found
              {keyword && ' matching your search criteria'}
            </Message>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {data.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <Paginate
                pages={data.pages}
                page={data.page}
                keyword={keyword ? keyword : ''}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default ProductsPage;