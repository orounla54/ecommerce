import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import { useGetProductsByCategoryQuery } from '../store/slices/productsApiSlice';
import { ApiErrorResponse, getErrorMessage } from '../types';
import Meta from '../components/Meta';

const CategoryPage = () => {
  const { categoryId, pageNumber = '1' } = useParams();
  const { search } = useLocation();
  const navigate = useNavigate();
  
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  
  const { data, isLoading, error } = useGetProductsByCategoryQuery({
    categoryId: categoryId || '',
    pageNumber: parseInt(pageNumber, 10),
    ...Object.fromEntries(new URLSearchParams(search)),
  });

  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newPriceRange = [...priceRange];
    newPriceRange[index] = Number(e.target.value);
    setPriceRange(newPriceRange);
  };

  const handleBrandToggle = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  // Get unique brands from products
  const uniqueBrands = data?.products
    ? [...new Set(data.products.map(product => product.brand))]
    : [];

  // Filter products
  const filteredProducts = data?.products?.filter(product => {
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    return matchesPrice && matchesBrand;
  });

  return (
    <>
      <Meta title={data?.category?.name || 'Category'} />
      <Link to="/" className="btn btn-light mb-4">
        Go Back
      </Link>
      <Helmet>
        <title>{data?.category?.name || 'Category'} | TechShop</title>
      </Helmet>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Mobile filter dialog */}
        <div className="md:hidden">
          <button
            type="button"
            className="flex items-center justify-center w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            onClick={toggleMobileFilters}
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>

        {/* Filters */}
        <div className={`${mobileFiltersOpen ? 'block' : 'hidden'} md:block w-full md:w-64 space-y-6`}>
          {/* Price filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-900">Price</h3>
            <div className="mt-2 space-y-2">
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(e, 0)}
                className="w-full"
              />
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(e, 1)}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Brand filter */}
          {uniqueBrands.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900">Brands</h3>
              <div className="mt-2 space-y-2">
                {uniqueBrands.map((brand) => (
                  <label key={brand} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1">
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">
              {getErrorMessage(error as ApiErrorResponse)}
            </Message>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{data?.category?.name}</h1>
                <p className="text-gray-600">
                  {filteredProducts?.length || 0} product(s)
                </p>
              </div>

              {filteredProducts && filteredProducts.length === 0 ? (
                <Message>No products found.</Message>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts?.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                  <Paginate
                    pages={data?.pages || 1}
                    page={data?.page || 1}
                    categoryId={categoryId ? categoryId : ''}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryPage;