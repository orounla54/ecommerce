import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';
import axios from 'axios';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchImageUrl = async () => {
      if (!category || !category.image) return;
      try {
        const response = await axios.get(category.image, { responseType: 'text' });
        setImageUrl(response.data);
      } catch (error) {
        console.error(`Error fetching image URL for ${category.name}:`, error);
        setImageUrl('');
      }
    };

    if (category?.image) {
      fetchImageUrl();
    }
  }, [category?.image, category?.name]);

  return (
    <Link
      to={`/category/${category._id}`}
      className="group flex items-center bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 p-2"
    >
      <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-md bg-gray-200 mr-4">
        {imageUrl === undefined ? (
          <div className="flex items-center justify-center h-full w-full bg-gray-200 text-gray-500">Loading...</div>
        ) : imageUrl === '' ? (
          <div className="flex items-center justify-center h-full w-full bg-gray-300 text-gray-600 text-xs">Image non disponible</div>
        ) : (
          <img
            src={imageUrl}
            alt={category.name}
            className="w-full h-full object-cover object-center"
          />
        )}
      </div>

      <div className="flex-grow">
        <h3 className="text-sm font-semibold text-gray-800">{category.name}</h3>
        <p className="mt-1 text-xs text-gray-600">({category.productCount} articles)</p>
      </div>

      <div className="flex-shrink-0 ml-2 text-indigo-600 group-hover:text-indigo-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
};

export default CategoryCard; 