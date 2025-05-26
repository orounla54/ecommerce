import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CategoryGrid from '../components/CategoryGrid';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useGetCategoriesQuery } from '../store/slices/categoriesApiSlice';
import { useGetFeaturedProductsQuery, useGetTopProductsQuery, useGetProductsQuery } from '../store/slices/productsApiSlice';
// Import Slider component and slick-carousel styles
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HomePage: React.FC = () => {
  const { data: categories, isLoading: isLoadingCategories, error: errorCategories } = useGetCategoriesQuery({});
  const { data: featuredProducts, isLoading: isLoadingFeaturedProducts, error: errorFeaturedProducts } = useGetFeaturedProductsQuery({});
  const { data: newProductsData, isLoading: isLoadingNewProducts, error: errorNewProducts } = useGetProductsQuery({ isNewProduct: 'true' });
  const newProducts = newProductsData?.products || [];
  const { data: topProducts, isLoading: isLoadingTopProducts, error: errorTopProducts } = useGetTopProductsQuery({});

  // Define banner data
  const banners = [
    {
      id: 1,
      src: '/images/banner-1.jpg',
      alt: 'Hero Banner 1',
      title: 'Bienvenue sur notre boutique',
      subtitle: 'Découvrez notre sélection de produits de qualité',
      link: '/products',
      linkText: 'Voir les produits',
    },
    {
      id: 2,
      src: '/images/banner-2.jpg',
      alt: 'Hero Banner 2',
      title: 'Des Offres Incroyables',
      subtitle: 'Trouvez les meilleurs prix sur une large gamme de produits',
      link: '/products',
      linkText: 'Découvrir les offres',
    },
    {
      id: 3,
      src: '/images/banner-3.jpg',
      alt: 'Hero Banner 3',
      title: 'Nouvelles Arrivées',
      subtitle: 'Explorez les derniers gadgets et technologies',
      link: '/products?isNewProduct=true',
      linkText: 'Voir les nouveautés',
    },
  ];

  // Main Hero Slider settings
  const heroSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear"
  };

  // Product Slider settings
  const productSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>TechShop | Accueil</title>
        <meta name="description" content="Trouvez les meilleurs produits technologiques sur TechShop" />
      </Helmet>

      {/* Hero Section - Slider */}
      <div className="relative mb-12 overflow-hidden rounded-lg">
        <Slider {...heroSettings}>
          {banners.map(banner => (
            <div key={banner.id} className="relative">
        <img
                src={banner.src}
                alt={banner.alt}
          className="h-[400px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">
                  {banner.title}
          </h1>
          <p className="mb-8 text-lg sm:text-xl">
                  {banner.subtitle}
          </p>
          <Link
                  to={banner.link}
            className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
                  {banner.linkText}
          </Link>
        </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Main Content Area with Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          {/* Categories Section in Sidebar */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Catégories</h2>
            {isLoadingCategories ? (
              <Loader />
            ) : errorCategories ? (
              <Message variant="danger">Erreur lors du chargement des catégories</Message>
            ) : !categories || categories.length === 0 ? (
              <Message>Aucune catégorie trouvée</Message>
            ) : (
              <CategoryGrid categories={categories} />
            )}
          </section>

          {/* Best Sellers Section in Sidebar (Placeholder) */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Meilleures ventes</h2>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-sm text-gray-600">Liste des meilleures ventes (à implémenter)</p>
            </div>
      </section>

          {/* Other potential sidebar content */}
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          {/* New Products Section */}
          <section className="mb-12">
        <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Nouveautés</h2>
          <Link
                to="/products?isNewProduct=true"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Voir tout
          </Link>
        </div>

            {isLoadingNewProducts ? (
          <Loader />
            ) : errorNewProducts ? (
              <Message variant="danger">Erreur lors du chargement des nouveautés</Message>
            ) : !Array.isArray(newProducts) || newProducts.length === 0 ? (
              <Message>Aucune nouveauté pour le moment</Message>
        ) : (
              // Display New Products in a Grid
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {newProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

          {/* Top Rated Products Section */}
      <section className="mb-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Mieux notés</h2>
              <Link
                to="/products?sortBy=rating"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                Voir tout
              </Link>
            </div>
            
            {isLoadingTopProducts ? (
              <Loader />
            ) : errorTopProducts ? (
              <Message variant="danger">Erreur lors du chargement des produits les mieux notés</Message>
            ) : !Array.isArray(topProducts) || topProducts.length === 0 ? (
              <Message>Aucun produit mieux noté pour le moment</Message>
            ) : (
              // Display Top Rated Products in a Grid
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {topProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </section>

          {/* Best Sellers Section (formerly Featured Products) - Main Content */}
          <section className="mb-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Meilleures ventes (principal)</h2>
              <Link
                to="/products?sortBy=sales"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                Voir tout
              </Link>
            </div>
            
            {isLoadingFeaturedProducts ? (
              <Loader />
            ) : errorFeaturedProducts ? (
              <Message variant="danger">Erreur lors du chargement des meilleures ventes</Message>
            ) : !Array.isArray(featuredProducts) || featuredProducts.length === 0 ? (
              <Message>Aucune meilleure vente pour le moment</Message>
            ) : (
              // Display Best Sellers Products in a Grid
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {featuredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
      </section>

        </div>
      </div>
    </div>
  );
};

export default HomePage;