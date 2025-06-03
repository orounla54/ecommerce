import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { useGetProductsQuery } from '../store/slices/productsApiSlice';
import { ApiErrorResponse, getErrorMessage } from '../types';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';

const ProductsPage = () => {
  const { keyword, pageNumber = '1' } = useParams();
  const { search } = useLocation();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword: keyword || '',
    pageNumber: parseInt(pageNumber, 10),
    ...Object.fromEntries(new URLSearchParams(search)),
  });

  return (
    <>
      <Meta />
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light mb-4">
          Go Back
        </Link>
      )}
      <h1>Latest Products</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {getErrorMessage(error as ApiErrorResponse)}
        </Message>
      ) : (
        <>
          <Row>
            {data?.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data?.pages || 1}
            page={data?.page || 1}
            keyword={keyword ? keyword : ''}
          />
        </>
      )}
    </>
  );
};

export default ProductsPage;